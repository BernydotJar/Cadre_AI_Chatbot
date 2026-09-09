import { LIMITS } from "../../../src/core/limits";
import { readReply, type Reply, type RequestMessage } from "../../../src/ui/conversation";

export const PORT_HOST = "cadre-preview-host-v1";
export const PORT_PANEL = "cadre-preview-panel-v1";
export const TRANSPORT_TIMEOUT_MS = LIMITS.requestTimeoutMs + 5_000;
export const MAX_RESPONSE_BYTES = 16_384;
export const TOKEN_PATTERN = /^[0-9a-f]{32}$/u;
export const REQUEST_ID_PATTERN = /^[0-9a-f-]{36}$/u;
export type SafeErrorCode = "INVALID" | "BUSY" | "UNAVAILABLE" | "RATE_LIMIT" | "TIMEOUT" | "CANCELLED";
export type ChatPayload = { messages: RequestMessage[] };
export type PanelCommand =
  | { type: "CHAT_REQUEST"; requestId: string; payload: ChatPayload }
  | { type: "CANCEL"; requestId: string }
  | { type: "PING" }
  | { type: "MINIMIZE" }
  | { type: "CLOSE" };
export type WorkerReply =
  | { type: "READY" }
  | { type: "CHAT_RESPONSE"; requestId: string; payload: Reply }
  | { type: "CHAT_ERROR"; requestId: string; errorCode: SafeErrorCode };

export function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
export function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}
export function allowedSite(value: unknown, origins: readonly string[]): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return !url.username && !url.password && url.protocol === "https:" && origins.includes(url.origin);
  } catch { return false; }
}

/** The adapter is stricter about extra keys than the server's stripping schema.
 * Shared LIMITS + parity tests prevent a second product request contract. */
export function readChatPayload(value: unknown): ChatPayload | undefined {
  if (!record(value) || !exactKeys(value, ["messages"]) || !Array.isArray(value.messages)
    || value.messages.length < 1 || value.messages.length > LIMITS.maxMessages) return;
  const messages: RequestMessage[] = [];
  for (const item of value.messages) {
    if (!record(item) || !exactKeys(item, ["role", "content"])
      || (item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string") return;
    const content = item.content.trim();
    if (!content || content.length > LIMITS.maxMessageChars) return;
    messages.push({ role: item.role, content });
  }
  if (messages.at(-1)?.role !== "user") return;
  const parsed = { messages };
  if (new TextEncoder().encode(JSON.stringify(parsed)).byteLength > LIMITS.maxBodyBytes) return;
  return parsed;
}
export function readPanelCommand(value: unknown): PanelCommand | undefined {
  if (!record(value)) return;
  if ((value.type === "MINIMIZE" || value.type === "CLOSE" || value.type === "PING") && exactKeys(value, ["type"])) {
    return { type: value.type };
  }
  if (typeof value.requestId !== "string" || !REQUEST_ID_PATTERN.test(value.requestId)) return;
  if (value.type === "CANCEL" && exactKeys(value, ["type", "requestId"])) {
    return { type: "CANCEL", requestId: value.requestId };
  }
  if (value.type === "CHAT_REQUEST" && exactKeys(value, ["type", "requestId", "payload"])) {
    const payload = readChatPayload(value.payload);
    if (payload) return { type: "CHAT_REQUEST", requestId: value.requestId, payload };
  }
}
export function readStrictReply(value: unknown): Reply | undefined {
  return record(value) && exactKeys(value, ["reply", "kind"]) ? readReply(value) : undefined;
}
export function readWorkerReply(value: unknown): WorkerReply | undefined {
  if (!record(value)) return;
  if (value.type === "READY" && exactKeys(value, ["type"])) return { type: "READY" };
  if (typeof value.requestId !== "string" || !REQUEST_ID_PATTERN.test(value.requestId)) return;
  if (value.type === "CHAT_RESPONSE" && exactKeys(value, ["type", "requestId", "payload"])) {
    const payload = readStrictReply(value.payload);
    if (payload) return { type: "CHAT_RESPONSE", requestId: value.requestId, payload };
  }
  if (value.type === "CHAT_ERROR" && exactKeys(value, ["type", "requestId", "errorCode"])
    && typeof value.errorCode === "string"
    && ["INVALID", "BUSY", "UNAVAILABLE", "RATE_LIMIT", "TIMEOUT", "CANCELLED"].includes(value.errorCode)) {
    return { type: "CHAT_ERROR", requestId: value.requestId, errorCode: value.errorCode as SafeErrorCode };
  }
}
export function isHostSender(sender: PreviewSender | undefined, extensionId: string, origins: readonly string[]): boolean {
  return sender?.id === extensionId && sender.frameId === 0
    && Number.isInteger(sender.tab?.id) && typeof sender.documentId === "string"
    && allowedSite(sender.url, origins) && origins.includes(sender.origin ?? "");
}
export function panelToken(sender: PreviewSender | undefined, extensionId: string): string | undefined {
  if (sender?.id !== extensionId || !Number.isInteger(sender.tab?.id)
    || !Number.isInteger(sender.frameId) || (sender.frameId ?? 0) <= 0
    || typeof sender.documentId !== "string" || sender.origin !== `chrome-extension://${extensionId}`) return;
  try {
    const url = new URL(sender.url ?? "");
    const token = url.hash.slice(1);
    if (url.protocol === "chrome-extension:" && url.hostname === extensionId
      && url.pathname === "/panel.html" && !url.search && TOKEN_PATTERN.test(token)) return token;
  } catch { /* Reject malformed browser metadata. */ }
}

/** Bounded streaming read: provider errors/bodies are never forwarded to the UI. */
export async function readResponse(response: Response): Promise<Reply | undefined> {
  if (!response.ok || response.redirected || !response.body
    || !response.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    await response.body?.cancel().catch(() => undefined);
    return;
  }
  const declared = response.headers.get("content-length");
  if (declared && Number(declared) > MAX_RESPONSE_BYTES) {
    await response.body.cancel().catch(() => undefined);
    return;
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_RESPONSE_BYTES) { await reader.cancel(); return; }
      chunks.push(value);
    }
    const merged = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength; }
    return readStrictReply(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(merged)));
  } catch { return; }
  finally { reader.releaseLock(); }
}
