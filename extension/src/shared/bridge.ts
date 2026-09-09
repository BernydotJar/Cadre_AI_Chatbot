import {
  PORT_HOST, PORT_PANEL, TOKEN_PATTERN, TRANSPORT_TIMEOUT_MS, exactKeys, isHostSender,
  panelToken, readPanelCommand, readResponse, record, type SafeErrorCode,
} from "./contracts";

type Panel = { port: PreviewPort; dispose: () => void };
type Host = { port: PreviewPort; documentId: string; token?: string; panel?: Panel };
const MAX_OPEN_TABS = 8;

function post(port: PreviewPort, message: unknown) {
  try { port.postMessage(message); } catch { /* Disconnected documents are not retry targets. */ }
}
function disconnect(port: PreviewPort) {
  try { port.disconnect(); } catch { /* Already disconnected. */ }
}
export function installBridge(runtime: typeof chrome.runtime, apiEndpoint: string, siteOrigins: readonly string[], fetcher: typeof fetch = fetch) {
const hosts = new Map<number, Host>();
runtime.onConnect.addListener((port) => {
  if (port.name === PORT_HOST) {
    if (!isHostSender(port.sender, runtime.id, siteOrigins)) { disconnect(port); return; }
    const tabId = port.sender!.tab!.id!;
    const previous = hosts.get(tabId);
    if (previous || hosts.size >= MAX_OPEN_TABS) { disconnect(port); return; }
    const host: Host = { port, documentId: port.sender!.documentId! };
    hosts.set(tabId, host);
    let hostClosed = false;
    function disposeHost() {
      if (hostClosed) return;
      hostClosed = true;
      if (hosts.get(tabId) === host) hosts.delete(tabId);
      host.panel?.dispose();
      // Local disconnect does not run this endpoint's onDisconnect handler.
      disconnect(port);
    }
    port.onMessage.addListener((message) => {
      if (hostClosed) return;
      if (host.token || !record(message) || !exactKeys(message, ["type", "token"])
        || message.type !== "REGISTER" || typeof message.token !== "string" || !TOKEN_PATTERN.test(message.token)) {
        disposeHost(); return;
      }
      host.token = message.token;
      post(port, { type: "REGISTERED" });
    });
    port.onDisconnect.addListener(disposeHost);
    return;
  }
  if (port.name !== PORT_PANEL) { disconnect(port); return; }
  const token = panelToken(port.sender, runtime.id);
  const candidateHost = hosts.get(port.sender?.tab?.id ?? -1);
  if (!token || !candidateHost || candidateHost.token !== token || candidateHost.panel) { disconnect(port); return; }
  const host: Host = candidateHost;
  let pending: { requestId: string; controller: AbortController; timer: ReturnType<typeof setTimeout> } | undefined;
  let closed = false;
  const seen = new Set<string>();
  function disposePanel() {
    if (closed) return;
    closed = true;
    if (pending) {
      clearTimeout(pending.timer);
      pending.controller.abort();
      pending = undefined;
    }
    if (host.panel?.port === port) host.panel = undefined;
    // Drop the iframe on remote loss as well as explicit CLOSE; a dead channel
    // must not strand its Close button inside an unusable panel.
    post(host.port, { type: "CLOSE" });
    disconnect(port);
  }
  host.panel = { port, dispose: disposePanel };
  function error(requestId: string, errorCode: SafeErrorCode) {
    post(port, { type: "CHAT_ERROR", requestId, errorCode });
  }
  port.onMessage.addListener((raw) => {
    if (closed) return;
    const message = readPanelCommand(raw);
    if (!message) { disposePanel(); return; }
    if (message.type === "PING") return; // Active panel port traffic, never an HTTP request.
    if (message.type === "MINIMIZE") { post(host.port, { type: "MINIMIZE" }); return; }
    if (message.type === "CLOSE") {
      disposePanel();
      return;
    }
    if (message.type === "CANCEL") {
      if (pending?.requestId === message.requestId) pending.controller.abort();
      return;
    }
    if (seen.has(message.requestId) || pending || seen.size >= 100) {
      error(message.requestId, "BUSY"); return;
    }
    seen.add(message.requestId);
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, TRANSPORT_TIMEOUT_MS);
    pending = { requestId: message.requestId, controller, timer };
    void (async () => {
      try {
        const response = await fetcher(apiEndpoint, {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify(message.payload), signal: controller.signal,
          credentials: "omit", redirect: "error", cache: "no-store", referrerPolicy: "no-referrer",
        });
        const reply = await readResponse(response);
        if (closed) return;
        if (controller.signal.aborted) error(message.requestId, timedOut ? "TIMEOUT" : "CANCELLED");
        else if (reply) post(port, { type: "CHAT_RESPONSE", requestId: message.requestId, payload: reply });
        else error(message.requestId, response.status === 429 ? "RATE_LIMIT" : "UNAVAILABLE");
      } catch {
        if (!closed) error(message.requestId, controller.signal.aborted ? (timedOut ? "TIMEOUT" : "CANCELLED") : "UNAVAILABLE");
      } finally {
        clearTimeout(timer);
        if (pending?.requestId === message.requestId) pending = undefined;
      }
    })();
  });
  port.onDisconnect.addListener(disposePanel);
  post(port, { type: "READY" });
});
}
