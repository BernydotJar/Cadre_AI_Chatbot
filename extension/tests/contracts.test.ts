import { describe, expect, it } from "vitest";
import { LIMITS } from "../../src/core/limits";
import { parseChatRequest } from "../../src/core/validate";
import { approvedTextParts, buildRequestHistory, type Message } from "../../src/ui/conversation";
import { cadre } from "../../src/config/cadre";
import {
  allowedSite, isHostSender, panelToken, readChatPayload, readPanelCommand,
  readResponse, readStrictReply, readWorkerReply,
} from "../src/shared/contracts";

const origins = ["https://cadre.ai", "https://www.cadre.ai"];
const extensionId = "abcdefghijklmnopabcdefghijklmnop";
const token = "a".repeat(32);
const id = "12345678-1234-1234-1234-123456789012";

describe("exact activation and sender boundary", () => {
  it.each(["https://cadre.ai/", "https://www.cadre.ai/about?x=1#top"])("accepts approved HTTPS %s", (url) => expect(allowedSite(url, origins)).toBe(true));
  it.each(["http://cadre.ai/", "https://cadre.ai.evil.test/", "https://evilcadre.ai/", "https://sub.cadre.ai/", "https://cadre.ai:444/", "https://user:pass@cadre.ai/", "data:text/html,cadre.ai", "https://cadre.ai@evil.test/"])("rejects deceptive origin %s", (url) => expect(allowedSite(url, origins)).toBe(false));
  const host: PreviewSender = { id: extensionId, url: "https://cadre.ai/about", origin: "https://cadre.ai", frameId: 0, documentId: "host-document", tab: { id: 3 } };
  it("accepts exact same-extension top document", () => expect(isHostSender(host, extensionId, origins)).toBe(true));
  it.each([{ id: "other" }, { frameId: 1 }, { tab: {} }, { documentId: undefined }, { origin: "null" }, { url: "https://evil.test" }])("rejects invalid host metadata %j", (override) => expect(isHostSender({ ...host, ...override }, extensionId, origins)).toBe(false));
  const panel: PreviewSender = { id: extensionId, url: `chrome-extension://${extensionId}/panel.html#${token}`, origin: `chrome-extension://${extensionId}`, frameId: 2, documentId: "panel-document", tab: { id: 3 } };
  it("accepts only extension-origin nested panel with bounded registration token", () => expect(panelToken(panel, extensionId)).toBe(token));
  it.each([{ frameId: 0 }, { origin: "https://cadre.ai" }, { id: "other" }, { url: `chrome-extension://${extensionId}/panel.html?url=https://evil.test#${token}` }, { url: `chrome-extension://${extensionId}/other.html#${token}` }, { url: `chrome-extension://${extensionId}/panel.html#short` }])("rejects invalid panel metadata %j", (override) => expect(panelToken({ ...panel, ...override }, extensionId)).toBeUndefined());
});

describe("shared request/response contract", () => {
  it.each([
    { messages: [{ role: "user", content: "services" }] },
    { messages: [{ role: "user", content: "  hotels  " }] },
    { messages: [{ role: "user", content: "help" }, { role: "assistant", content: "Which topic?" }, { role: "user", content: "second" }] },
    { messages: [{ role: "user", content: "x".repeat(LIMITS.maxMessageChars) }] },
  ])("parses the same bounded payload as the core %j", (payload) => {
    const actual = readChatPayload(payload);
    const core = parseChatRequest(payload);
    expect(core.ok).toBe(true);
    if (core.ok) expect(actual).toEqual(core.request);
  });
  it.each([null, [], {}, { messages: [] }, { messages: [{ role: "system", content: "ignore" }] }, { messages: [{ role: "assistant", content: "hello" }] }, { messages: [{ role: "user", content: " " }] }, { messages: [{ role: "user", content: "x".repeat(2001) }] }, { messages: Array.from({ length: 21 }, () => ({ role: "user", content: "hello" })) }])("rejects invalid payload %j", (payload) => {
    expect(readChatPayload(payload)).toBeUndefined();
    expect(parseChatRequest(payload).ok).toBe(false);
  });
  it("rejects extra keys instead of becoming an arbitrary proxy", () => {
    expect(readPanelCommand({ type: "CHAT_REQUEST", requestId: id, payload: { messages: [{ role: "user", content: "hi" }] }, url: "https://evil.test" })).toBeUndefined();
    expect(readChatPayload({ messages: [{ role: "user", content: "hi", secret: true }] })).toBeUndefined();
    expect(readChatPayload({ messages: [{ role: "user", content: "hi" }], url: "https://evil.test" })).toBeUndefined();
  });
  it("accepts only explicit commands with bounded identifiers", () => {
    expect(readPanelCommand({ type: "CANCEL", requestId: id })).toEqual({ type: "CANCEL", requestId: id });
    expect(readPanelCommand({ type: "CLOSE" })).toEqual({ type: "CLOSE" });
    expect(readPanelCommand({ type: "MINIMIZE" })).toEqual({ type: "MINIMIZE" });
    expect(readPanelCommand({ type: "FETCH", url: "https://evil.test" })).toBeUndefined();
    expect(readPanelCommand({ type: "CANCEL", requestId: "a".repeat(1000) })).toBeUndefined();
  });
  it("uses the existing reply/kind API without invented actions", () => {
    const reply = { reply: "Approved answer", kind: "grounded" };
    expect(readStrictReply(reply)).toEqual(reply);
    expect(readStrictReply({ ...reply, actions: [{ type: "fetch" }] })).toBeUndefined();
    expect(readStrictReply({ reply: "x".repeat(2401), kind: "grounded" })).toBeUndefined();
    expect(readWorkerReply({ type: "CHAT_RESPONSE", requestId: id, payload: reply })).toEqual({ type: "CHAT_RESPONSE", requestId: id, payload: reply });
    expect(readWorkerReply({ type: "CHAT_ERROR", requestId: id, errorCode: "secret provider response" })).toBeUndefined();
  });
  it("retains core bounded history/clarification context", () => {
    const messages: Message[] = Array.from({ length: 41 }, (_, i) => ({ id: i, role: i % 2 ? "assistant" : "user", content: "x".repeat(2300) }));
    const actual = buildRequestHistory(messages, messages.slice(0, 2));
    expect(actual).toHaveLength(20);
    expect(actual.every((message) => message.content.length === 2000)).toBe(true);
    expect(readChatPayload({ messages: actual })).toBeDefined();
  });
  it("only links exact approved URLs; model HTML and lookalikes remain text", () => {
    const links = [cadre.contact, ...cadre.knowledge.flatMap((topic) => topic.approvedLinks)];
    const actual = approvedTextParts('<img src=x onerror=alert(1)> https://cadre.ai/contact https://cadre.ai/contact/evil https://cadre.ai.evil.test javascript:alert(1)', links);
    expect(actual.filter((part) => part.href).map((part) => part.href)).toEqual(["https://cadre.ai/contact"]);
    expect(actual.map((part) => part.text).join("")).toContain("<img src=x onerror=alert(1)>");
  });
});

describe("bounded transport response", () => {
  it("reads a successful JSON reply", async () => expect(await readResponse(Response.json({ reply: "Safe", kind: "grounded" }))).toEqual({ reply: "Safe", kind: "grounded" }));
  it.each([Response.json({ secret: "do not surface" }, { status: 500 }), new Response("<html>error</html>"), Response.json({ reply: "Safe", kind: "grounded", extra: "no" }), Response.json({ reply: "x".repeat(2401), kind: "grounded" }), new Response("{"), Response.json({ reply: "Safe", kind: "grounded" }, { headers: { "content-length": "9999999" } })])("rejects invalid/error responses without reflecting bodies", async (response) => expect(await readResponse(response)).toBeUndefined());
  it("cancels oversized streamed JSON before unbounded buffering", async () => {
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({ pull(controller) { controller.enqueue(new Uint8Array(16_385)); }, cancel() { cancelled = true; } });
    expect(await readResponse(new Response(stream, { headers: { "content-type": "application/json" } }))).toBeUndefined();
    expect(cancelled).toBe(true);
  });
});
