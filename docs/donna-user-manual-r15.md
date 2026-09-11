# Donna User Manual — Cadre AI Conversational Experience

**Release:** PX6 revision 15  
**Document version:** 1.0  
**Status:** Active — end-user guide  
**Date:** 2026-09-11  
**Public experience:** `https://cadre-ai-chatbot-tawny.vercel.app`

> Donna is a public informational assistant for verified Cadre AI topics. It does not log into accounts, access private client data, book meetings, run assessments, send email, or perform transactions. Do not enter secrets, credentials, or private client information.

---

## 1. Purpose

This manual explains how to use the Donna website and chat in revision 15, what the visible status labels mean, what kinds of questions work best, how to recover from common errors, and where Donna intentionally hands control back to a human or official Cadre page.

The normal user journey is also shown on **Page 7 — AS-BUILT - User Journey & Operating Modes** of the editable [Donna Architecture Pack - r15](https://lucid.app/lucidchart/bd103b7c-614d-4e48-9cd0-e5ede867f924/edit).

## 2. What Donna Can Help With

Donna is designed around six verified public topic areas:

| Topic | Typical question |
| --- | --- |
| What Cadre AI does | “What services does Cadre AI offer?” |
| Industries served | “What industries do you work with?” |
| Talking to a strategist | “How can I speak with an AI strategist?” |
| Client portal | “Where is the client portal?” |
| AI Maturity Index | “What is the AI Maturity Index?” |
| Models and data security | “What models do you use and how do you think about data security?” |

Donna may also help you choose the next useful question by offering **one configured follow-up question** after a grounded answer. You can ignore it or tell Donna not to ask a follow-up.

## 3. What Donna Does Not Do

Revision 15 does **not** provide:

- account login or private account lookup;
- access to CRM or customer records;
- persistent chat memory after the page/session is reset or refreshed;
- file upload, private-document search, or enterprise knowledge-base search;
- booking creation inside the chat;
- AI Maturity Index scoring inside the chat;
- guaranteed pricing or unverified commercial claims;
- email sending or real human-handoff delivery;
- autonomous tools or transactions.

When a question requires private, commercial, or account-specific authority, Donna should direct you to an approved official Cadre path rather than guessing.

---

## 4. Opening Donna

Open the public Donna page in a modern browser. The page includes the Cadre/Donna experience, public outcome/proof information, a `How Donna works` section, and several ways to start the conversation.

You can open the chat from:

1. the main **Ask Donna** button;
2. the floating **Ask Donna** launcher;
3. the rotating Donna suggestion card;
4. a suggested question;
5. **Browse verified topics**;
6. the results-section Donna action.

All of these entry points use the same underlying Donna chat.

## 5. Understanding the Chat Header

The status below the Donna name tells you the current operating state.

| Label | Meaning |
| --- | --- |
| **Available** | Donna is configured for the live external model path. |
| **Demo** | The local/sample provider is being used. No live model call is made. |
| **Unavailable** | Live chat is not correctly configured or is temporarily unavailable. The official contact route remains available. |
| **Shaping a grounded answer** | A request is currently being processed. |

`Available` means the live path is configured; it is not a guarantee that every external service call will succeed.

---

## 6. Asking a Question

### 6.1 Suggested questions

The welcome panel offers quick prompts. Select one to send it directly. These are the easiest way to see the intended Donna experience.

### 6.2 Verified topics

Open **Browse verified topics** to choose from the six reviewed knowledge areas. This is useful when you know the subject but not the exact wording to use.

### 6.3 Free text

Type your own question into the message box.

- Maximum message length: **2,000 characters**.
- Press **Enter** to send.
- Press **Shift + Enter** for a new line.
- Empty messages are not sent.

For the best result, ask one clear public/business question at a time.

Good examples:

- “What does Cadre AI help companies with?”
- “Which industries does Cadre work with?”
- “How do I talk with an AI strategist?”
- “What is the AI Maturity Index?”

Avoid entering passwords, API keys, personal records, confidential client material, or other private information.

---

## 7. How to Read Donna's Answers

### 7.1 Grounded answers

For a supported topic, Donna answers using reviewed application facts and approved links. The external model is not given authority to invent Cadre facts or arbitrary URLs; it is used only to choose the relevance order of approved facts on grounded topics.

A grounded response may finish with one Donna follow-up question that helps narrow the next decision.

### 7.2 Official links

Only application-approved exact URLs are rendered as clickable links in Donna responses. An arbitrary URL-shaped string is not automatically trusted.

Official links open in a new tab.

### 7.3 Clarification

If a request could refer to more than one supported topic, Donna may ask you to choose between them. Answer with the requested option or restate your question more specifically.

### 7.4 Pricing or unverifiable requests

Donna does not invent pricing, guarantees, certifications, or other facts that are outside verified application knowledge. It should explain the boundary and point you toward an official contact path when appropriate.

### 7.5 Account or private requests

Donna cannot inspect private accounts, portal records, client information, or credentials. Account-specific requests are redirected rather than answered from inference.

### 7.6 Unsupported topics

If Donna cannot map a question to verified knowledge, it may ask for clarification or explain that the topic is outside the current public scope. This is intentional behavior.

---

## 8. Continuing a Conversation

Donna uses a bounded portion of the current page conversation to preserve useful context.

Important limits:

- the active page can display up to 40 recent messages;
- the request sent to the chat API is capped at 20 messages;
- the provider receives a smaller bounded recent-history window;
- older context can be trimmed;
- the application does not preserve the conversation as persistent cross-session memory.

If you see **Showing the most recent messages. Earlier context is limited.**, restate any critical detail in your next question.

---

## 9. Conversation Controls

### Stop response

While Donna is processing, the send control becomes **Stop response**. Use it to stop waiting for that response. Cancellation cannot retract work that an external service may already have accepted.

### Retry response

If a response fails, Donna keeps your message available and displays **Retry response**. You can edit the text first or retry the same message.

A retry is a new request and may repeat processing that already occurred if the first response was lost.

### New

Select **New** to clear the displayed conversation and start again on the current page.

### Close chat

Select the close control or press **Escape**. Focus returns to the Donna launcher so keyboard users can continue navigating the page.

### Jump to latest

If you scroll upward in a longer conversation, **Jump to latest** returns you to the newest message.

---

## 10. Privacy and Data Expectations

Donna is intended for **public information**.

The public application does not maintain a conversation database and does not preserve its chat history after a refresh. However, when live mode is active, your message and bounded conversation context are sent to the configured external model service so it can select relevant approved fact indices.

Therefore:

- do not submit private/confidential information;
- do not treat application-level volatile history as a promise that providers or hosting systems keep no logs;
- use the official Cadre contact path for private, account-specific, or contractual discussions.

---

## 11. Motion, Keyboard, and Accessibility-Oriented Behavior

Donna includes keyboard/focus controls and respects reduced-motion preferences.

- A **Skip to main content** link is available for keyboard navigation.
- **Escape** closes the chat and restores focus.
- Buttons and chat regions include accessibility labels/status announcements.
- When your system requests reduced motion, ambient motion and rotating invitation behavior are reduced/suppressed.
- When ambient video is active, a visible **Pause/Play** control is available.

Revision 15 has automated desktop/mobile Chromium and keyboard-oriented coverage, but the product documentation does not claim formal accessibility or every-device certification.

---

## 12. Troubleshooting

| Symptom | What it means | What to do |
| --- | --- | --- |
| **Unavailable** appears | Live provider configuration is unavailable/invalid or the chat is intentionally not live. | Use the official contact path or try again after configuration is restored. |
| Donna says the request took too long | The request exceeded the bounded processing deadline. | Retry once or ask a shorter/simpler question. |
| Donna says it is receiving too many requests | The current request bucket is rate limited. | Wait for the indicated window before retrying. |
| Message cannot be sent and counter is over 2,000 | Input exceeds the user-message limit. | Shorten the message to 2,000 characters or fewer. |
| Earlier context seems missing | Older conversation content was trimmed. | Restate the important context in the current question. |
| A URL-shaped string is not clickable | It is not an exact application-approved link. | Use the official navigation/contact paths instead of trusting the string. |
| A response failed but your question is still visible | The UI preserved the failed turn for recovery. | Edit or select **Retry response**. |
| You want to cancel a slow answer | A request is pending. | Select **Stop response**. |
| Chat does not run with JavaScript disabled | The interactive chat requires JavaScript. | Use the official contact/navigation links on the page. |
| Donna asks you to clarify | The request is ambiguous or outside the routed vocabulary. | Choose one offered topic or rephrase with a specific topic name. |

---

## 13. Recommended First-Time Walkthrough

For a quick product review:

1. Open the public Donna page.
2. Read the `How Donna works` trust section.
3. Select **Ask Donna**.
4. Use a suggested question about Cadre's services.
5. Follow one Donna follow-up question.
6. Open **Browse verified topics** and ask about the AI Maturity Index.
7. Ask a private/account-style question and confirm Donna does not pretend to access private data.
8. Start a **New** conversation.
9. Try keyboard open/close and reduced-motion behavior if relevant to your review.
10. Use the official strategist/contact link for a real human next step.

---

## 14. Optional Chrome Integration Preview — Reviewer/Internal Use

Donna also has an **AS-BUILT / OPTIONAL** local Chrome Manifest V3 preview. This is not the normal public-web experience, is not a Cadre-installed production feature, and has not been published as a Chrome Web Store product.

The preview is intentionally narrow: it activates only on approved Cadre origins, talks to one fixed Donna API, does not scrape host-page text/forms/cookies/storage, and keeps its conversation in volatile extension memory.

For installation/testing details, use `extension/README.md`. End users of the normal Donna website do not need this extension.

## 15. n8n Handoff Prototype — Not an End-User Feature

The repository contains an **AS-BUILT / OPTIONAL** n8n handoff-contract prototype, but public Donna r15 is not wired to a real delivery provider through it. A user must not interpret a Donna response as proof that an email, CRM record, or meeting was created.

---

## 16. Frequently Asked Questions

**Does Donna remember me after I refresh the page?**  
No application-level persistent chat memory is provided in r15.

**Can Donna see my Cadre client account?**  
No. It has no private account authority.

**Can Donna give me an exact price?**  
Not unless an exact price is part of reviewed application knowledge. The r15 policy treats unverified/pricing requests as a boundary and routes toward an official human path rather than guessing.

**Can Donna book a strategist meeting?**  
Donna can explain and link to the official contact path; it does not create the booking inside chat.

**Can I upload a document and ask Donna about it?**  
No. File upload/private-document retrieval is not part of r15.

**Does Donna browse Cadre's website live?**  
No. Public answers come from reviewed/version-controlled application knowledge, not arbitrary live page scraping.

**Does the AI model write all of Donna's answer?**  
No. On grounded topics the model is limited to choosing the order/relevance of approved fact indices. The application owns the factual text, links, boundaries, and final composition.

**What should I do for confidential or account-specific questions?**  
Use the official Cadre human/contact route and do not place confidential information into the public chat.

---

## 17. Quick Reference

```text
OPEN       Ask Donna / launcher / suggestion / verified topic
ASK        Public Cadre question, <= 2,000 characters
SEND       Enter
NEW LINE   Shift + Enter
STOP       Stop response
RETRY      Retry response after a failed turn
RESET      New
CLOSE      Close button or Escape
RECENT     Jump to latest
PRIVACY    Public information only; do not submit secrets/private data
BOUNDARY   No accounts, CRM, bookings, assessment scoring, email or transactions
MEMORY     Current bounded page context only; no app cross-session memory
```

---

## 18. Support and Official Next Step

When Donna cannot answer within verified public scope, use the official Cadre contact path exposed by the product. The application intentionally prefers a transparent human handoff over an invented answer or unsupported action.

---

## 19. Manual Sign-off

This manual describes the delivered Donna PX6 revision-15 website behavior and clearly separates optional repository integrations from the normal public user experience. Material product changes require a corresponding manual revision.
