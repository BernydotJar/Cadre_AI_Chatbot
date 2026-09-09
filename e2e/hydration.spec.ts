import { test, expect } from "@playwright/test";

test("cold-load launcher waits for hydration before opening the first conversation", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  let scriptsHeld = 0;
  const requests: unknown[] = [];
  const pageErrors: string[] = [];
  page.on("pageerror", () => pageErrors.push("pageerror"));
  await page.route("**/_next/static/**/*.js*", async (route) => {
    scriptsHeld += 1;
    await held;
    await route.continue().catch(() => {});
  });
  await page.route("**/api/chat", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ json: { kind: "grounded", reply: "A controlled first reply." } });
  });
  try {
    await page.goto("/", { waitUntil: "commit" });
    await expect.poll(() => scriptsHeld).toBeGreaterThan(0);
    const launcher = page.getByRole("button", { name: /Ask Donna/ }).last();
    await expect(launcher).toBeVisible();
    await expect(launcher).toBeDisabled();
    await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveCount(0);
    expect(requests).toHaveLength(0);
    release();
    await expect(launcher).toBeEnabled();
    await launcher.click();
    const input = page.getByRole("textbox", { name: "Message", exact: true });
    await expect(input).toBeEditable();
    await input.fill("Do you serve hotels?");
    await expect(page.locator(".character-count")).toContainText("20 / 2,000");
    await input.press("Enter");
    await expect(page.locator('[data-testid="chat-message"][data-role="assistant"]')).toHaveText(/A controlled first reply/);
    expect(requests).toEqual([{ messages: [{ role: "user", content: "Do you serve hotels?" }] }]);
    expect(pageErrors).toEqual([]);
  } finally {
    release();
  }
});

test("without JavaScript the public Cadre page and contact route remain usable without fake chat", async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport });
  const page = await context.newPage();
  try {
    await page.goto(baseURL!);
    await expect(page.getByRole("heading", { name: /From AI curiosity/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Track your AI results" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveCount(0);
    await expect(page.locator(".noscript-note")).toContainText("Chat needs JavaScript");
    await expect(page.locator(".contact-link")).toHaveAttribute("href", "https://cadre.ai/contact");
    await expect(page.locator(".contact-link")).toBeVisible();
  } finally {
    await context.close();
  }
});
