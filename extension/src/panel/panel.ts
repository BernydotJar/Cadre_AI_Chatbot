import { LIMITS } from "../../../src/core/limits";
import { approvedTextParts, buildRequestHistory, DISPLAY_MESSAGE_LIMIT, type Message } from "../../../src/ui/conversation";
import { PRESENTATION } from "../generated-config";
import { PORT_PANEL, TRANSPORT_TIMEOUT_MS, readWorkerReply, type PageContextId, type SafeErrorCode } from "../shared/contracts";

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
const contextLabel = element<HTMLParagraphElement>("context-label");
const contextCopy = element<HTMLParagraphElement>("context-copy");
const contextPrompt = element<HTMLButtonElement>("context-prompt");


type ContextCopy = { label: string; copy: string; prompt?: string };
const PAGE_CONTEXT_COPY: Record<PageContextId, ContextCopy> = {
  generic: { label: "YOU'RE EXPLORING CADRE", copy: "Ask about what Cadre does, where AI fits, or the next sensible step. This preview stays local to your browser and does not read the page." },
  home: { label: "CADRE · FRONT DOOR", copy: "You’re at the starting line. I can help turn the broad ‘where could AI help?’ question into something a little more useful.", prompt: "What does Cadre AI do?" },
  agents: { label: "CADRE · AI AGENTS", copy: "You’re in Cadre’s agent workshop. Before anyone releases a swarm, we can start with the one job actually worth automating.", prompt: "How does Cadre approach AI agents?" },
  "agents-discover": { label: "CADRE · DISCOVER AGENTS", copy: "You found the agent showroom. I promise not to recommend twelve agents where one workflow would do.", prompt: "How does Cadre approach AI agents?" },
  strategy: { label: "CADRE · AI STRATEGY", copy: "You’re looking at strategy — the part where an AI idea should earn its budget before it earns a demo.", prompt: "How does Cadre approach AI strategy?" },
  engineering: { label: "CADRE · AI ENGINEERING", copy: "You’re in the engineering layer: APIs, data, reliability, and the moment an AI idea has to survive production.", prompt: "What does Cadre AI Engineering cover?" },
  leadership: { label: "CADRE · LEADERSHIP", copy: "You’re on the people-and-adoption side. The model can be excellent and still fail if the operating model never changes.", prompt: "How does Cadre help teams adopt AI?" },
  industries: { label: "CADRE · INDUSTRIES", copy: "You’re browsing industry fit. The useful question is usually less ‘does AI work here?’ and more ‘which workflow has enough pain and volume to matter?’", prompt: "Which industries does Cadre work with?" },
  "case-studies": { label: "CADRE · CASE STUDIES", copy: "You’re in the evidence aisle. A healthy place to be before anyone starts making heroic AI claims.", prompt: "What kinds of Cadre client examples are published?" },
  contact: { label: "CADRE · CONTACT", copy: "You made it to the human handoff. I can still help sharpen the question so the first conversation starts one step ahead.", prompt: "What should I discuss with a Cadre strategist?" },
};
let pageContext: PageContextId = "generic";
function applyPageContext(next: PageContextId) {
  pageContext = next;
  const copy = PAGE_CONTEXT_COPY[next];
  contextLabel.textContent = copy.label;
  contextCopy.textContent = copy.copy;
  contextPrompt.hidden = !copy.prompt;
  contextPrompt.textContent = copy.prompt ? `Ask: ${copy.prompt}` : "";
  contextPrompt.dataset.prompt = copy.prompt ?? "";
}

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
  contextPrompt.disabled = !ready || Boolean(pending);
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
contextPrompt.addEventListener("click", (event) => {
  if (!event.isTrusted || !ready || pending) return;
  const prompt = contextPrompt.dataset.prompt;
  if (!prompt) return;
  input.value = prompt;
  send();
});
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
  if (message.type === "READY") { pageContext = message.pageContext; applyPageContext(pageContext); ready = true; status.textContent = "Ready. Do not share passwords or sensitive information."; render(); input.focus(); return; }
  if (message.type === "CONTEXT") { applyPageContext(message.pageContext); render(); return; }
  if (message.requestId !== pending?.requestId) return;
  if (message.type === "CHAT_ERROR") { settled(message.errorCode); return; }
  const reply: Message = { id: nextId++, role: "assistant", content: message.payload.reply, kind: message.payload.kind };
  if (reply.kind === "clarify" && !clarification.length) clarification = [messages.at(-1)!, reply];
  messages = [...messages, reply].slice(-DISPLAY_MESSAGE_LIMIT);
  settled();
  history.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "instant" });
});
port.onDisconnect.addListener(disconnected);
applyPageContext(pageContext);
render();
