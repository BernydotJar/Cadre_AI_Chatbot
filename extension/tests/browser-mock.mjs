/** Synthetic HTTPS host + mocked runtime ports, NOT an installed extension or
 * actual-site integration test. Every HTTP request is intercepted locally. */
import { chromium } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../../", import.meta.url));
const runLabel = process.argv[2] ?? `run-${Date.now()}`;
if (!/^[a-z][a-z0-9-]{0,63}$/u.test(runLabel)) throw new Error("Use a short lowercase artifact run label");
const output = path.join(root, "extension/evidence", runLabel);
await mkdir(path.dirname(output), { recursive: true });
await mkdir(output); // Refuse an existing run; original evidence is immutable.
const checks = [];
const checked = (name, result) => { assert.ok(result, name); checks.push({ name, result: "PASS" }); };
const content = await readFile(path.join(root, "extension/dist/content-script.js"), "utf8");
const browser = await chromium.launch({ headless: true });
let context;
try {
  context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const intercepted = [];
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    intercepted.push(`${url.origin}${url.pathname}`);
    if (url.origin === "https://preview.extension.test") {
      const relative = url.pathname.slice(1);
      if (!["panel.html", "panel.js", "panel.css", "config.js", "shared/contracts.js", "shared/conversation.js", "shared/limits.js"].includes(relative)) return route.abort();
      return route.fulfill({ contentType: relative.endsWith(".html") ? "text/html" : relative.endsWith(".css") ? "text/css" : "application/javascript", body: await readFile(path.join(root, "extension/dist", relative)) });
    }
    if (url.origin === "https://cadre.ai" || url.origin === "https://www.cadre.ai" || url.origin === "https://not-cadre.test") {
      return route.fulfill({ contentType: "text/html", body: "<!doctype html><html lang=en><head><title>Synthetic host fixture — NOT the Cadre website</title><style>body{margin:30px;background:#e9e5da;font:18px system-ui;color:#344032}button,textarea{background:magenta!important;color:red!important;font-size:50px!important}</style></head><body><h1>Synthetic host fixture</h1><p>Mock-only UI verification. No Cadre website content or requests.</p><form><label>Host form <input id=host-field value=untouched></label></form></body></html>" });
    }
    await route.abort();
  });
  await context.exposeBinding("previewMockControl", async ({ page }, type) => {
    if (type === "MINIMIZE" || type === "CLOSE") await page.mainFrame().evaluate((control) => globalThis.__hostMessage?.({ type: control }), type);
  });
  await context.addInitScript(() => {
    const state = { requests: [], mode: "ok", cancelled: [], disconnected: false, connections: 0, pageContext: "generic", panelListener: undefined };
    globalThis.__previewTest = state;
    globalThis.chrome = { runtime: {
      id: "abcdefghijklmnopabcdefghijklmnop",
      getURL: (file) => `https://preview.extension.test/${file}`,
      connect: ({ name }) => {
        state.connections++;
        let listener;
        const disconnectListeners = [];
        const timers = new Map();
        const port = {
          name,
          onMessage: { addListener: (fn) => { listener = fn; if (name.includes("host")) globalThis.__hostMessage = fn; } },
          onDisconnect: { addListener: (fn) => disconnectListeners.push(fn) },
          postMessage: (message) => {
            if (message.type === "REGISTER") { state.pageContext = message.pageContext; setTimeout(() => listener?.({ type: "REGISTERED" }), 0); return; }
            if (message.type === "CONTEXT") { state.pageContext = message.pageContext; state.panelListener?.({ type: "CONTEXT", pageContext: message.pageContext }); return; }
            if (message.type === "MINIMIZE" || message.type === "CLOSE") { void globalThis.previewMockControl(message.type); return; }
            if (message.type === "CANCEL") { state.cancelled.push(message.requestId); clearTimeout(timers.get(message.requestId)); return; }
            if (message.type !== "CHAT_REQUEST") return;
            state.requests.push(message);
            if (state.mode === "pending") return;
            timers.set(message.requestId, setTimeout(() => {
              if (state.mode === "error") listener?.({ type: "CHAT_ERROR", requestId: message.requestId, errorCode: "UNAVAILABLE" });
              else if (state.mode === "malformed") listener?.({ type: "CHAT_RESPONSE", requestId: message.requestId, payload: { reply: "unsafe unknown kind", kind: "tool" } });
              else listener?.({ type: "CHAT_RESPONSE", requestId: message.requestId, payload: { reply: "Safe mock answer. <img src=x onerror=alert(1)> https://cadre.ai/contact https://cadre.ai/contact/evil", kind: "grounded" } });
            }, 20));
          },
          disconnect: () => { state.disconnected = true; for (const timer of timers.values()) clearTimeout(timer); },
        };
        if (name.includes("panel")) { state.panelListener = (message) => listener?.(message); setTimeout(() => listener?.({ type: "READY", pageContext: "agents-discover" }), 0); }
        else globalThis.__hostDisconnect = () => { port.disconnect(); for (const fn of disconnectListeners) fn(); };
        return port;
      },
    } };
  });
  const page = await context.newPage();
  async function clickLauncher() {
    const box = await page.locator("#cadre-integration-preview").boundingBox();
    assert.ok(box, "launcher host has geometry");
    await page.mouse.click(box.x + box.width / 2, box.y + box.height - 31);
  }
  await page.goto("https://not-cadre.test/");
  await page.addScriptTag({ content });
  checked("unsupported origin gets no host", await page.locator("#cadre-integration-preview").count() === 0);
  await page.goto("https://cadre.ai/agents#discover-agents");
  await page.addScriptTag({ content });
  await page.addScriptTag({ content });
  checked("one widget across duplicate script evaluation", await page.locator("#cadre-integration-preview").count() === 1);
  checked("launcher uses closed shadow root", await page.locator("#cadre-integration-preview").evaluate((host) => host.shadowRoot === null));
  await page.evaluate(() => globalThis.__hostDisconnect());
  checked("idle worker disconnect preserves launcher for user-driven reconnection", await page.locator("#cadre-integration-preview").count() === 1);
  await clickLauncher();
  await page.waitForFunction(() => document.querySelector("#cadre-integration-preview")?.getBoundingClientRect().height > 200);
  const panel = await page.waitForEvent("framenavigated", {
    predicate: (frame) => frame.url().startsWith("https://preview.extension.test/panel.html"),
    timeout: 3_000,
  }).catch(() => page.frames().find((frame) => frame.url().startsWith("https://preview.extension.test/panel.html")));
  assert.ok(panel, "panel frame opened");
  checked("user click re-registers host after idle disconnect", await page.evaluate(() => globalThis.__previewTest.connections) === 2);
  const input = panel.getByRole("textbox", { name: "Message Donna" });
  await input.waitFor({ state: "visible" });
  await panel.waitForFunction(() => !document.getElementById("message").readOnly);
  checked("six core topic labels available", await panel.locator("#topics button").count() === 6);
  await panel.getByText("You found the agent catalog. I promise not to recommend twelve agents where one well-chosen workflow would do.", { exact: true }).waitFor();
  checked("approved URL context reaches the panel without page-text scraping", await panel.locator("#context-label").textContent() === "CADRE · DISCOVER AGENTS");
  const criticalCopySizes = await panel.evaluate(() => {
    const px = (selector) => Number.parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
    return { eyebrow: px(".eyebrow"), kicker: px(".welcome-kicker"), context: px("#context-label"), prompt: px("#context-prompt"), privacy: px("#privacy"), status: px("#status") };
  });
  checked("mode privacy and boundary copy stay at least 12px", Object.values(criticalCopySizes).every((size) => size >= 12));
  checked("host stylesheet cannot override panel controls", await input.evaluate((node) => getComputedStyle(node).fontSize) === "12px");
  await input.fill("services"); await input.press("Enter");
  await panel.getByText("Reply received.", { exact: true }).waitFor();
  checked("one explicit submission yields one mock request", await panel.evaluate(() => globalThis.__previewTest.requests.length) === 1);
  checked("reply rendered as text, not model HTML", await panel.locator("#conversation img").count() === 0 && (await panel.locator("#conversation").textContent()).includes("<img src=x onerror=alert(1)>"));
  checked("only exact approved contact URL is clickable", await panel.locator("#conversation a").count() === 1 && await panel.locator("#conversation a").getAttribute("href") === "https://cadre.ai/contact");
  checked("host form remains unchanged", await page.locator("#host-field").inputValue() === "untouched");
  await page.screenshot({ path: path.join(output, "mock-desktop.png"), fullPage: true });
  await panel.getByRole("button", { name: "Minimize assistant" }).click();
  await page.waitForFunction(() => document.querySelector("#cadre-integration-preview")?.getBoundingClientRect().height < 100);
  checked("minimize restores launcher focus", await page.evaluate(() => document.activeElement?.id) === "cadre-integration-preview");
  await clickLauncher();
  await input.waitFor({ state: "visible" });
  checked("minimize preserves in-memory conversation", await panel.locator("#conversation .message").count() === 2);
  await panel.getByRole("button", { name: "New chat", exact: true }).click();
  checked("reset clears panel display", await panel.locator("#conversation .message").count() === 0);
  await input.press("Enter");
  checked("empty submit sends nothing", await panel.evaluate(() => globalThis.__previewTest.requests.length) === 1);
  await panel.evaluate(() => { globalThis.__previewTest.mode = "error"; });
  await input.fill("retry example"); await input.press("Enter");
  await panel.getByRole("button", { name: "Retry last message" }).waitFor();
  await panel.evaluate(() => { globalThis.__previewTest.mode = "ok"; });
  await panel.getByRole("button", { name: "Retry last message" }).click();
  await panel.getByText("Reply received.", { exact: true }).waitFor();
  checked("manual retry retains one user bubble", await panel.locator("#conversation .user").count() === 1 && await panel.evaluate(() => globalThis.__previewTest.requests.length) === 3);
  await panel.evaluate(() => { globalThis.__previewTest.mode = "pending"; });
  await input.fill("stop example"); await input.press("Enter");
  await panel.getByRole("button", { name: "Stop", exact: true }).click();
  checked("stop cancels once without resubmit", await panel.evaluate(() => globalThis.__previewTest.cancelled.length === 1 && globalThis.__previewTest.requests.length === 4));
  await panel.getByRole("button", { name: "Close and clear assistant" }).click();
  await page.waitForFunction(() => document.querySelector("#cadre-integration-preview")?.getBoundingClientRect().height < 100);
  await page.setViewportSize({ width: 360, height: 800 });
  await clickLauncher();
  const mobile = await page.waitForEvent("framenavigated", { predicate: (frame) => frame.url().startsWith("https://preview.extension.test/panel.html"), timeout: 3000 }).catch(() => page.frames().find((frame) => frame.url().startsWith("https://preview.extension.test/panel.html")));
  assert.ok(mobile);
  await mobile.getByRole("textbox", { name: "Message Donna" }).waitFor();
  checked("close/reopen clears all conversation state", await mobile.locator("#conversation .message").count() === 0);
  checked("mobile host width stays inside viewport", await page.locator("#cadre-integration-preview").evaluate((host) => host.getBoundingClientRect().left >= 0 && host.getBoundingClientRect().right <= innerWidth));
  checked("mobile panel has no horizontal overflow", await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(output, "mock-mobile.png"), fullPage: true });
  await page.locator("#cadre-integration-preview").evaluate((host) => host.remove());
  await page.waitForFunction(() => globalThis.__previewTest.disconnected);
  checked("host removal disconnects preview and disposes iframe", page.frames().length === 1);
  checked("no API or unmocked network URL was requested", intercepted.every((url) => /^(https:\/\/(cadre\.ai|not-cadre\.test|preview\.extension\.test)\/)/u.test(url)));
  await writeFile(path.join(output, "browser-mock.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), scope: "Synthetic HTTPS host, fake runtime ports, all HTTP intercepted. Not an installed MV3 extension or actual Cadre site test.", browserVersion: browser.version(), checks, realApiRequests: 0, actualSiteRequests: 0 }, null, 2)}\n`);
  console.log(JSON.stringify({ result: "PASS", checks: checks.length, actualSiteRequests: 0, realApiRequests: 0, artifacts: path.relative(root, output) }));
} finally { await context?.close(); await browser.close(); }
