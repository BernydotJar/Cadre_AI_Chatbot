# N6 — independent live-browser attempt

Attempt interval: 2026-09-09T03:59:18.031Z to 2026-09-09T03:59:43.989Z.
Role: independent browser verifier.

**Verdict: INCONCLUSIVE — the intended real chat round trip was not observed.** The single browser action produced no observed `/api/chat` POST. The verification script therefore failed while waiting for the response. This is not evidence that the provider or chat API returned an error.

## Authorized attempt and actual observation

Target: https://cadre-ai-chatbot-tawny.vercel.app/

The bounded authorization was one browser conversation with the exact question `Do you serve hotels?`, no interception, no retry, no second submission, and a 45-second cap. The coordinator's preceding real-API matrix is separate evidence and is not attributed to this verifier.

This verifier made one attempt:

- Chromium `153.0.8010.12` launched in a fresh anonymous context.
- The initial document returned HTTP 200.
- `Live model configured` was visible.
- The question was filled into the Message textarea and Enter was invoked once.
- No `/api/chat` POST was observed by the request listener.
- The response waiter, configured for 25 seconds, completed without receiving the matching response and the script exited 1.
- Total elapsed time was 25,958 ms, below the 45,000 ms overall cap. The overall deadline did not fire.
- The browser was closed; no second Enter/action, retry, alternate browser attempt or API fallback was performed.

A separate read-only clock check before the attempt returned 2026-09-09T03:57:57Z, already more than seven seconds after the coordinator's reported last POST. This verifier did not make an inference request before the attempt.

## Required measurements

| Measurement | Result |
| --- | --- |
| Observed chat POST count | 0 |
| Browser Enter actions | 1 |
| Retries / second submission | 0 / 0 |
| Initial document HTTP status | 200 |
| Chat API status | unavailable; no response observed |
| Chat response kind | unavailable |
| Reply hash / character or byte length | unavailable; no reply obtained |
| POST-to-response / POST-to-render latency | unavailable; no POST observed |
| Whole attempt duration | 25,958 ms |
| Visible live configuration label | confirmed |
| Hospitality/B2C response assertion | not reached |
| Exact Industries response-link assertion | not reached |
| One rendered answer / safe reply-text assertion | not reached |

No raw reply was recorded because no reply was obtained. No credentials, environment-file contents, tokens, headers or upstream error text were recorded. This verifier did not perform a budget lookup; any later budget measurement belongs to the coordinator. An unobserved POST is not reported as a successful live response or a verified cost figure.

## Sanitized actual command output

```json
{
  "target": "https://cadre-ai-chatbot-tawny.vercel.app/",
  "question": "Do you serve hotels?",
  "timeoutCapMs": 45000,
  "requestCount": 0,
  "retries": 0,
  "interception": false,
  "startedAt": "2026-09-09T03:59:18.031Z",
  "browserVersion": "153.0.8010.12",
  "documentStatus": 200,
  "modeLabelVisible": true,
  "result": "FAIL",
  "failedAt": "one-real-submit",
  "timedOut": false,
  "totalMs": 25958,
  "finishedAt": "2026-09-09T03:59:43.989Z"
}
```

The script's `result: FAIL` denotes failure to obtain the expected verification evidence. The report verdict is INCONCLUSIVE because the failure was before any observed chat POST, not an observed API/provider rejection. The exact cause of the missing browser submission was not established in this single permitted attempt; no cause such as hydration timing is asserted as confirmed.

## Command executed once

From the Cadre AI project root, the following command was executed once. It installed no request interception. The in-memory TypeScript loader read only local source needed to validate a possible reply against the configured industry facts and links. The command is retained for audit; it was not replayed after the failure.

```sh
rtk proxy node -e '
const { chromium } = require("@playwright/test");
const { createHash } = require("node:crypto");
const Module = require("node:module");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(specifier, parent, ...rest) {
 return originalResolve.call(this, specifier.startsWith("@/") ? path.join(process.cwd(), "src", specifier.slice(2)) : specifier, parent, ...rest);
};
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
 compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, filename);
const { cadre } = require("./src/config/cadre.ts");
const entry = cadre.knowledge.find(item => item.topic === "industries");
const permutations = values => values.length === 0 ? [[]] : values.flatMap((value, index) => permutations(values.filter((_, other) => index !== other)).map(rest => [value, ...rest]));
const expectedReplies = permutations(entry.facts).map(order => [order.join(" "), ...entry.approvedLinks.map(link => link.label + ": " + link.url)].join("\n\n"));
const digest = value => createHash("sha256").update(value).digest("hex");
const summary = { target: "https://cadre-ai-chatbot-tawny.vercel.app/", question: "Do you serve hotels?", timeoutCapMs: 45000, requestCount: 0, retries: 0, interception: false, startedAt: new Date().toISOString() };
let browser;
let timer;
let phase = "launch";
let timedOut = false;
let failedCheck;
const started = Date.now();
const check = (condition, label) => { if (!condition) { failedCheck = label; throw new Error("Verification check failed"); } };
(async () => {
 timer = setTimeout(() => { timedOut = true; void browser?.close().catch(() => {}); }, 45000);
 browser = await chromium.launch({ headless: true, timeout: 8000 });
 summary.browserVersion = browser.version();
 const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
 page.setDefaultTimeout(5000);
 let pageErrorCount = 0;
 page.on("pageerror", () => { pageErrorCount++; });
 page.on("request", request => {
  const url = new URL(request.url());
  if (url.pathname === "/api/chat" && request.method() === "POST") summary.requestCount++;
 });
 phase = "load-public-page";
 const document = await page.goto(summary.target, { waitUntil: "domcontentloaded", timeout: 15000 });
 summary.documentStatus = document.status();
 check(summary.documentStatus === 200, "document-http-200");
 const mode = page.getByText("Live model configured", { exact: true });
 await mode.waitFor({ state: "visible" });
 summary.modeLabelVisible = true;
 const input = page.getByRole("textbox", { name: "Message", exact: true });
 await input.fill(summary.question);
 check(summary.requestCount === 0, "no-request-before-submit");
 phase = "one-real-submit";
 const postStarted = Date.now();
 const responsePromise = page.waitForResponse(response => new URL(response.url()).pathname === "/api/chat" && response.request().method() === "POST", { timeout: 25000 });
 await input.press("Enter");
 const response = await responsePromise;
 summary.postToResponseMs = Date.now() - postStarted;
 summary.postStatus = response.status();
 check(summary.postStatus === 200, "chat-http-200");
 const payload = response.request().postDataJSON();
 check(payload.messages.length === 1 && payload.messages[0].role === "user" && payload.messages[0].content === summary.question, "single-exact-question");
 summary.requestMessages = payload.messages.length;
 const responseBytes = await response.body();
 const body = JSON.parse(responseBytes.toString("utf8"));
 check(body.kind === "grounded" && typeof body.reply === "string", "grounded-response-contract");
 summary.kind = body.kind;
 summary.replyCharacters = body.reply.length;
 summary.replyUtf8Bytes = Buffer.byteLength(body.reply, "utf8");
 summary.replySha256 = digest(body.reply);
 summary.apiResponseBytes = responseBytes.length;
 summary.apiResponseSha256 = digest(responseBytes);
 summary.containsHospitality = body.reply.includes("hospitality");
 summary.containsB2C = body.reply.includes("B2C services businesses");
 summary.exactConfiguredFactsAndLinks = expectedReplies.includes(body.reply);
 check(summary.containsHospitality && summary.containsB2C, "hotel-fit-facts");
 check(summary.exactConfiguredFactsAndLinks, "exact-configured-facts-and-links");
 phase = "rendered-ui";
 const assistant = page.locator("[data-testid=chat-message][data-role=assistant]");
 await assistant.first().waitFor({ state: "visible" });
 summary.postToVisibleReplyMs = Date.now() - postStarted;
 summary.assistantMessages = await assistant.count();
 summary.userMessages = await page.locator("[data-testid=chat-message][data-role=user]").count();
 const text = await assistant.first().textContent();
 summary.uiContainsHospitalityAndB2C = text.includes("hospitality") && text.includes("B2C services businesses");
 const renderedLinks = await assistant.first().locator("a").evaluateAll(links => links.map(link => link.getAttribute("href")));
 summary.industriesLinkExact = renderedLinks.includes("https://cadre.ai/industries");
 summary.renderedLinksExact = JSON.stringify(renderedLinks) === JSON.stringify(entry.approvedLinks.map(link => link.url));
 summary.executableElements = await assistant.first().locator("script,img,iframe,object,embed").count();
 summary.pageErrorCount = pageErrorCount;
 check(summary.requestCount === 1, "exactly-one-chat-post");
 check(summary.assistantMessages === 1 && summary.userMessages === 1, "one-visible-exchange");
 check(summary.uiContainsHospitalityAndB2C && summary.industriesLinkExact && summary.renderedLinksExact, "rendered-facts-and-approved-links");
 check(summary.executableElements === 0 && pageErrorCount === 0, "safe-ui-rendering");
 summary.result = "PASS";
})().catch(() => {
 summary.result = "FAIL";
 summary.failedAt = phase;
 if (failedCheck) summary.failedCheck = failedCheck;
 process.exitCode = 1;
}).finally(async () => {
 clearTimeout(timer);
 if (browser) await browser.close().catch(() => {});
 summary.timedOut = timedOut;
 summary.totalMs = Date.now() - started;
 summary.finishedAt = new Date().toISOString();
 console.log(JSON.stringify(summary));
});
'
```

## Local source snapshot checked before the attempt

These hashes identify inspected local source, not independently verified deployed source identity.

```text
59ad7adde6f453f193376339b4244c7e1d60f3de245579813b0e9b78ae1f703e  src/config/cadre.ts
a3fa04964197ec149e88b53769fbab93da15fddb6fcd589508bdc694659b0d8f  src/ui/support-chat.tsx
dee7bec99d9cdacb0a02a4114798157c179e4a50a69e61f2cbeeb9225f932ebb  src/server/chat.ts
0ec35ac6af6bdef2786b53ac3f0e677462521ce67910b5c5377a8db7b1de2a87  src/provider/openrouter.ts
```

Executed read-only command:

```sh
rtk proxy shasum -a 256 src/config/cadre.ts src/ui/support-chat.tsx src/server/chat.ts src/provider/openrouter.ts
```

No Git, ledger, source/test edit, build, server lifecycle operation, deployment, credential access or environment-file read was performed. Only this report was authored. The preceding independent public-browser report remains valid for its 34 intercepted UI cases; it must not be combined with this inconclusive attempt to claim an independently completed live browser/model conversation.

