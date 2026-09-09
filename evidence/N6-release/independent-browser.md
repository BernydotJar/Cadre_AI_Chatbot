# N6 — independent public-browser verification

Recorded 2026-09-09T03:51:03Z (2026-09-08 Guatemala). Role: independent browser verifier.

**Verdict: PASS for the public UI with intercepted chat responses.** Exactly 34 browser cases passed: 17 desktop and 17 mobile. Initial public-page checks also passed. This is not independent verification of the live chat API or model.

Target: https://cadre-ai-chatbot-tawny.vercel.app/

The coordinator associated this alias with READY deployment `dpl_HJ3h2BuS6BAVpyHsdTZKtZHcjADu` and source `a5693d8`. That deployment/commit association was supplied by the coordinator; this verifier independently visited the public URL but did not query Vercel's control plane or prove remote source identity from a local hash.

## Exact test selection and result

Before execution, this verifier checked the unchanged E2E source and Playwright configuration. Both test names that invoke the real API were excluded, for both viewports. Every remaining test that sends a message installs a synthetic response/abort route before doing so; the remaining sizing-only case does not submit a message. Page initialization contains no chat submission.

Executed from the Cadre AI project root:

```sh
rtk proxy env E2E_BASE_URL=https://cadre-ai-chatbot-tawny.vercel.app npm run test:e2e -- --grep-invert 'anonymous conversation|all six entry points'
```

Observed output:

```text
Running 34 tests using 1 worker
34 passed (28.7s)
Exit: 0
```

Excluded, not executed:

- `anonymous conversation uses the real server and official links` (desktop/mobile).
- `all six entry points are present and clarification preserves an ordinal follow-up` (desktop/mobile).

The passing public-UI cases covered loading and duplicate-send prevention; failure, retry and recovery; Stop and late-output rejection; malformed responses; inert HTML and exact approved-link rendering; blank/multiline/IME entry; reset and browser-storage behavior; horizontal bounds and primary controls; long input/history/replies; reduced-motion layout; old request isolation; scroll following and keyboard Jump; welcome/reset geometry; Topic/Retry keyboard focus; and client timeout.

The known NO_COLOR/FORCE_COLOR warning appeared and was nonfatal. Chromium launched normally in the default execution environment; no escalation was used. No live API POST was submitted by this verifier. The intercepted replies validate the deployed UI's behavior, not provider reachability, answer grounding from live inference, or live spend.

## Independent anonymous page inspection

A second browser command visited the public page in fresh anonymous contexts without submitting chat. A guard aborted any unexpected `/api/chat` request and counted attempts; both contexts recorded **0 attempts**. Observed:

| Check | Desktop | Mobile |
| --- | --- | --- |
| Viewport | 1280 × 900 | 360 × 800 |
| Chromium | 153.0.8010.12 | 153.0.8010.12 |
| Document status | HTTP 200 | HTTP 200 |
| Title | Ask Cadre \| Cadre AI | Ask Cadre \| Cadre AI |
| Visible mode label | Live model configured | Live model configured |
| Configured topic buttons present | 6 | 6 |
| Document width / viewport width | 1280 / 1280 | 360 / 360 |
| Initial transcript scrollTop | 0 | 0 |
| Page errors | none observed | none observed |
| Chat API attempts | 0 | 0 |

The mode label is a configuration label, not evidence of a completed live-model round trip.

Public screenshots were created and visually inspected:

- `independent-public-desktop.png`: full page at 1280 × 900; all six topics and the composer visible.
- `independent-public-mobile.png`: full page from a 360 × 800 viewport; no horizontal overflow. The lower topic row is initially partly below the transcript's internal scrolling viewport.

A further read-only mobile probe scrolled each topic into view and focused it without activation. All six controls fit fully inside the transcript after scrolling and were keyboard-focusable. Minimum topic-control height was 67 px; widths/heights were all >= 44 px. The probe recorded 0 chat API attempts. Thus the screenshot's partial lower row was checked for reachability instead of being described as fully visible at initial load.

### Page inspection and capture command

This exact command exited 0. It refuses to overwrite its screenshots; a future repeat should use new evidence filenames. All created pages and browser instances were closed.

```sh
rtk proxy node -e '
const { chromium, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
 const browser = await chromium.launch({ headless: true });
 try {
  for (const [label, viewport] of [["desktop", { width: 1280, height: 900 }], ["mobile", { width: 360, height: 800 }]]) {
   const output = path.join(process.cwd(), "evidence/N6-release", "independent-public-" + label + ".png");
   if (fs.existsSync(output)) throw new Error("Refusing to overwrite existing evidence: " + output);
   const page = await browser.newPage({ viewport });
   let apiAttempts = 0;
   const pageErrors = [];
   page.on("pageerror", error => pageErrors.push(error.name));
   await page.route("**/api/chat", route => { apiAttempts++; return route.abort("blockedbyclient"); });
   const response = await page.goto("https://cadre-ai-chatbot-tawny.vercel.app/", { waitUntil: "networkidle" });
   await expect(page.getByText("Live model configured", { exact: true })).toBeVisible();
   const topics = ["what Cadre AI does", "industries we serve", "booking a strategist call", "client portal access", "the AI Maturity Index", "models and data security"];
   for (const name of topics) await expect(page.getByRole("button", { name, exact: true })).toHaveCount(1);
   await expect(page.locator(".topic-button")).toHaveCount(6);
   await expect(page.getByRole("textbox", { name: "Message", exact: true })).toBeVisible();
   const geometry = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    transcriptTop: document.querySelector(".transcript").scrollTop,
   }));
   if (geometry.documentWidth > geometry.viewportWidth) throw new Error("Horizontal overflow");
   if (apiAttempts !== 0) throw new Error("Unexpected chat attempt on initial page");
   if (pageErrors.length) throw new Error("Client page error");
   await page.screenshot({ path: output, fullPage: true, animations: "disabled" });
   console.log(JSON.stringify({ label, viewport, browser: browser.version(), status: response.status(), title: await page.title(), mode: "Live model configured", topics: topics.length, geometry, apiAttempts, pageErrors, screenshot: path.relative(process.cwd(), output) }));
   await page.close();
  }
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
'
```

### Mobile topic reachability command

This exact command exited 0; no topic was activated or submitted.

```sh
rtk proxy node -e '
const { chromium, expect } = require("@playwright/test");
const assert = require("node:assert/strict");
(async () => {
 const browser = await chromium.launch({ headless: true });
 try {
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  let apiAttempts = 0;
  await page.route("**/api/chat", route => { apiAttempts++; return route.abort("blockedbyclient"); });
  await page.goto("https://cadre-ai-chatbot-tawny.vercel.app/");
  await expect(page.getByText("Live model configured", { exact: true })).toBeVisible();
  const buttons = page.locator(".topic-button");
  await expect(buttons).toHaveCount(6);
  const rows = [];
  for (let index = 0; index < 6; index++) {
   const button = buttons.nth(index);
   await button.scrollIntoViewIfNeeded();
   await button.focus();
   await expect(button).toBeFocused();
   const geometry = await button.evaluate(el => {
    const rect = el.getBoundingClientRect();
    const parent = document.querySelector(".transcript").getBoundingClientRect();
    return { text: el.innerText, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height, transcriptTop: parent.top, transcriptBottom: parent.bottom };
   });
   assert.ok(geometry.top >= geometry.transcriptTop - 1 && geometry.bottom <= geometry.transcriptBottom + 1);
   assert.ok(geometry.width >= 44 && geometry.height >= 44);
   rows.push(geometry);
  }
  assert.equal(apiAttempts, 0);
  console.log(JSON.stringify({ result: "PASS", viewport: "360x800", fullyReachableTopicControls: rows.length, minimumControlHeight: Math.min(...rows.map(row => row.height)), apiAttempts, topicLabels: rows.map(row => row.text) }));
  await page.close();
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
'
```

Observed output:

```json
{"result":"PASS","viewport":"360x800","fullyReachableTopicControls":6,"minimumControlHeight":67,"apiAttempts":0,"topicLabels":["What Cadre AI does","Industries we serve","Booking a strategist call","Client portal access","The AI Maturity Index","Models and data security"]}
```

## Local test/source and artifact SHA-256

The local E2E/UI/configuration hashes below were unchanged before and after the public browser checks. They identify the local reviewed/test source, not a remotely proven commit. Screenshot hashes identify this verifier's retained public images.

```text
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
6990df17f301f65c319b67f38d4ee04dcd7780d2380015538012df5689d94e25  app/layout.tsx
ab9c53d5baeb295d9c95758435886a7cda33e4300e77db8e9e52a9a45ba24c25  app/globals.css
ac6f446d9773a88390a9bdccf7bc42480c57bceec886377e6b0309ec4bca808d  src/ui/conversation.ts
a3fa04964197ec149e88b53769fbab93da15fddb6fcd589508bdc694659b0d8f  src/ui/support-chat.tsx
59ad7adde6f453f193376339b4244c7e1d60f3de245579813b0e9b78ae1f703e  src/config/cadre.ts
0ea63e7529923fd1eaa85db4de3f603b68c52b219a9a579565b5b88e22b74b7c  evidence/N6-release/independent-public-desktop.png
402e86bd983b12f818532f8046226affaa1eb8772f15aa259934ace14bd35565  evidence/N6-release/independent-public-mobile.png
```

Executed hash command:

```sh
rtk proxy shasum -a 256 e2e/chat.spec.ts playwright.config.ts app/page.tsx app/layout.tsx app/globals.css src/ui/conversation.ts src/ui/support-chat.tsx src/config/cadre.ts evidence/N6-release/independent-public-desktop.png evidence/N6-release/independent-public-mobile.png
```

## Limits and ownership

This verifier did not change tests/source, use Git or the ledger, build, start/stop a server, read environment files/secrets, deploy, or make paid/live inference calls. The authored outputs are this report and the two screenshots; Playwright additionally produced its normal ignored test results.

The coordinator's concurrently executed real-API evaluation matrix is separate evidence and is not attributed to this verifier. These 34 passes must not be presented as 34 live-model checks or proof of AC9's real-provider round trip. No independent API budget measurement, full credential-exposure audit, source-provenance audit, physical-device/soft-keyboard test, comprehensive accessibility certification, source archive check, or release closure is claimed here.

