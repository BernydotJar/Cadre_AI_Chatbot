# N4 UI producer handoff

Date: 2026-09-08. Producer implementation, not independent approval or a completed N4 gate.

## Implemented surface

- `app/page.tsx` derives a safe request-time mode label from server configuration, including local live-configuration and expiry validation. Only the label and public brand/topic/link data reach the client. The live label does not claim provider health.
- `app/layout.tsx` supplies English metadata. `app/globals.css` provides an ivory, ink and terracotta editorial layout, responsive breakpoints down to 360 px, visible focus, 44 px primary controls and reduced-motion treatment.
- `src/ui/support-chat.tsx` contains the six config-derived topic starts, plain-text conversation, composer, progress, cancel, retry, reset, errors, validation and reading-position controls. UI controls use the coordinator's agreed accessible names and message test attributes.
- `src/ui/conversation.ts` bounds outbound history at 20 messages and 2,000 characters per message while retaining the first clarification pair and recent exchange. Full replies up to 2,400 characters remain visible; displayed history is capped at 40 messages. Exact allowlisted URL destinations become links only in assistant replies; user text is never linkified and HTML is never interpreted.

## Recovery and state contract

The request acquires a synchronous ref lock before sending. Retry reuses the exact failed request and existing user turn. Failed or cancelled text returns to the composer: resending identical text retries; edited text replaces the failed user turn. The composer is read-only while a request is pending. Cancellation aborts the fetch; reset aborts and invalidates ownership so an old response cannot enter the new conversation. The client deadline is 25 seconds, longer than the server's 20-second limit. No conversation state is written to localStorage or sessionStorage.

Empty submissions show validation. Oversized pasted text is preserved with explicit feedback and disabled Send; Enter also validates. Enter sends, Shift+Enter inserts a newline, and composition guards cover IME events. Mode and privacy copy distinguish demo answers, locally configured live mode, and unavailable configuration; public-scope boundaries remain visible on mobile.

## Producer verification

- `rtk proxy npm run typecheck`: passed.
- `rtk proxy npm run lint`: passed after server time/configuration lookup was isolated in a request-time helper.
- `rtk proxy npm test -- tests/ui/conversation.test.ts`: 15 passed. Tests were authored independently by the coordinator. Their malformed-kind case initially exposed coercion of an array to a string; the producer fixed it by requiring a string enum.
- The existing Vite warning about future native config-loader behavior remains; it did not fail the tests and changing test configuration is outside this producer's files.

The coordinator owns production build, browser tests, screenshots and deployment verification. No build, browser server, environment edit, dependency installation, Git operation, graph mutation or deployment was performed by this producer. Independent review remains required. Initial empty-state overflow/scroll position was specifically raised for browser inspection before source freeze.
