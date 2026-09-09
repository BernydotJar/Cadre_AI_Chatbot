/**
 * Owner-gated installed-extension proof on the public Cadre site.
 * This uses a disposable Chromium profile and performs no server/page writes.
 */
import { chromium } from "playwright";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";

if (process.env.EXTENSION_ACTUAL_SITE !== "1") throw new Error("Set EXTENSION_ACTUAL_SITE=1 only after owner actual-site authorization");
const runLabel = process.argv[2] ?? `actual-site-${Date.now()}`;
if (!/^[a-z][a-z0-9-]{0,63}$/u.test(runLabel)) throw new Error("Use a short lowercase run label");
const root = process.cwd();
const extensionPath = path.join(root, "extension/dist");
const output = path.join(root, "extension/evidence", runLabel);
await mkdir(output); // immutable run: fail if the label already exists
const profile = await mkdtemp(path.join(tmpdir(), "cadre-extension-profile-"));
const checks = [];
const pass = (name, detail = true) => { assert.ok(detail, name); checks.push({ name, result: "PASS" }); };
let context;
let liveApiRequests = 0;
const target = "https://cadre.ai/agents#discover-agents";
try {
  context = await chromium.launchPersistentContext(profile, {
    executablePath: "/usr/bin/chromium",
    headless: true,
    viewport: { width: 1440, height: 900 },
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`, "--no-first-run", "--disable-default-apps"],
  });
  context.on("request", (request) => { if (request.url().startsWith("https://cadre-ai-chatbot-tawny.vercel.app/api/chat")) liveApiRequests += 1; });
  const page = context.pages()[0] ?? await context.newPage();
  await page.goto(target, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator("#cadre-integration-preview").waitFor({ state: "attached", timeout: 15_000 });
  pass("exactly one launcher host injected", await page.locator("#cadre-integration-preview").count() === 1);
  pass("launcher host remains inside viewport", await page.locator("#cadre-integration-preview").evaluate((host) => {
    const r = host.getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
  }));
  const hostWidthCheck = await page.locator("#cadre-integration-preview").evaluate((host) => {
    const r = host.getBoundingClientRect();
    return { withinViewport: r.left >= 0 && r.right <= innerWidth, pageOverflowPx: Math.max(0, document.documentElement.scrollWidth - innerWidth) };
  });
  pass("launcher itself adds no horizontal overflow", hostWidthCheck.withinViewport);
  checks.push({ name: "Cadre page overflow observation (site-owned baseline not used as an extension gate)", result: "INFO", pixels: hostWidthCheck.pageOverflowPx });
  await page.screenshot({ path: path.join(output, "launcher-on-cadre.png"), fullPage: false });

  const host = page.locator("#cadre-integration-preview");
  const box = await host.boundingBox();
  assert.ok(box, "launcher bounding box");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForFunction(() => document.querySelector("#cadre-integration-preview")?.getBoundingClientRect().height > 200, undefined, { timeout: 10_000 });
  const panel = await page.waitForEvent("framenavigated", { predicate: (frame) => frame.url().startsWith("chrome-extension://") && frame.url().includes("/panel.html"), timeout: 5_000 })
    .catch(() => page.frames().find((frame) => frame.url().startsWith("chrome-extension://") && frame.url().includes("/panel.html")));
  assert.ok(panel, "installed extension panel frame opened");
  await panel.getByRole("textbox", { name: "Message Donna" }).waitFor({ state: "visible", timeout: 10_000 });
  pass("installed panel renders six canonical topics", await panel.locator("#topics button").count() === 6);
  pass("panel declares local integration preview", (await panel.locator("header").innerText()).includes("LOCAL INTEGRATION PREVIEW"));
  pass("panel has no horizontal overflow", await panel.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  pass("agents discover URL produces contextual preview label", await panel.locator("#context-label").textContent() === "CADRE · DISCOVER AGENTS");
  pass("agents discover URL gets restrained contextual humor", (await panel.locator("#context-copy").textContent())?.includes("twelve agents where one well-chosen workflow would do") === true);
  await page.screenshot({ path: path.join(output, "panel-open-on-cadre.png"), fullPage: false });

  const input = panel.getByRole("textbox", { name: "Message Donna" });
  await panel.waitForFunction(() => !document.getElementById("message").readOnly, undefined, { timeout: 10_000 });
  await panel.getByRole("button", { name: "Ask: How does Cadre approach AI agents?", exact: true }).click();
  await panel.getByText("Reply received.", { exact: true }).waitFor({ timeout: 30_000 });
  const reply = await panel.locator("#conversation .message:not(.user)").last().innerText();
  pass("one approved live question produces a bounded assistant reply", reply.length > 20 && reply.length < 2600);
  pass("live reply contains no HTML element injection", await panel.locator("#conversation script,#conversation img,#conversation iframe").count() === 0);
  pass("exactly one live API request observed", liveApiRequests === 1);
  await page.screenshot({ path: path.join(output, "grounded-reply-on-cadre.png"), fullPage: false });

  await panel.getByRole("button", { name: "Minimize assistant" }).click();
  await page.waitForFunction(() => document.querySelector("#cadre-integration-preview")?.getBoundingClientRect().height < 100, undefined, { timeout: 5_000 });
  pass("minimize returns to compact launcher", true);
  const compact = await host.boundingBox();
  assert.ok(compact);
  await page.mouse.click(compact.x + compact.width / 2, compact.y + compact.height / 2);
  await input.waitFor({ state: "visible" });
  pass("minimize preserves volatile conversation", await panel.locator("#conversation .message").count() === 2);
  await panel.getByRole("button", { name: "Close and clear assistant" }).click();
  await page.waitForFunction(() => document.querySelector("#cadre-integration-preview")?.getBoundingClientRect().height < 100, undefined, { timeout: 5_000 });
  pass("close removes panel but leaves only launcher", page.frames().filter((frame) => frame.url().startsWith("chrome-extension://") && frame.url().includes("/panel.html")).length === 0);

  await page.reload({ waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator("#cadre-integration-preview").waitFor({ state: "attached", timeout: 15_000 });
  pass("full navigation produces one fresh launcher without duplicates", await page.locator("#cadre-integration-preview").count() === 1);
  pass("public page text does not receive preview copy", !(await page.locator("body").innerText()).includes("LOCAL INTEGRATION PREVIEW"));

  await writeFile(path.join(output, "installed-site.json"), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    scope: `Disposable installed Manifest V3 profile on ${target}. URL-only context; no page-text scraping, Cadre server writes, form interaction, cookies, authentication, or persistent extension storage.`,
    browserVersion: context.browser()?.version() ?? "persistent-context",
    extensionPath: "extension/dist",
    liveApiRequests,
    checks,
  }, null, 2)}\n`);
  console.log(JSON.stringify({ result: "PASS", checks: checks.length, liveApiRequests, artifacts: path.relative(root, output) }));
} finally {
  await context?.close();
  await rm(profile, { recursive: true, force: true });
}
