# Independent one-shot live browser verification — repaired hydration release

Date: 2026-09-09 UTC. Role: independent verifier.

**Verdict: PASS for exactly one anonymous real browser conversation on the repaired public alias.** One Enter produced one exact POST, HTTP 200, `kind: grounded`, and one visible assistant response. There were no retries or second questions. This new artifact does not reinterpret or replace the earlier inconclusive zero-POST attempt.

## Scope and authority

Target: https://cadre-ai-chatbot-tawny.vercel.app

The coordinator supplied READY deployment `dpl_B1pG38nm6xVYSbg1cjSTasgLyxfj` / runtime core `c6f781c`. This verifier did not query Vercel or deploy. Directly tested browser behavior is distinguished from that coordinator-supplied deployment identity.

Before this attempt, this verifier independently passed the 38 intercepted public cases, including delayed-JavaScript and no-JavaScript hydration checks at both viewports. The coordinator then authorized exactly one real question after its numeric budget check at 2026-09-09T04:36:33.903Z. Budget figures and later budget accounting belong to the coordinator and are not claimed as checks by this verifier.

Question: `Do you serve hotels?`

The browser was a fresh anonymous context, viewport 1280 x 900, Chromium 153.0.8010.12. Navigation waited for DOMContentLoaded, then input editability, the Live model configured label, six topics, exact draft and the 20 / 2,000 counter were verified before the single Enter. No request interception, mock server, API key or credential was used. Passive browser request/response listeners counted and inspected the actual API exchange.

A 45-second watchdog bounded the attempt. No retry logic exists in the script. The browser was closed in awaited cleanup. No raw reply was printed or saved; only safe facts, counts, hashes and lengths are retained.

## Actual result

```json
{
  "startedAt": "2026-09-09T04:39:06.090Z",
  "mode": "public-live-no-interception",
  "baseURL": "https://cadre-ai-chatbot-tawny.vercel.app",
  "viewport": {
    "width": 1280,
    "height": 900
  },
  "navigation": "domcontentloaded",
  "enterActions": 1,
  "chatRequests": 1,
  "chatPostRequests": 1,
  "pageErrors": 0,
  "chatRequestFailures": 0,
  "browser": "153.0.8010.12",
  "documentStatus": 200,
  "liveModelLabel": true,
  "sixTopics": true,
  "readyBeforeFill": true,
  "counter20BeforeEnter": true,
  "requestSha256": "60afc23530350449f17de96b9590b008c9642398777cf36dab295086980e0619",
  "requestUtf8Bytes": 63,
  "status": 200,
  "responseLatencyMs": 1257,
  "kind": "grounded",
  "replyChars": 592,
  "replyUtf8Bytes": 592,
  "replySha256": "3cff7e7fb7a7a21b98fe660fbe635b18543dcac8865dfb95e3b9ae06efbdeed5",
  "exactQuestionPayload": true,
  "hospitalityFact": true,
  "b2cFact": true,
  "industriesExactURLInReply": true,
  "allReplyLinksApproved": true,
  "inertMessageMarkup": true,
  "userBubbles": 1,
  "assistantBubbles": 1,
  "officialIndustriesLinkVisible": true,
  "result": "PASS",
  "elapsedMs": 2365,
  "finishedAt": "2026-09-09T04:39:08.455Z"
}
```

The response contained the approved hospitality and B2C facts plus the exact `https://cadre.ai/industries` URL. The rendered answer displayed that official link. All rendered answer links belonged to the selected entry's approved Industries, Case studies or About URLs; no script/image/iframe/object/embed element was present in the message. One user bubble and one assistant bubble were present, with no UI alert, page error or failed chat request.

Latency is from observed POST request to response event (1,257 ms), not a separate server-only timing. Whole attempt time was 2,365 ms. Request hash covers the serialized POST body; reply hash covers the returned reply string. No response body, headers or credentials are included.

## Exact executed browser command

Executed from the Cadre AI project root through `rtk proxy node -e`, using scoped browser/network permission:

```sh
rtk proxy node -e 'const { chromium, expect } = require("@playwright/test");
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const base = "https://cadre-ai-chatbot-tawny.vercel.app";
const question = "Do you serve hotels?";
const start = Date.now();
const result = { startedAt: new Date(start).toISOString(), mode: "public-live-no-interception", baseURL: base, viewport: { width: 1280, height: 900 }, navigation: "domcontentloaded", enterActions: 0, chatRequests: 0, chatPostRequests: 0, pageErrors: 0, chatRequestFailures: 0 };
const sha = (v) => createHash("sha256").update(v).digest("hex");
const remaining = () => Math.max(1, 45000 - (Date.now() - start));
let browser;
let page;
let stage = "launch";
let timedOut = false;
let requestStarted;
const requests = [];
const watchdog = setTimeout(() => { timedOut = true; browser?.close().catch(() => {}); }, 45000);
(async () => {
  try {
    browser = await chromium.launch({ headless: true, timeout: Math.min(10000, remaining()) });
    result.browser = browser.version();
    const context = await browser.newContext({ viewport: result.viewport });
    page = await context.newPage();
    page.on("pageerror", () => { result.pageErrors += 1; });
    page.on("requestfailed", (request) => { if (new URL(request.url()).pathname === "/api/chat") result.chatRequestFailures += 1; });
    page.on("request", (request) => {
      if (new URL(request.url()).pathname !== "/api/chat") return;
      result.chatRequests += 1;
      if (request.method() === "POST") {
        result.chatPostRequests += 1;
        requestStarted = Date.now();
        const raw = request.postData() ?? "";
        requests.push(JSON.parse(raw));
        result.requestSha256 = sha(raw);
        result.requestUtf8Bytes = Buffer.byteLength(raw);
      }
    });
    stage = "navigate";
    const documentResponse = await page.goto(base, { waitUntil: "domcontentloaded", timeout: Math.min(15000, remaining()) });
    result.documentStatus = documentResponse?.status();
    assert.equal(result.documentStatus, 200);
    stage = "readiness";
    const input = page.getByRole("textbox", { name: "Message", exact: true });
    await expect(input).toBeEditable({ timeout: remaining() });
    await expect(page.getByText("Live model configured", { exact: true })).toBeVisible({ timeout: remaining() });
    await expect(page.locator(".topic-button")).toHaveCount(6);
    result.liveModelLabel = true;
    result.sixTopics = true;
    result.readyBeforeFill = true;
    assert.equal(result.chatRequests, 0);
    stage = "fill-once";
    await input.fill(question, { timeout: remaining() });
    await expect(input).toHaveValue(question);
    await expect(page.locator(".character-count")).toContainText("20 / 2,000");
    result.counter20BeforeEnter = true;
    stage = "single-enter";
    const responsePromise = page.waitForResponse(response => new URL(response.url()).pathname === "/api/chat" && response.request().method() === "POST", { timeout: remaining() }).catch(() => null);
    result.enterActions += 1;
    await input.press("Enter", { timeout: remaining() });
    stage = "response";
    const response = await responsePromise;
    assert.ok(response, "No chat response within the one-shot deadline");
    result.status = response.status();
    result.responseLatencyMs = Date.now() - requestStarted;
    const payload = await response.json();
    result.kind = payload.kind;
    result.replyChars = typeof payload.reply === "string" ? payload.reply.length : null;
    result.replyUtf8Bytes = typeof payload.reply === "string" ? Buffer.byteLength(payload.reply) : null;
    result.replySha256 = typeof payload.reply === "string" ? sha(payload.reply) : null;
    result.exactQuestionPayload = JSON.stringify(requests) === JSON.stringify([{ messages: [{ role: "user", content: question }] }]);
    assert.equal(result.status, 200);
    assert.equal(result.kind, "grounded");
    assert.equal(result.exactQuestionPayload, true);
    assert.equal(typeof payload.reply, "string");
    result.hospitalityFact = /hospitality/i.test(payload.reply);
    result.b2cFact = /B2C/.test(payload.reply);
    result.industriesExactURLInReply = /https:\/\/cadre\.ai\/industries(?:[\s).,]|$)/.test(payload.reply);
    assert.equal(result.hospitalityFact, true);
    assert.equal(result.b2cFact, true);
    assert.equal(result.industriesExactURLInReply, true);
    stage = "ui";
    const users = page.locator('\''[data-testid="chat-message"][data-role="user"]'\'');
    const replies = page.locator('\''[data-testid="chat-message"][data-role="assistant"]'\'');
    await expect(users).toHaveCount(1, { timeout: remaining() });
    await expect(replies).toHaveCount(1, { timeout: remaining() });
    await expect(users).toContainText(question);
    await expect(replies).toContainText(/hospitality/i);
    await expect(replies).toContainText("B2C");
    await expect(replies.locator('\''a[href="https://cadre.ai/industries"]'\'')).toBeVisible();
    await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
    const links = await replies.locator("a").evaluateAll(anchors => anchors.map(a => a.getAttribute("href")));
    const approved = new Set(["https://cadre.ai/industries", "https://cadre.ai/case-studies", "https://cadre.ai/about"]);
    result.allReplyLinksApproved = links.every(link => approved.has(link));
    result.inertMessageMarkup = await replies.locator("script,img,iframe,object,embed").count() === 0;
    result.userBubbles = await users.count();
    result.assistantBubbles = await replies.count();
    result.officialIndustriesLinkVisible = true;
    assert.equal(result.allReplyLinksApproved, true);
    assert.equal(result.inertMessageMarkup, true);
    assert.equal(result.chatPostRequests, 1);
    assert.equal(result.chatRequests, 1);
    assert.equal(result.pageErrors, 0);
    assert.equal(result.chatRequestFailures, 0);
    result.result = "PASS";
  } catch (error) {
    result.result = timedOut ? "TIMEOUT" : "FAIL";
    result.failedStage = stage;
    result.errorName = error?.name ?? "Error";
    if (page && !page.isClosed()) {
      result.userBubbles = await page.locator('\''[data-testid="chat-message"][data-role="user"]'\'').count().catch(() => null);
      result.assistantBubbles = await page.locator('\''[data-testid="chat-message"][data-role="assistant"]'\'').count().catch(() => null);
    }
    process.exitCode = 1;
  } finally {
    clearTimeout(watchdog);
    result.elapsedMs = Date.now() - start;
    result.finishedAt = new Date().toISOString();
    await browser?.close().catch(() => {});
    console.log(JSON.stringify(result));
  }
})();'
```

Command exit: 0.

## Source snapshot and boundaries

The inspected local UI/test/config hashes remained unchanged across the public suite and this attempt:

```text
3c44944e1876350fe3f460c2e14e00b5e98aaa156982eeafb5d2e8f8c288b051  src/ui/support-chat.tsx
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
ef68f6a3a9f78e338ef0b2e93c58698dbab532428a70b9abe8f1b0c902cd0a33  e2e/hydration.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
```

Those local hashes do not independently attest the deployed bundle. No source/test/Git/ledger/build/deploy changes or environment-file reads were performed. This is one live sample, not a replay of the coordinator's earlier API matrix, not a general uptime guarantee, and not evidence for all possible model outputs. Public mobile behavior and deterministic error cases are covered by the separate intercepted suite, not by additional paid conversations.

Preserved earlier evidence includes `independent-live-browser.md` (inconclusive zero POST), `hydration-diagnostic.md`, and `hydration-fix-verifier.md`. No more inference was performed after this one-shot result.

