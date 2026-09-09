import { LIMITS } from "../../../src/core/limits";
import { approvedTextParts, buildRequestHistory, DISPLAY_MESSAGE_LIMIT, type Message } from "../../../src/ui/conversation";
import { PRESENTATION } from "../generated-config";
import { PORT_PANEL, TRANSPORT_TIMEOUT_MS, readWorkerReply, type SafeErrorCode } from "../shared/contracts";

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error("Missing local panel element");
  return found as T;
}
const form = element<HTMLFormElement>("composer");
const input = element<HTMLTextAreaElement>("message");
const submit = element<HTMLButtonElement>("send");
const stop = element<HTMLButtonElement>("stop");
const retry = element<HTMLButtonElement>("retry");
const status = element<HTMLParagraphElement>("status");
const history = element<HTMLDivElement>("conversation");
const welcome = element<HTMLDivElement>("welcome");
const topics = element<HTMLDivElement>("topics");
const counter = element<HTMLOutputElement>("counter");
const errors: Record<SafeErrorCode, string> = {
  INVALID: "That message could not be sent. Please shorten it and try again.",
  BUSY: "A request is already running, or this preview session has reached its limit. Close and reopen the panel if needed.",
  UNAVAILABLE: "The assistant is unavailable. Your message was not lost. You can retry once you are ready.",
  RATE_LIMIT: "The assistant is busy. Wait at least a minute before retrying.",
  TIMEOUT: "The request took too long. You can choose to retry; an earlier request may already have reached the service.",
  CANCELLED: "Stopped. The message may already have reached the service. Nothing will retry automatically.",
};
let messages: Message[] = [];
let clarification: Message[] = [];
let nextId = 1;
let ready = false;
let alive = true;
let composing = false;
let pending: { requestId: string; timer: ReturnType<typeof setTimeout> } | undefined;
let failed = false;
const port = chrome.runtime.connect({ name: PORT_PANEL });
// MV3 can stop an idle worker. Keep only an existing conversation panel's
// authenticated channel active; no provider call and no background page polling.
const heartbeat = setInterval(() => { if (ready && alive) post({ type: "PING" }); }, 20_000);
const sessionDeadline = setTimeout(() => { end(); disconnected(); }, 30 * 60_000);

function textWithLinks(container: HTMLElement, text: string) {
  for (const part of approvedTextParts(text, PRESENTATION.links)) {
    if (!part.href) { container.append(document.createTextNode(part.text)); continue; }
    const link = document.createElement("a");
    link.href = part.href;
    link.textContent = part.text;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    container.append(link);
  }
}
function render() {
  welcome.hidden = messages.length > 0;
  history.replaceChildren();
  for (const message of messages.slice(-DISPLAY_MESSAGE_LIMIT)) {
    const item = document.createElement("section");
    item.className = `message ${message.role}`;
    const label = document.createElement("h2");
    label.textContent = message.role === "user" ? "You" : PRESENTATION.botName;
    const body = document.createElement("p");
    textWithLinks(body, message.content);
    item.append(label, body);
    history.append(item);
  }
  input.readOnly = !ready || Boolean(pending);
  submit.disabled = !ready || Boolean(pending) || input.value.trim().length > LIMITS.maxMessageChars;
  submit.hidden = Boolean(pending);
  stop.hidden = !pending;
  retry.hidden = !failed || Boolean(pending) || !ready;
  for (const button of topics.querySelectorAll("button")) button.disabled = !ready || Boolean(pending);
  counter.textContent = `${input.value.length} / ${LIMITS.maxMessageChars}`;
}
function post(message: unknown): boolean {
  try { port.postMessage(message); return true; }
  catch { disconnected(); return false; }
}
function settled(error?: SafeErrorCode) {
  if (pending) clearTimeout(pending.timer);
  pending = undefined;
  failed = Boolean(error) && error !== "CANCELLED";
  status.textContent = error ? errors[error] : "Reply received.";
  render();
}
function send(isRetry = false) {
  if (!ready || pending) return;
  const content = input.value.trim();
  if (!isRetry && (!content || content.length > LIMITS.maxMessageChars)) {
    status.textContent = !content ? "Write a message first." : `Keep your message within ${LIMITS.maxMessageChars} characters.`;
    input.focus();
    return;
  }
  if (isRetry && (!failed || messages.at(-1)?.role !== "user")) return;
  if (!isRetry) {
    messages = [...messages, { id: nextId++, role: "user" as const, content }].slice(-DISPLAY_MESSAGE_LIMIT);
    input.value = "";
  }
  failed = false;
  const requestId = crypto.randomUUID();
  pending = {
    requestId,
    timer: setTimeout(() => {
      if (pending?.requestId !== requestId) return;
      post({ type: "CANCEL", requestId });
      settled("TIMEOUT");
    }, TRANSPORT_TIMEOUT_MS + 1_000),
  };
  status.textContent = "Thinking…";
  render();
  input.focus();
  post({ type: "CHAT_REQUEST", requestId, payload: { messages: buildRequestHistory(messages, clarification) } });
}
function cancel() {
  if (!pending) return;
  const id = pending.requestId;
  post({ type: "CANCEL", requestId: id });
  settled("CANCELLED");
  input.focus();
}
function disconnected() {
  if (!alive) return;
  alive = false;
  clearInterval(heartbeat);
  clearTimeout(sessionDeadline);
  ready = false;
  if (pending) clearTimeout(pending.timer);
  pending = undefined;
  failed = false;
  status.textContent = "Preview disconnected. Close this panel and refresh the page after enabling the extension.";
  render();
}
function end() {
  clearInterval(heartbeat);
  clearTimeout(sessionDeadline);
  if (pending) post({ type: "CANCEL", requestId: pending.requestId });
  if (pending) clearTimeout(pending.timer);
  pending = undefined;
  try { port.disconnect(); } catch { /* Already disabled or disconnected. */ }
}
for (const topic of PRESENTATION.topics) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = topic.label;
  button.disabled = true;
  button.addEventListener("click", (event) => {
    if (!event.isTrusted) return;
    input.value = topic.label;
    send();
  });
  topics.append(button);
}
form.addEventListener("submit", (event) => { event.preventDefault(); if (event.isTrusted) send(); });
input.addEventListener("input", () => { counter.textContent = `${input.value.length} / ${LIMITS.maxMessageChars}`; submit.disabled = !ready || Boolean(pending) || input.value.trim().length > LIMITS.maxMessageChars; });
input.addEventListener("compositionstart", () => { composing = true; });
input.addEventListener("compositionend", () => { composing = false; });
input.addEventListener("keydown", (event) => {
  if (event.isTrusted && event.key === "Enter" && !event.shiftKey && !event.isComposing && !composing && event.keyCode !== 229) {
    event.preventDefault(); send();
  }
});
stop.addEventListener("click", (event) => { event.preventDefault(); if (event.isTrusted) cancel(); });
retry.addEventListener("click", (event) => { if (event.isTrusted) send(true); });
element<HTMLButtonElement>("reset").addEventListener("click", (event) => {
  if (!event.isTrusted) return;
  cancel();
  messages = [];
  clarification = [];
  failed = false;
  input.value = "";
  status.textContent = "Conversation cleared from this panel.";
  render();
  input.focus();
});
element<HTMLButtonElement>("minimize").addEventListener("click", (event) => { if (event.isTrusted) post({ type: "MINIMIZE" }); });
element<HTMLButtonElement>("close").addEventListener("click", (event) => {
  if (!event.isTrusted) return;
  if (pending) post({ type: "CANCEL", requestId: pending.requestId });
  post({ type: "CLOSE" });
  end();
});
document.addEventListener("keydown", (event) => { if (event.isTrusted && event.key === "Escape") { event.preventDefault(); post({ type: "MINIMIZE" }); } });
window.addEventListener("pagehide", end, { once: true });
port.onMessage.addListener((raw) => {
  const message = readWorkerReply(raw);
  if (!message) { end(); disconnected(); return; }
  if (message.type === "READY") { ready = true; status.textContent = "Ready. Do not share passwords or sensitive information."; render(); input.focus(); return; }
  if (message.requestId !== pending?.requestId) return;
  if (message.type === "CHAT_ERROR") { settled(message.errorCode); return; }
  const reply: Message = { id: nextId++, role: "assistant", content: message.payload.reply, kind: message.payload.kind };
  if (reply.kind === "clarify" && !clarification.length) clarification = [messages.at(-1)!, reply];
  messages = [...messages, reply].slice(-DISPLAY_MESSAGE_LIMIT);
  settled();
  history.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "instant" });
});
port.onDisconnect.addListener(disconnected);
render();
