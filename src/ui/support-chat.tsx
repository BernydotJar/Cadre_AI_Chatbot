"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";
import { LIMITS } from "@/core/limits";
import {
  approvedTextParts, buildRequestHistory, CLIENT_TIMEOUT_MS, DISPLAY_MESSAGE_LIMIT,
  readReply, type ApprovedLink, type Message, type RequestMessage,
} from "./conversation";

type Props = {
  clientName: string;
  botName: string;
  contact: ApprovedLink;
  topics: { id: string; label: string }[];
  approvedLinks: ApprovedLink[];
  modeLabel: "Demo mode" | "Live model configured" | "Chat unavailable";
};
type FailedTurn = { message: Message; request: RequestMessage[]; reason: string };
type Operation = { controller: AbortController; stopped: boolean; timedOut: boolean };
class RequestFailure extends Error {}

// Keep server HTML and the first hydration render non-interactive. React
// switches to the client snapshot only once handlers can own the draft.
const subscribeToReadiness = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M5 12h14m-6-6 6 6-6 6"}
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark${small ? " brand-mark-small" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 32 32" fill="none"><path d="M24 7H8v18h16M18 7v18M8 16h16" stroke="currentColor" strokeWidth="2" /></svg>
  </span>;
}

function AgentSignal({ compact = false }: { compact?: boolean }) {
  return <span className={`agent-signal${compact ? " agent-signal-compact" : ""}`} aria-hidden="true">
    <span className="signal-glow" />
    <span className="signal-orbit signal-orbit-one"><i /></span>
    <span className="signal-orbit signal-orbit-two"><i /></span>
    <span className="signal-core"><BrandMark small /></span>
  </span>;
}

function ReplyText({ text, links }: { text: string; links: ApprovedLink[] }) {
  return <div className="message-text">{approvedTextParts(text, links).map((part, index) => part.href
    ? <a key={index} href={part.href} target="_blank" rel="noopener noreferrer">{part.text}<span className="sr-only"> (opens in a new tab)</span></a>
    : <span key={index}>{part.text}</span>)}</div>;
}

export function SupportChat({ clientName, botName, contact, topics, approvedLinks, modeLabel }: Props) {
  const ready = useSyncExternalStore(subscribeToReadiness, clientReady, serverReady);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState<FailedTurn | null>(null);
  const [validation, setValidation] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [awayFromLatest, setAwayFromLatest] = useState(false);
  const [historyTrimmed, setHistoryTrimmed] = useState(false);
  const active = useRef<Operation | null>(null);
  const nextId = useRef(1);
  const clarification = useRef<Message[]>([]);
  const transcript = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const followingLatest = useRef(true);
  const composing = useRef(false);

  useEffect(() => () => {
    const operation = active.current;
    active.current = null;
    operation?.controller.abort();
  }, []);

  useEffect(() => {
    if (!transcript.current) return;
    if (messages.length === 0) {
      transcript.current.scrollTop = 0;
    } else if (followingLatest.current) {
      transcript.current.scrollTop = transcript.current.scrollHeight;
    }
  }, [messages, pending, failed]);

  useEffect(() => {
    if (!composer.current) return;
    composer.current.style.height = "auto";
    composer.current.style.height = `${Math.min(composer.current.scrollHeight, 144)}px`;
  }, [draft]);

  function keepBounded(next: Message[]) {
    if (next.length > DISPLAY_MESSAGE_LIMIT) setHistoryTrimmed(true);
    setMessages(next.slice(-DISPLAY_MESSAGE_LIMIT));
  }

  function jumpToLatest() {
    composer.current?.focus({ preventScroll: true });
    followingLatest.current = true;
    setAwayFromLatest(false);
    if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight;
  }

  async function requestReply(message: Message, request: RequestMessage[]) {
    // Own the flight synchronously; React state alone cannot block rapid events.
    if (active.current) return;
    const operation: Operation = { controller: new AbortController(), stopped: false, timedOut: false };
    active.current = operation;
    // Topic, Send, and Retry controls disappear as a request starts. Hand
    // focus to the stable composer on activation, never on response arrival.
    composer.current?.focus({ preventScroll: true });
    setPending(true);
    setFailed(null);
    setValidation("");
    setDraft("");
    setAnnouncement("Getting a response.");
    const timeout = window.setTimeout(() => {
      operation.timedOut = true;
      operation.controller.abort();
    }, CLIENT_TIMEOUT_MS);

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: request }), signal: operation.controller.signal,
      });
      if (!response.ok) throw new RequestFailure(response.status === 429
        ? "Chat is busy. Please wait a moment, then try again."
        : response.status === 504 ? "The response took too long. Please try again."
          : "We couldn't get a response. Please try again or contact the team.");
      let reply;
      try { reply = readReply(await response.json()); } catch { /* Safe recovery below. */ }
      if (!reply) throw new RequestFailure("We couldn't read the response. Please try again.");
      if (active.current !== operation || operation.controller.signal.aborted) return;
      const answer: Message = { id: nextId.current++, role: "assistant", content: reply.reply, kind: reply.kind };
      if (reply.kind === "clarify" && clarification.current.length === 0) clarification.current = [message, answer];
      setMessages((current) => [...current, answer].slice(-DISPLAY_MESSAGE_LIMIT));
      setAnnouncement(`${botName} replied. ${reply.reply}`);
    } catch (error) {
      if (active.current !== operation) return;
      const reason = operation.stopped ? "Response stopped."
        : operation.timedOut ? "The response took too long. Please try again."
          : error instanceof TypeError ? "We couldn't connect. Check your connection and try again."
            : error instanceof RequestFailure ? error.message : "We couldn't get a response. Please try again.";
      setFailed({ message, request, reason });
      setDraft(message.content);
      setAnnouncement("");
    } finally {
      window.clearTimeout(timeout);
      if (active.current === operation) { active.current = null; setPending(false); }
    }
  }

  function send(content: string) {
    if (active.current) return;
    const trimmed = content.trim();
    if (!trimmed) { setValidation("Write a message before sending."); composer.current?.focus(); return; }
    if (trimmed.length > LIMITS.maxMessageChars) {
      setValidation("Please keep your message to 2,000 characters or fewer.");
      composer.current?.focus();
      return;
    }
    if (failed && trimmed === failed.message.content) { void requestReply(failed.message, failed.request); return; }
    const previous = failed ? messages.filter((item) => item.id !== failed.message.id) : messages;
    const message: Message = { id: nextId.current++, role: "user", content: trimmed };
    const next = [...previous, message];
    keepBounded(next);
    void requestReply(message, buildRequestHistory(next, clarification.current));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); send(draft); }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing
      && !composing.current && event.nativeEvent.keyCode !== 229) { event.preventDefault(); send(draft); }
  }
  function stopResponse(event: MouseEvent<HTMLButtonElement>) {
    // Aborting can settle the request during this click. Prevent activation
    // from submitting the form even if React renders the idle state now.
    event.preventDefault();
    if (!active.current) return;
    composer.current?.focus({ preventScroll: true });
    active.current.stopped = true;
    active.current.controller.abort();
  }
  function newConversation() {
    const operation = active.current;
    active.current = null;
    operation?.controller.abort();
    clarification.current = [];
    setMessages([]); setDraft(""); setPending(false); setFailed(null); setValidation(""); setHistoryTrimmed(false);
    setAnnouncement("New conversation started. Previous messages have been cleared from this page.");
    followingLatest.current = true; setAwayFromLatest(false); composer.current?.focus();
  }

  const started = messages.length > 0;
  const overLimit = draft.trim().length > LIMITS.maxMessageChars;

  return <div className="support-shell">
    <a className="skip-link" href="#message">Skip to message</a>
    <header className="site-header">
      <div className="wordmark"><BrandMark /><span>{clientName}</span></div>
      <a className="contact-link" href={contact.url} target="_blank" rel="noopener noreferrer">
        <span>{contact.label}</span><Arrow diagonal /><span className="sr-only"> (opens in a new tab)</span>
      </a>
    </header>
    <main className="workspace">
      <aside className="intro" aria-labelledby="page-title">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-rule" /> GUIDED BY VERIFIED CADRE CONTEXT</p>
          <h1 id="page-title">Turn AI curiosity<br /><em>into a clear next move.</em></h1>
          <p className="intro-description">Explore {clientName}&apos;s services, industries, AI agents, and transformation approach with a grounded guide built for the first useful conversation.</p>
          <div className="hero-signal">
            <AgentSignal />
            <div className="signal-caption">
              <span className="signal-caption-label"><i /> CADRE SIGNAL</span>
              <strong>Curated. Bounded. Ready to guide.</strong>
              <span>Public Cadre knowledge stays separate from the model, so the assistant can be useful without inventing the next step.</span>
            </div>
          </div>
        </div>
        <div className="intro-bottom">
          <div className="scope-note">
            <p className="eyebrow">A TRUSTED STARTING POINT</p>
            <p>Ask in your own words. When the answer needs private context, pricing, or an account action, the assistant hands off instead of guessing.</p>
            <p className="scope-boundary">No account access, bookings, or assessments in chat.</p>
          </div>
        </div>
      </aside>
      <section className="chat-card" aria-labelledby="chat-title">
        <header className="chat-header">
          <div className="chat-identity"><AgentSignal compact /><div><h2 id="chat-title">{botName}</h2>
            <p className={`mode-label${modeLabel === "Demo mode" ? " demo-label" : ""}`}><span className="mode-dot" aria-hidden="true" />{modeLabel}</p>
          </div></div>
          {started && <button className="reset-button" type="button" onClick={newConversation} aria-label="New conversation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10a8 8 0 1 1 .7 7M4 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>New conversation</span>
          </button>}
        </header>
        <div className="conversation-space">
          <div className="transcript" ref={transcript} role="region" aria-label="Conversation" tabIndex={0}
            onScroll={() => {
              const element = transcript.current;
              if (!element) return;
              if (!started) { followingLatest.current = true; setAwayFromLatest(false); return; }
              const away = element.scrollHeight - element.scrollTop - element.clientHeight > 72;
              followingLatest.current = !away; setAwayFromLatest(away);
            }}>
            {!started ? <div className="welcome">
              <span className="welcome-kicker">ASK CADRE · GROUNDED PUBLIC KNOWLEDGE</span>
              <h3>A useful answer.<br /><em>A clearer next step.</em></h3>
              <p>Start with a question in your own words, or choose one of the six verified paths below.</p>
              <div className="topic-grid" aria-label="Suggested topics">{topics.map((topic, index) => <button
                key={topic.id} type="button" className="topic-button" disabled={!ready} onClick={() => send(topic.label)}>
                <span className="topic-number" aria-hidden="true">0{index + 1}</span>
                <span className="topic-label">{topic.label}</span><Arrow />
              </button>)}</div>
              {modeLabel === "Demo mode" && <p className="demo-note">You’re exploring a demo with sample answers. No live model is used.</p>}
              {modeLabel === "Chat unavailable" && <p className="demo-note">Chat isn’t configured right now. You can still reach the team through the contact link.</p>}
            </div> : <>
              {historyTrimmed && <p className="history-note">Showing the most recent messages. Earlier context is limited.</p>}
              <ol className="message-list" aria-label="Messages" aria-busy={pending}>{messages.map((message) => <li
                key={message.id} className={`message message-${message.role}`} data-testid="chat-message" data-role={message.role}>
                <div className="message-author">{message.role === "user" ? "You" : botName}</div>
                <div className={`message-bubble${failed?.message.id === message.id ? " message-failed" : ""}`}>
                  {message.role === "assistant" ? <ReplyText text={message.content} links={approvedLinks} />
                    : <div className="message-text">{message.content}</div>}
                </div>
              </li>)}</ol>
              {pending && <div className="pending-message" aria-hidden="true"><span className="request-indicator"><i /></span><span><strong>Cadre Signal is working</strong>Checking verified context…</span></div>}
            </>}
          </div>
          {started && awayFromLatest && <button className="jump-button" type="button" onClick={jumpToLatest}>Jump to latest <span aria-hidden="true">↓</span></button>}
        </div>
        <div className="composer-section">
          {failed && <div className="error-panel">
            <div role="alert"><p>{failed.reason}</p><span>Your message is saved. Edit it below or retry the same message.</span></div>
            <button type="button" className="retry-button" onClick={() => void requestReply(failed.message, failed.request)}>Retry response <Arrow /></button>
          </div>}
          <form onSubmit={onSubmit} noValidate>
            <div className={`composer${validation || overLimit ? " composer-invalid" : ""}${pending ? " composer-pending" : ""}`}>
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea id="message" ref={composer} value={draft} rows={1} disabled={!ready} readOnly={pending}
                placeholder={!ready ? "Preparing chat…" : pending ? "Waiting for a response…" : "Ask about Cadre AI…"}
                aria-invalid={Boolean(validation) || overLimit} aria-describedby="composer-help message-validation"
                onChange={(event) => { setDraft(event.target.value); setValidation(""); }}
                onKeyDown={onKeyDown} onCompositionStart={() => { composing.current = true; }}
                onCompositionEnd={() => { composing.current = false; }} />
              {pending ? <button key="stop" type="button" className="send-button stop-button" onClick={stopResponse} aria-label="Stop response"><span className="stop-icon" aria-hidden="true" /></button>
                : <button key="send" type="submit" className="send-button" aria-label="Send message" disabled={!ready || overLimit}><Arrow /></button>}
            </div>
            <div className="composer-meta"><p id="composer-help">{ready ? <>Enter to send <span aria-hidden="true">·</span> Shift + Enter for a new line</>
              : "Preparing chat… If it stays unavailable, reload or contact the team."}</p>
              <span className={overLimit ? "character-count count-error" : "character-count"} aria-label={`${draft.length} of ${LIMITS.maxMessageChars} characters`}>{draft.length.toLocaleString("en-US")} / 2,000</span>
            </div>
            <p id="message-validation" className="validation-message" role="alert">{validation || (overLimit ? "Please shorten your message to 2,000 characters or fewer." : "")}</p>
          </form>
          <p className="chat-scope">Public information only. No account access, bookings, or assessments in chat.</p>
          <p className="privacy-note">Don’t share private details. In live mode, messages go to an external model service. This page keeps no chat history after a refresh.</p>
        </div>
      </section>
    </main>
    <footer className="site-footer"><span>Clarity starts with a conversation.</span><span>{clientName} · Support assistant</span></footer>
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
  </div>;
}
