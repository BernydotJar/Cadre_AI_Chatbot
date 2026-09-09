import { test, expect } from "@playwright/test";

test("cold-load controls wait for hydration before accepting the first message", async ({ page }) => {
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
    const input = page.getByRole("textbox", { name: "Message", exact: true });
    await expect(input).toBeVisible();
    await expect.poll(() => scriptsHeld).toBeGreaterThan(0);
    await expect(input).toBeDisabled();
    await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
    const topics = page.locator(".topic-button");
    await expect(topics).toHaveCount(6);
    for (const topic of await topics.all()) await expect(topic).toBeDisabled();
    await expect(page.locator("#composer-help")).toContainText("Preparing chat");
    expect(requests).toHaveLength(0);
    release();
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

test("without JavaScript the contact route remains usable and chat is not falsely interactive", async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport });
  const page = await context.newPage();
  try {
    await page.goto(baseURL!);
    await expect(page.getByRole("textbox", { name: "Message", exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
    await expect(page.locator(".topic-button")).toHaveCount(6);
    for (const topic of await page.locator(".topic-button").all()) await expect(topic).toBeDisabled();
    await expect(page.locator("#composer-help")).toContainText("reload or contact the team");
    await expect(page.locator(".contact-link")).toHaveAttribute("href", "https://cadre.ai/contact");
    await expect(page.locator(".contact-link")).toBeVisible();
  } finally {
    await context.close();
  }
});
