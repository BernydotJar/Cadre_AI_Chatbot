import { test, expect } from "@playwright/test";

for (const viewport of [{ width: 320, height: 568 }, { width: 360, height: 640 }]) {
  test(`text spacing keeps the transcript and recovery readable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    let requests = 0;
    await page.route("**/api/chat", (route) => {
      requests += 1;
      return route.fulfill({ status: 503, json: { reply: "Unavailable.", kind: "error" } });
    });
    await page.goto("/");
    await page.getByRole("button", { name: /Ask Donna/ }).last().click();
    const input = page.getByRole("textbox", { name: "Message", exact: true });
    await expect(input).toBeEditable();
    await page.addStyleTag({ content: `
      * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }
      p { margin-bottom: 2em !important; }
    ` });
    const draft = "What services does Cadre AI offer?";
    await input.fill(draft);
    await input.press("Enter");
    const retry = page.getByRole("button", { name: "Retry response" });
    await expect(retry).toBeVisible();
    await expect(input).toHaveValue(draft);
    expect(requests).toBe(1);

    const geometry = await page.evaluate(() => {
      const space = document.querySelector(".conversation-space")!.getBoundingClientRect();
      const transcript = document.querySelector(".transcript")!;
      const rect = transcript.getBoundingClientRect();
      const styles = getComputedStyle(transcript);
      const composer = document.querySelector(".composer-section")!.getBoundingClientRect();
      const card = document.querySelector(".chat-card")!.getBoundingClientRect();
      const privacy = document.querySelector(".privacy-note")!.getBoundingClientRect();
      return {
        spaceHeight: space.height,
        readableHeight: rect.height - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom),
        transcriptBottom: rect.bottom, composerTop: composer.top,
        privacyBottom: privacy.bottom, cardBottom: card.bottom,
        documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
      };
    });
    expect(geometry.spaceHeight).toBeGreaterThanOrEqual(240);
    expect(geometry.readableHeight).toBeGreaterThanOrEqual(144);
    expect(geometry.transcriptBottom).toBeLessThanOrEqual(geometry.composerTop + 1);
    expect(geometry.privacyBottom).toBeLessThanOrEqual(geometry.cardBottom);
    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);

    // Scroll the document as needed: do not hide content to fit one screen.
    const turn = page.locator('[data-testid="chat-message"][data-role="user"]');
    await turn.scrollIntoViewIfNeeded();
    await expect(turn).toBeInViewport({ ratio: 1 });
    await expect(turn).toContainText(draft);
    await retry.scrollIntoViewIfNeeded();
    await expect(retry).toBeInViewport({ ratio: 1 });
    const privacy = page.locator(".privacy-note");
    await privacy.scrollIntoViewIfNeeded();
    await expect(privacy).toBeInViewport({ ratio: 1 });
    await expect(privacy).toContainText("external model service");
    await expect(privacy).toContainText("no chat history after a refresh");
  });
}

test("important helper and privacy copy remains at least 12px", async ({ page, isMobile }) => {
  await page.route("**/api/chat", (route) => route.fulfill({ status: 503, json: { reply: "Unavailable.", kind: "error" } }));
  await page.goto("/");
  const launcherHint = page.locator(".launcher-copy small");
  await expect(launcherHint).toBeVisible();
  expect(await launcherHint.evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(12);
  await page.getByRole("button", { name: /Ask Donna/ }).last().click();
  const input = page.getByRole("textbox", { name: "Message", exact: true });
  await expect(input).toBeEditable();
  await input.fill("services");
  await input.press("Enter");
  await expect(page.getByRole("button", { name: "Retry response" })).toBeVisible();
  const important = page.locator(".mode-label, #composer-help, .character-count, .chat-scope, .privacy-note, .error-panel p, .error-panel span, .retry-button");
  for (const element of await important.all()) {
    expect(await element.evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(12);
  }
  if (isMobile) expect(await input.evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
});
