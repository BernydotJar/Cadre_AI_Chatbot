import { afterEach, describe, expect, it, vi } from "vitest";
import { installBridge } from "../src/shared/bridge";
import { PORT_HOST, PORT_PANEL, TRANSPORT_TIMEOUT_MS } from "../src/shared/contracts";

const extensionId = "abcdefghijklmnopabcdefghijklmnop";
const token = "a".repeat(32);
const endpoint = "https://cadre-ai-chatbot-tawny.vercel.app/api/chat";
const origins = ["https://cadre.ai", "https://www.cadre.ai"];
const requestId = "12345678-1234-1234-1234-123456789012";
const request = { type: "CHAT_REQUEST", requestId, payload: { messages: [{ role: "user", content: "services" }] } };
const ready = { type: "READY", pageContext: "home" };

class FakePort implements PreviewPort {
  messages: unknown[] = [];
  disconnected = false;
  private messageListeners: ((message: unknown) => void)[] = [];
  private disconnectListeners: (() => void)[] = [];
  constructor(public name: string, public sender?: PreviewSender) {}
  onMessage = { addListener: (listener: (message: unknown) => void) => { this.messageListeners.push(listener); } };
  onDisconnect = { addListener: (listener: () => void) => { this.disconnectListeners.push(listener); } };
  postMessage(message: unknown) { if (this.disconnected) throw new Error("Port disconnected"); this.messages.push(message); }
  receive(message: unknown) { if (!this.disconnected) for (const listener of this.messageListeners) listener(message); }
  // Chrome local disconnect notifies the OTHER endpoint, never this one.
  disconnect() { this.disconnected = true; }
  peerDisconnect() { if (this.disconnected) return; this.disconnected = true; for (const listener of this.disconnectListeners) listener(); }
}
function setup(fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ reply: "Safe answer", kind: "grounded" }))) {
  let connect: ((port: PreviewPort) => void) | undefined;
  const runtime = { id: extensionId, getURL: (value: string) => `chrome-extension://${extensionId}/${value}`, connect: () => new FakePort("unused"), onConnect: { addListener: (listener: (port: PreviewPort) => void) => { connect = listener; } } };
  installBridge(runtime, endpoint, origins, fetcher);
  const host = new FakePort(PORT_HOST, { id: extensionId, url: "https://cadre.ai/about", origin: origins[0], frameId: 0, documentId: "host-document", tab: { id: 4 } });
  const panel = new FakePort(PORT_PANEL, { id: extensionId, url: `chrome-extension://${extensionId}/panel.html#${token}`, origin: `chrome-extension://${extensionId}`, frameId: 1, documentId: "panel-document", tab: { id: 4 } });
  return { fetcher, host, panel, connect: (port: FakePort) => connect!(port), registered() { connect!(host); host.receive({ type: "REGISTER", token, pageContext: "home" }); connect!(panel); } };
}
async function flush() { for (let i = 0; i < 12; i++) await Promise.resolve(); }
afterEach(() => vi.useRealTimers());

describe("fixed API bridge", () => {
  it("requires a registered top-frame host before the extension panel", () => {
    const env = setup();
    env.connect(env.panel);
    expect(env.panel.disconnected).toBe(true);
    expect(env.fetcher).not.toHaveBeenCalled();
  });
  it("rejects ordinary page senders and arbitrary port names", () => {
    const env = setup();
    const page = new FakePort(PORT_HOST, { ...env.host.sender, id: undefined });
    const generic = new FakePort("fetch-proxy", env.host.sender);
    env.connect(page); env.connect(generic);
    expect(page.disconnected).toBe(true); expect(generic.disconnected).toBe(true);
    expect(env.fetcher).not.toHaveBeenCalled();
  });
  it("sends only bounded JSON to the configured API without credentials or redirects", async () => {
    const env = setup(); env.registered(); env.panel.receive(request); await flush();
    expect(env.host.messages).toContainEqual({ type: "REGISTERED" });
    expect(env.panel.messages).toContainEqual(ready);
    expect(env.fetcher).toHaveBeenCalledExactlyOnceWith(endpoint, expect.objectContaining({ method: "POST", body: JSON.stringify(request.payload), credentials: "omit", redirect: "error", cache: "no-store", referrerPolicy: "no-referrer" }));
    expect(env.panel.messages).toContainEqual({ type: "CHAT_RESPONSE", requestId, payload: { reply: "Safe answer", kind: "grounded" } });
  });
  it("rejects additional URL keys without any fetch", () => {
    const env = setup(); env.registered(); env.panel.receive({ ...request, url: "https://evil.test" });
    expect(env.panel.disconnected).toBe(true); expect(env.fetcher).not.toHaveBeenCalled();
  });
  it("rejects copied token on a different tab and duplicate panels", () => {
    const env = setup(); env.registered();
    const otherTab = new FakePort(PORT_PANEL, { ...env.panel.sender, tab: { id: 5 } });
    const duplicate = new FakePort(PORT_PANEL, env.panel.sender);
    env.connect(otherTab); env.connect(duplicate);
    expect(otherTab.disconnected).toBe(true); expect(duplicate.disconnected).toBe(true);
  });
  it("forwards only allowlisted page-context ids to an authenticated panel", () => {
    const env = setup(); env.registered();
    env.host.receive({ type: "CONTEXT", pageContext: "agents-discover" });
    expect(env.panel.messages).toContainEqual({ type: "CONTEXT", pageContext: "agents-discover" });
    env.host.receive({ type: "CONTEXT", pageContext: "https://evil.test" });
    expect(env.host.disconnected).toBe(true);
    expect(env.fetcher).not.toHaveBeenCalled();
  });
  it("deduplicates a request id and never automatically retries", async () => {
    const env = setup(); env.registered(); env.panel.receive(request); await flush(); env.panel.receive(request);
    expect(env.fetcher).toHaveBeenCalledTimes(1);
    expect(env.panel.messages).toContainEqual({ type: "CHAT_ERROR", requestId, errorCode: "BUSY" });
  });
  it("aborts on cancellation, disconnection and timeout", async () => {
    vi.useFakeTimers();
    for (const action of ["cancel", "disconnect", "timeout", "host-disconnect"] as const) {
      let signal: AbortSignal | undefined;
      const fetcher = vi.fn<typeof fetch>().mockImplementation((_url, init) => new Promise((_resolve, reject) => {
        signal = init?.signal as AbortSignal;
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      }));
      const env = setup(fetcher); env.registered(); env.panel.receive(request);
      if (action === "cancel") env.panel.receive({ type: "CANCEL", requestId });
      if (action === "disconnect") env.panel.peerDisconnect();
      if (action === "host-disconnect") env.host.peerDisconnect();
      if (action === "timeout") await vi.advanceTimersByTimeAsync(TRANSPORT_TIMEOUT_MS);
      await flush(); expect(signal?.aborted).toBe(true); expect(fetcher).toHaveBeenCalledTimes(1);
      if (action === "timeout") expect(env.panel.messages).toContainEqual({ type: "CHAT_ERROR", requestId, errorCode: "TIMEOUT" });
      if (action === "cancel") expect(env.panel.messages).toContainEqual({ type: "CHAT_ERROR", requestId, errorCode: "CANCELLED" });
    }
  });
  it.each([429, 500, 503])("maps HTTP %s to a safe error without response-body leakage", async (status) => {
    const env = setup(vi.fn<typeof fetch>().mockResolvedValue(Response.json({ error: "private upstream detail" }, { status })));
    env.registered(); env.panel.receive(request); await flush();
    expect(JSON.stringify(env.panel.messages)).not.toContain("private upstream");
    expect(env.panel.messages).toContainEqual({ type: "CHAT_ERROR", requestId, errorCode: status === 429 ? "RATE_LIMIT" : "UNAVAILABLE" });
    expect(env.fetcher).toHaveBeenCalledTimes(1);
  });
  it("only routes fixed presentation controls to its authenticated host", () => {
    const env = setup(); env.registered(); env.panel.receive({ type: "MINIMIZE" }); env.panel.receive({ type: "CLOSE" });
    expect(env.host.messages).toContainEqual({ type: "MINIMIZE" }); expect(env.host.messages).toContainEqual({ type: "CLOSE" });
    expect(env.panel.disconnected).toBe(true); expect(env.fetcher).not.toHaveBeenCalled();
  });
  it("accepts bounded panel keepalive without fetching and rejects extra payload", () => {
    const env = setup(); env.registered(); env.panel.receive({ type: "PING" });
    expect(env.fetcher).not.toHaveBeenCalled(); expect(env.panel.disconnected).toBe(false);
    env.panel.receive({ type: "PING", url: "https://evil.test" });
    expect(env.panel.disconnected).toBe(true); expect(env.fetcher).not.toHaveBeenCalled();
  });
  it("releases a locally closed panel slot before same-host reopen", () => {
    const env = setup(); env.registered();
    env.panel.receive({ type: "CLOSE" });
    env.panel.disconnect(); env.panel.peerDisconnect(); // Already closed: no callbacks.
    const reopened = new FakePort(PORT_PANEL, { ...env.panel.sender, documentId: "replacement-panel" });
    env.connect(reopened);
    expect(reopened.disconnected).toBe(false);
    expect(reopened.messages).toContainEqual(ready);
  });
  it("aborts and clears timers before locally rejecting a pending invalid command", async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    const fetcher = vi.fn<typeof fetch>().mockImplementation((_url, init) => new Promise((_resolve, reject) => {
      signal = init?.signal as AbortSignal;
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));
    const env = setup(fetcher); env.registered(); env.panel.receive(request);
    expect(vi.getTimerCount()).toBe(1);
    env.panel.receive({ type: "PING", unexpected: "reject" });
    expect(signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    expect(env.panel.disconnected).toBe(true);
    const reopened = new FakePort(PORT_PANEL, { ...env.panel.sender, documentId: "after-invalid" });
    env.connect(reopened);
    expect(reopened.messages).toContainEqual(ready);
    await flush();
    expect(env.panel.messages.filter((message) => (message as { type: string }).type.startsWith("CHAT_"))).toHaveLength(0);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("releases rejected host registrations rather than exhausting the eight-tab cap", () => {
    const env = setup();
    for (let id = 10; id < 18; id++) {
      const rejected = new FakePort(PORT_HOST, { ...env.host.sender, tab: { id }, documentId: `invalid-${id}` });
      env.connect(rejected); rejected.receive({ type: "REGISTER", token: "invalid" });
      expect(rejected.disconnected).toBe(true);
    }
    env.registered();
    expect(env.host.disconnected).toBe(false);
    expect(env.host.messages).toContainEqual({ type: "REGISTERED" });
    expect(env.panel.messages).toContainEqual(ready);
  });
  it("host rejection disposes its panel and pending request idempotently", async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    const fetcher = vi.fn<typeof fetch>().mockImplementation((_url, init) => new Promise((_resolve, reject) => {
      signal = init?.signal as AbortSignal;
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));
    const env = setup(fetcher); env.registered(); env.panel.receive(request);
    env.host.receive({ type: "REGISTER", token }); // Re-registration on same port is invalid.
    expect(signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    expect(env.panel.disconnected).toBe(true);
    env.host.peerDisconnect(); env.panel.peerDisconnect();
    const replacement = new FakePort(PORT_HOST, { ...env.host.sender, documentId: "new-host" });
    env.connect(replacement); replacement.receive({ type: "REGISTER", token, pageContext: "home" });
    expect(replacement.messages).toContainEqual({ type: "REGISTERED" });
    await flush();
  });
});
