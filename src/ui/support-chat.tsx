"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";
import type { ExperienceProfile } from "@/product/types";
import type { PublicHighlight } from "@/config/types";
import { LIMITS } from "@/core/limits";
import {
  approvedTextParts, buildRequestHistory, CLIENT_TIMEOUT_MS, DISPLAY_MESSAGE_LIMIT,
  readReply, type ApprovedLink, type Message, type RequestMessage,
} from "./conversation";

type Props = {
  productId: string;
  clientName: string;
  contact: ApprovedLink;
  topics: { id: string; label: string }[];
  approvedLinks: ApprovedLink[];
  publicHighlights: PublicHighlight[];
  experience: ExperienceProfile;
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

function CompanyMark({ name, small = false }: { name: string; small?: boolean }) {
  const monogram = name.trim().charAt(0).toUpperCase() || "·";
  return <span className={`brand-mark${small ? " brand-mark-small" : ""}`} aria-hidden="true">
    <span className="company-monogram">{monogram}</span>
  </span>;
}

type AvatarState = "idle" | "shaping";

function PersonaAvatar({ experience, compact = false, state = "idle" }: {
  experience: ExperienceProfile;
  compact?: boolean;
  state?: AvatarState;
}) {
  return <span
    className={`persona-avatar${compact ? " persona-avatar-compact" : ""}`}
    data-avatar-style={experience.avatar.style}
    data-avatar-state={state}
    title={experience.avatar.label}
    aria-hidden="true"
  >
    {experience.avatar.style === "signal-orb" ? <span className="donna-orb" data-state={state}>
      <i className="orb-lobe orb-lobe-a" />
      <i className="orb-lobe orb-lobe-b" />
      <i className="orb-lobe orb-lobe-c" />
      <span className="orb-core">{experience.avatar.monogram}</span>
    </span> : <span className="persona-monogram">{experience.avatar.monogram}</span>}
  </span>;
}

function AmbientMedia({ media }: { media: NonNullable<ExperienceProfile["ambientMedia"]> }) {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [paused, setPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setMotionAllowed(!query.matches);
      setPaused(false);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  function toggleMotion() {
    const element = video.current;
    if (!element) return;

    // The visible control is application-owned state. During a remote cold load
    // the native element can still report `paused=true` while autoplay is
    // pending, even though the control already says “Pause”. Branching on the
    // native property can therefore invert the user's intent.
    if (!paused) {
      element.pause();
      setPaused(true);
      return;
    }

    void element.play()
      .then(() => setPaused(false))
      .catch(() => setPaused(true));
  }

  return <>
    <div
      className="intro-media"
      data-motion={motionAllowed ? (paused ? "paused" : "video") : "poster"}
      style={{ backgroundImage: `url(${media.posterSrc})` }}
      aria-hidden="true"
    >
      {motionAllowed ? <video
        ref={video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={media.posterSrc}
        tabIndex={-1}
      >
        <source src={media.videoSrc} type="video/mp4" />
      </video> : null}
    </div>
    {motionAllowed ? <button
      type="button"
      className="motion-toggle"
      onClick={toggleMotion}
      aria-pressed={paused}
      aria-label={paused ? "Play ambient motion" : "Pause ambient motion"}
    >{paused ? "Play" : "Pause"}</button> : null}
  </>;
}

function ReplyText({ text, links }: { text: string; links: ApprovedLink[] }) {
  return <div className="message-text">{approvedTextParts(text, links).map((part, index) => part.href
    ? <a key={index} href={part.href} target="_blank" rel="noopener noreferrer">{part.text}<span className="sr-only"> (opens in a new tab)</span></a>
    : <span key={index}>{part.text}</span>)}</div>;
}

export function SupportChat({ productId, clientName, contact, topics, approvedLinks, publicHighlights, experience, modeLabel }: Props) {
  const ready = useSyncExternalStore(subscribeToReadiness, clientReady, serverReady);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [invitationIndex, setInvitationIndex] = useState(0);
  const [invitationHovered, setInvitationHovered] = useState(false);
  const [invitationFocused, setInvitationFocused] = useState(false);
  const [invitationRotationAllowed, setInvitationRotationAllowed] = useState(false);
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
  const launcher = useRef<HTMLButtonElement>(null);
  const followingLatest = useRef(true);
  const composing = useRef(false);

  useEffect(() => () => {
    const operation = active.current;
    active.current = null;
    operation?.controller.abort();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setInvitationRotationAllowed(!query.matches);
      if (query.matches) setInvitationIndex(0);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (chatOpen || invitationHovered || invitationFocused || !invitationRotationAllowed
      || experience.quickPrompts.length < 2 || invitationIndex >= experience.quickPrompts.length - 1) return;
    const timer = window.setTimeout(() => {
      setInvitationIndex((current) => Math.min(current + 1, experience.quickPrompts.length - 1));
    }, 5_200);
    return () => window.clearTimeout(timer);
  }, [chatOpen, experience.quickPrompts.length, invitationFocused, invitationHovered, invitationIndex, invitationRotationAllowed]);

  function closeChat() {
    setChatOpen(false);
    window.requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
  }

  useEffect(() => {
    if (!chatOpen) return;
    const frame = window.requestAnimationFrame(() => composer.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [chatOpen]);

  useEffect(() => {
    function onEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setChatOpen(false);
        window.requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
      }
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
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
      setAnnouncement(`${experience.assistantLabel} replied. ${reply.reply}`);
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
    setChatOpen(true);
    setNudgeDismissed(true);
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

  function retryFailedResponse() {
    if (!failed) return;
    void requestReply(failed.message, failed.request);
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

  const previousStarted = useRef(false);
  useEffect(() => {
    // The composer changes position when a conversation starts or resets.
    // Restore focus only after one of those user-driven relocations, not on first paint.
    if (started || previousStarted.current) composer.current?.focus({ preventScroll: true });
    previousStarted.current = started;
  }, [started]);

  const overLimit = draft.trim().length > LIMITS.maxMessageChars;
  const publicModeLabel = modeLabel === "Live model configured" ? "Available"
    : modeLabel === "Demo mode" ? "Demo" : "Unavailable";
  const outcomeHighlights = publicHighlights.filter((highlight) => highlight.kind === "outcome");
  const proofHighlight = publicHighlights.find((highlight) => highlight.kind === "proof");
  const productHighlight = publicHighlights.find((highlight) => highlight.kind === "product");
  const resultsPrompt = experience.quickPrompts.find((prompt) => /track|results/i.test(`${prompt.label} ${prompt.message}`));
  const invitationPrompt = experience.quickPrompts.length > 0
    ? experience.quickPrompts[invitationIndex % experience.quickPrompts.length]
    : undefined;
  const invitationPosition = invitationPrompt
    ? `${(invitationIndex % experience.quickPrompts.length) + 1} / ${experience.quickPrompts.length}` : "";

  const themeStyle = {
    "--bg": experience.theme.background,
    "--bg-soft": experience.theme.backgroundSoft,
    "--surface": experience.theme.surface,
    "--text": experience.theme.text,
    "--muted": experience.theme.muted,
    "--accent": experience.theme.accent,
    "--accent-dark": experience.theme.accentStrong,
    "--focus": experience.theme.focus,
  } as CSSProperties;


  function renderComposerPanel() {
    return <>
      <div className="composer-section">
          {failed && <div className="error-panel">
            <div role="alert"><p>{failed.reason}</p><span>Your message is saved. Edit it below or retry the same message.</span></div>
            <button type="button" className="retry-button" onClick={retryFailedResponse}>Retry response <Arrow /></button>
          </div>}
          <form onSubmit={onSubmit} noValidate>
            <div className={`composer${validation || overLimit ? " composer-invalid" : ""}${pending ? " composer-pending" : ""}`}>
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea id="message" ref={composer} value={draft} rows={1} disabled={!ready} readOnly={pending}
                placeholder={!ready ? "Preparing chat…" : pending ? "Waiting for a response…" : experience.copy.composerPlaceholder}
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
          <p className="chat-scope">{experience.copy.chatScope}</p>
          <p className="privacy-note">{experience.copy.privacyNote}</p>
        </div>
    </>;
  }

  return <div className="support-shell" style={themeStyle} data-product={productId}>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="site-header">
      <div className="wordmark"><CompanyMark name={clientName} /><span>{clientName}</span></div>
      <nav className="site-nav" aria-label="Primary">
        {outcomeHighlights.length > 0 && <a href="#outcomes">Outcomes</a>}
        <a href="#how-assistant-works">How {experience.assistantLabel} works</a>
        <a className="contact-link" aria-label={experience.copy.contactCta} href={contact.url} target="_blank" rel="noopener noreferrer">
          <span>{experience.copy.contactCta}</span><Arrow diagonal /><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </nav>
    </header>

    <main id="main-content" className="experience-page">
      <section className="intro" aria-labelledby="page-title">
        {experience.ambientMedia ? <AmbientMedia media={experience.ambientMedia} /> : null}
        <div className="intro-copy">
          <p className="eyebrow">{experience.copy.eyebrow}</p>
          <h1 id="page-title">{experience.copy.heroLead}<br /><em>{experience.copy.heroEmphasis}</em></h1>
          <p className="intro-description">{experience.copy.heroDescription}</p>
          <div className="hero-actions">
            <button type="button" className="hero-chat-action" disabled={!ready} onClick={() => { setChatOpen(true); setNudgeDismissed(true); }}>
              <PersonaAvatar experience={experience} compact />
              <span>Ask {experience.assistantLabel}</span><Arrow />
            </button>
            <a className="hero-contact-action" href={contact.url} target="_blank" rel="noopener noreferrer">
              {experience.copy.contactCta} <Arrow diagonal /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="intro-bottom">
          {proofHighlight ? <div className="hero-proof" data-highlight={proofHighlight.id}>
            <strong>{proofHighlight.title}</strong>
            <span>{proofHighlight.body}</span>
          </div> : <div className="scope-note">
            <p className="trust-label">{experience.copy.trustLabel}</p>
            <p>{experience.copy.trustBody}</p>
          </div>}
        </div>
      </section>

      {outcomeHighlights.length > 0 && <section id="outcomes" className="outcome-section" aria-labelledby="outcomes-title">
        <div className="section-heading">
          <p className="section-eyebrow">{experience.copy.outcomesEyebrow}</p>
          <h2 id="outcomes-title">{experience.copy.outcomesTitle}</h2>
          <p>{experience.copy.outcomesBody}</p>
        </div>
        <div className="outcome-grid">{outcomeHighlights.map((highlight, index) => <article key={highlight.id} className="outcome-card">
          <span className="outcome-index">0{index + 1}</span>
          <h3>{highlight.title}</h3>
          <p>{highlight.body}</p>
        </article>)}</div>
      </section>}

      {productHighlight && <section className="results-section" aria-labelledby="results-title">
        <div className="results-copy">
          <p className="section-eyebrow">{experience.copy.resultsEyebrow}</p>
          <h2 id="results-title">{productHighlight.title}</h2>
          <p>{productHighlight.body}</p>
        </div>
        <div className="results-actions">
          {productHighlight.link && <a href={productHighlight.link.url} target="_blank" rel="noopener noreferrer">
            {productHighlight.link.label}<Arrow diagonal /><span className="sr-only"> (opens in a new tab)</span>
          </a>}
          {resultsPrompt && <button type="button" disabled={!ready} onClick={() => send(resultsPrompt.message)}>Ask {experience.assistantLabel} how it works <Arrow /></button>}
        </div>
      </section>}

      <section id="how-assistant-works" className="trust-section" aria-labelledby="trust-title">
        <div className="section-heading compact-heading">
          <p className="section-eyebrow">{experience.copy.trustEyebrow}</p>
          <h2 id="trust-title">{experience.copy.trustTitle}</h2>
          <p>{experience.copy.trustSectionBody}</p>
        </div>
        <div className="trust-grid">{experience.trustPoints.map((point, index) => <article key={point.title}>
          <span>0{index + 1}</span><h3>{point.title}</h3><p>{point.body}</p>
        </article>)}</div>
      </section>
      <noscript><div className="noscript-note">Chat needs JavaScript. You can still use the official contact link above.</div></noscript>
    </main>

    <footer className="site-footer"><span>{experience.copy.footerLead}</span><span>{clientName} · {experience.copy.footerTail}</span></footer>

    {!chatOpen && <aside
      className="donna-launcher-stack"
      aria-label={`${experience.assistantLabel} chat invitation`}
      data-invitation-index={invitationPrompt ? invitationIndex % experience.quickPrompts.length : 0}
      onPointerEnter={() => setInvitationHovered(true)}
      onPointerLeave={() => setInvitationHovered(false)}
      onFocusCapture={() => setInvitationFocused(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setInvitationFocused(false);
      }}
    >
      {!nudgeDismissed && <div className="donna-nudge">
        <button type="button" className="nudge-dismiss" aria-label={`Dismiss ${experience.assistantLabel} suggestion`} onClick={() => setNudgeDismissed(true)}>×</button>
        <div className="nudge-heading">
          <PersonaAvatar experience={experience} compact />
          <div>
            <p className="nudge-kicker">{experience.copy.nudgeKicker}</p>
            <strong data-testid="nudge-suggestion-label">{invitationPrompt?.label ?? experience.copy.trustLabel}</strong>
          </div>
        </div>
        <p className="nudge-question" data-testid="nudge-suggestion-message">
          {invitationPrompt?.message ?? experience.copy.trustBody}
        </p>
        {invitationPrompt && <div className="nudge-action-row">
          <button type="button" className="nudge-action" aria-label={`Ask ${experience.assistantLabel}: ${invitationPrompt.label}`} disabled={!ready} onClick={() => send(invitationPrompt.message)}>
            Ask this <Arrow />
          </button>
          <span className="nudge-position" aria-hidden="true">{invitationPosition}</span>
        </div>}
        {proofHighlight && <div className="nudge-proof">
          <span>Verified context</span>
          <strong>{proofHighlight.title}</strong>
        </div>}
      </div>}
      <button ref={launcher} type="button" className="donna-launcher" aria-label={`Ask ${experience.assistantLabel}`} disabled={!ready} aria-expanded="false" aria-controls="donna-chat" onClick={() => { setChatOpen(true); setNudgeDismissed(true); }}>
        <PersonaAvatar experience={experience} />
        <span className="launcher-copy"><strong>Ask {experience.assistantLabel}</strong><small data-testid="launcher-suggestion">{invitationPrompt ? `Try: ${invitationPrompt.label}` : experience.copy.launcherHint}</small></span>
        <Arrow />
      </button>
    </aside>}

    {chatOpen && <section id="donna-chat" className="chat-card" aria-label={`Chat with ${experience.assistantLabel}`} data-started={started ? "true" : "false"}>
      <header className="chat-header">
        <div className="chat-identity"><PersonaAvatar experience={experience} compact state={pending ? "shaping" : "idle"} /><div><h2 id="chat-title">{experience.assistantLabel}</h2>
          <p className={`mode-label${modeLabel === "Demo mode" ? " demo-label" : ""}`}><span className="mode-dot" aria-hidden="true" />{pending ? "Shaping a grounded answer" : publicModeLabel}</p>
        </div></div>
        <div className="chat-header-actions">
          {started && <button className="reset-button" type="button" onClick={newConversation} aria-label="New conversation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10a8 8 0 1 1 .7 7M4 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>New</span>
          </button>}
          <button className="chat-close" type="button" onClick={closeChat} aria-label="Close chat">×</button>
        </div>
      </header>
      {!started && renderComposerPanel()}
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
            <div className="welcome-persona-copy">
              <h3>{experience.copy.welcomeLead} <em>{experience.copy.welcomeEmphasis}</em></h3>
              <p>{experience.copy.welcomeBody}</p>
            </div>
            <div className="quick-prompt-grid" aria-label={`Suggested questions for ${experience.assistantLabel}`}>{experience.quickPrompts.map((prompt) => <button
              key={prompt.label} type="button" className="quick-prompt" disabled={!ready} onClick={() => send(prompt.message)}>
              <span>{prompt.label}</span><Arrow />
            </button>)}</div>
            <details className="topic-browser">
              <summary>Browse verified topics</summary>
              <div className="topic-grid" aria-label="Verified topics">{topics.map((topic, index) => <button
                key={topic.id} type="button" className="topic-button" disabled={!ready} onClick={() => send(topic.label)}>
                <span className="topic-number" aria-hidden="true">0{index + 1}</span>
                <span className="topic-label">{topic.label}</span><Arrow />
              </button>)}</div>
            </details>
            {modeLabel === "Demo mode" && <p className="demo-note">{"You're exploring a demo with sample answers. No live model is used."}</p>}
            {modeLabel === "Chat unavailable" && <p className="demo-note">{"Chat isn't configured right now. You can still reach the team through the contact link."}</p>}
          </div> : <>
            {historyTrimmed && <p className="history-note">Showing the most recent messages. Earlier context is limited.</p>}
            <ol className="message-list" aria-label="Messages" aria-busy={pending}>{messages.map((message) => <li
              key={message.id} className={`message message-${message.role}`} data-testid="chat-message" data-role={message.role}>
              <div className="message-author">{message.role === "user" ? "You" : experience.assistantLabel}</div>
              <div className={`message-bubble${failed?.message.id === message.id ? " message-failed" : ""}`}>
                {message.role === "assistant" ? <ReplyText text={message.content} links={approvedLinks} />
                  : <div className="message-text">{message.content}</div>}
              </div>
            </li>)}</ol>
            {pending && <div className="pending-message" aria-hidden="true"><PersonaAvatar experience={experience} compact state="shaping" /><span><strong>{experience.copy.workingTitle}</strong>{experience.copy.workingBody}</span></div>}
          </>}
        </div>
        {started && awayFromLatest && <button className="jump-button" type="button" onClick={jumpToLatest}>Jump to latest <span aria-hidden="true">↓</span></button>}
      </div>
      {started && renderComposerPanel()}
    </section>}
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
  </div>;
}
