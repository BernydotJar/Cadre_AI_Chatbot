# Cadre AI Assistant — Integration Preview

An optional local Manifest V3 presentation adapter for the existing public chatbot. **The public web app remains the primary deliverable.** This extension is an independent demonstration, not a Cadre-installed or endorsed service.

Status: **LOCALLY VERIFIED INTEGRATION PREVIEW**. The optional adapter now has source/build/security coverage, synthetic browser lifecycle proof, and owner-authorized installed Manifest V3 checks on the public Cadre site using disposable Chromium profiles. The latest contextual run targets `https://cadre.ai/agents#discover-agents`, passes 17 scoped checks, and observes exactly one request to the fixed candidate API for one approved question. It did not modify Cadre servers, forms, cookies, authentication, analytics, or persistent browser storage, and nothing was published to the Chrome Web Store. This is still an independent candidate preview, not a Cadre-installed or endorsed production feature.

## Build and check

Use the repository's locked Node dependencies. No new dependency, API key or separate backend is required.

```sh
rtk proxy npm ci
rtk proxy node extension/build.mjs
rtk proxy npm exec -- vitest run --config extension/vitest.config.ts
rtk proxy npm exec -- tsc --noEmit --incremental false
rtk proxy npm exec -- eslint extension
rtk proxy node extension/tests/browser-mock.mjs unique-run-label
# owner-gated real-site proof in a disposable Chromium profile:
EXTENSION_ACTUAL_SITE=1 node extension/tests/installed-site.mjs unique-actual-site-label
```

Run from the repository root. `npm ci` is needed only for a clean checkout. The build reads `extension/config.json` and safe literal display fields from `src/config/cadre.ts`. It copies/transpiles the pure core limits and conversation utilities with the existing TypeScript compiler. It does not read environment files, execute client configuration, or include provider/server code. The generated manifest is **`extension/dist/manifest.json`**, not a hand-maintained second manifest.

`extension/dist/` is ignored and excluded from the source ZIP; the reviewer can reproduce it with the build command. The generated output is fifteen local files, including four generated extension icon sizes. No runtime package download, remote script, source map, client key or executable model output is included.

The synthetic browser script uses fake HTTPS fixtures and fake Chrome runtime ports, intercepting every request. Its screenshots are explicitly **mock fixtures, not screenshots of cadre.ai**. Each run writes to a new `extension/evidence/<run-label>/` directory and refuses an existing label. Separately, `extension/tests/installed-site.mjs` is an owner-gated installed-extension check: it creates a disposable Chromium profile, loads only `extension/dist`, visits the real public Cadre site, and exercises launcher/panel lifecycle plus one approved live question. It requires `EXTENSION_ACTUAL_SITE=1` so it cannot be mistaken for a routine mock test.


### URL-aware presentation context

The preview can tailor its **local presentation** to a small allowlist of Cadre routes. It derives only `location.pathname` and `location.hash` from the already-approved Cadre origin, converts them to a fixed enum, validates that enum across extension ports, and never reads host-page text, forms, cookies, storage, or DOM content. For example, on `/agents#discover-agents` it opens with a restrained line: “You found the agent showroom. I promise not to recommend twelve agents where one workflow would do.” The suggested action remains a fixed grounded question to the same Vercel API. This is presentation context, not runtime retrieval or RAG.

## Architecture and component ownership

| Component | Responsibility | Boundary |
|---|---|---|
| `config.json` + `build.mjs` | One public API endpoint, exact two site origins, deterministic manifest/display projection | No private configuration or provider imports |
| `src/content-script.ts` | Top-frame launcher, closed Shadow DOM style boundary, iframe lifecycle | Does not read page text, forms, credentials, cookies or conversation data |
| `src/panel/` | Extension-origin document, input, six entry topics, text-only replies, exact approved links, manual retry/Stop | Volatile memory only; cannot book, log in or score |
| `src/shared/contracts.ts` | Strict port envelopes, sender and byte/character bounds | Rejects arbitrary destinations, extra keys, invalid kinds and body shapes |
| `src/shared/bridge.ts` + `src/service-worker.ts` | Authenticated runtime ports and fixed-endpoint fetch | Omits credentials/referrer, rejects redirects, one in-flight request per panel |
| Shared core utilities | Existing limits, bounded history/clarification, reply validation and safe links | No duplicated routing/knowledge or invented actions/citation API |
| `tests/` + `evidence/` | Unit/parity/transport/build checks and synthetic browser observations | Producer evidence is not independent verification |

The wire API remains `{ messages: [{ role, content }] }` → `{ reply, kind }`. Product-specific routing, facts, boundaries and provider calls stay on the existing server. The extension adds stricter extra-key rejection at its own trust boundary. Tests compare accepted payloads against the canonical request parser and derive display topics/links from the canonical client configuration.

## Permissions and privacy

- Content scripts match **`https://cadre.ai/*` and `https://www.cadre.ai/*` only**, HTTPS, top frame, `document_idle`, isolated world. No wildcard subdomains or fallback frames.
- The only `host_permissions` entry is the fixed Vercel API origin generated from `config.json`. Chrome host permissions are origin-scoped; the worker additionally hardcodes the configured `/api/chat` path and never accepts a caller-supplied URL.
- No `storage`, `tabs`, `history`, `cookies`, `scripting`, `activeTab`, debugger or credential permissions. No `externally_connectable` or page `postMessage` bridge.
- Only `panel.html` is web-accessible, limited to the two Cadre origins. The iframe's own scripts and CSS load from its extension origin. Restrictive CSP allows only local code and the one API connection origin.
- Runtime host registration requires this extension ID, a valid tab/document identity, frame zero and exact Cadre URL/origin. The panel requires the same extension ID/tab, a nested extension-origin `panel.html` URL and the registered bounded token. The token is not a secret; it binds the expected panel channel, not an account identity.
- Conversation text lives inside the extension-origin iframe, not the host page's shadow tree. Same-origin browser enforcement is the intended data boundary. The site can still remove, occlude or imitate the launcher; the preview does not claim protection against a fully malicious host or clickjacking.
- Input is limited to 20 messages, 2,000 characters each and the core byte cap. Replies are limited to 2,400 characters and 16 KiB of transport JSON. There is one in-flight request and at most 100 unique requests per panel session, eight registered tabs, a 25-second worker deadline and a 26-second panel deadline. There are no automatic HTTP retries.
- An existing panel sends a small runtime-only `PING` every 20 seconds, including when minimized, to retain its authenticated MV3 channel. This is **not an API call**. Closing/removing the panel clears it; a 30-minute panel deadline prevents indefinite keepalive. A launcher-only worker may go idle; the next explicit launcher click re-registers it. Worker/browser termination can clear the volatile conversation; reopen the panel rather than silently replaying a request.
- Sending a message transmits that message and bounded conversation history to the public chatbot API and its configured model service. It does not transmit Cadre's page content or form values. No conversation is persisted by the extension. Server/provider logging or retention is governed separately; this is not a guarantee of zero retention by third parties.
- Stop, close, reset or page departure abort pending transport. Cancellation cannot retract a request already accepted by the server. Minimize deliberately preserves the conversation and an in-flight answer. Retry is always an explicit user action, and may repeat a request already processed if its first reply was lost.

## Load unpacked — reviewer-controlled

The automated disposable-profile installed check has been completed. These steps reproduce the same adapter manually in the reviewer's own Chrome profile; they are not a claim that Cadre has installed the extension in production.

1. Build and run the checks above. Keep the public app available and confirm the remaining chatbot budget before a live demonstration.
2. Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the repository's **`extension/dist`** directory. A current Chrome version is recommended; the manifest minimum is 114.
3. Review the permission prompt. It must mention only the configured Vercel host plus content-script access to the two named Cadre sites. Unexpected broader permissions are a stop condition.
4. Visit or refresh `https://cadre.ai/`. Open the lower-right launcher. Confirm the **Integration Preview** label. Do not enter personal, account or credential information.
5. Inspect Chrome's extension errors and worker console. The automated installed-site gate already exercises CSP/resource loading, exact-site injection, fixed-endpoint transport, minimize/close and reload behavior; this manual pass confirms the same behavior in the reviewer's own Chrome environment.

Do not publish to the Web Store, alter Cadre's servers/assets, or enable broader host permissions to bypass a failed check. The extension does not replace Cadre's navigation, analytics, forms, authentication or application code.

## Two-minute demonstration

1. Show the public chatbot URL first; explain that the extension is only a local adapter.
2. Show the permission scope and the **Integration Preview** label on the approved Cadre site.
3. Open the launcher using the keyboard. Ask one approved question such as “What services does Cadre AI offer?” and inspect the grounded reply plus official links. This consumes live chatbot allowance.
4. Minimize/reopen to demonstrate volatile continuity; use **New chat** to clear it. Show the mobile-width layout and Escape/minimize focus restoration.
5. Close the panel, then disable/remove the extension and refresh the site. Verify the host page is unchanged and no widget remains.

## Cleanup and limits

**Minimize** hides the panel and preserves its current conversation. **Close** removes the iframe, clears its conversation and aborts pending work; the launcher remains available. **New chat** clears the displayed and outbound conversation history.

Disable or remove the extension in `chrome://extensions`, then **refresh every already-open Cadre tab**. Chrome may leave injected DOM or a disconnected launcher until the document is refreshed; instantaneous removal on extension disable is not promised. The source adds no persistent website data, storage entries or server changes. Page navigation removes its iframe and listeners; a full allowed-site navigation gets one fresh content script. Site code can remove the injected host, which disconnects its port and removes the iframe; the preview does not fight the site by reinjecting through an observer.

Verified boundary: `extension/evidence/actual-agents-context-20260909/installed-site.json` records the latest contextual disposable-profile proof (17 PASS checks, one live fixed-endpoint request). Two earlier actual-site attempts are intentionally retained: the first used an invalid whole-page overflow assertion against Cadre's own 8px site baseline; the second listened for service-worker traffic on a Page rather than the BrowserContext. Both test defects were corrected before the final PASS. Physical reviewer-device behavior and Chrome versions other than the recorded Chromium 151 run remain separate environment coverage; no Web Store or Cadre production-install claim is made.

## Primary implementation references

- [Chrome content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts): isolated-world capabilities, shared DOM, top-frame matching and runtime access.
- [Chrome cross-origin requests](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests): narrowly scoped extension requests and avoiding arbitrary-URL proxies.
- [Web-accessible resources](https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources): controlled exposure of the panel document.
- [Runtime API](https://developer.chrome.com/docs/extensions/reference/api/runtime): ports and sender metadata.
- [Service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle): ephemeral worker state, idle shutdown and long-lived message behavior.
