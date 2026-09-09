import { test, expect, type Page } from "@playwright/test";

const messages = (page: Page, role: "user" | "assistant") => page.locator(`[data-testid="chat-message"][data-role="${role}"]`);
const input = (page: Page) => page.getByRole("textbox", { name: "Message", exact: true });

async function openDonna(page: Page) {
  const launcher = page.getByRole("button", { name: /Ask Donna/ }).last();
  if (await launcher.isVisible().catch(() => false)) await launcher.click();
  await expect(input(page)).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await openDonna(page);
});

test("first impression feels like a Cadre page with an inviting Donna product", async ({ page }) => {
  await page.reload();
  await expect(page.locator('link[rel~="icon"]')).toHaveAttribute("href", /icon\.svg/);
  await expect(page.getByText("VERIFIED CADRE CONTEXT", { exact: true })).toBeVisible();
  await expect(page.locator(".intro .eyebrow-rule")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /From AI curiosity.*to a clear next move/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI that earns its place in the business." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Track your AI results" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Useful by design. Bounded on purpose." })).toBeVisible();
  await expect(page.locator(".donna-nudge")).toContainText("100+ high-ROI use cases");
  const launcher = page.getByRole("button", { name: /Ask Donna/ }).last();
  await expect(launcher).toBeVisible();
  await expect(launcher.locator('.persona-avatar[data-avatar-style="signal-orb"]')).toBeVisible();
  await launcher.click();
  await expect(page.getByRole("heading", { name: "Donna", exact: true })).toBeVisible();
  await expect(page.locator(".chat-header .persona-avatar")).toHaveAttribute("data-avatar-style", "signal-orb");
  await expect(page.locator(".quick-prompt")).toHaveCount(4);
  await expect(input(page)).toHaveAttribute("placeholder", "What are you trying to figure out?");
  await input(page).fill("hello");
  await input(page).press("Enter");
  const reply = messages(page, "assistant").first();
  await expect(reply).toContainText("What would you like to explore?");
  await expect(reply).toContainText("AI Maturity Index");
  await expect(reply.locator("a")).toHaveCount(0);
});

test("floating Donna closes with Escape and restores launcher focus", async ({ page }) => {
  await expect(input(page)).toBeFocused();
  await page.keyboard.press("Escape");
  const launcher = page.getByRole("button", { name: /Ask Donna/ }).last();
  await expect(page.locator(".chat-card")).toHaveCount(0);
  await expect(launcher).toBeVisible();
  await expect(launcher).toBeFocused();
});

test("reduced motion disables the new orb and glare animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const launcher = page.getByRole("button", { name: /Ask Donna/ }).last();
  await expect(launcher).toBeVisible();
  const orb = launcher.locator(".donna-orb");
  await expect(orb).toHaveCSS("animation-name", "none");
  expect(await launcher.evaluate((element) => getComputedStyle(element, "::after").animationName)).toBe("none");
  await expect(page.locator(".intro-media")).toHaveAttribute("data-motion", "poster");
});

test("ambient media is local, muted, bounded, and presentation-only", async ({ page }) => {
  const media = page.locator(".intro-media");
  await expect(media).toBeVisible();
  await expect(media).toHaveAttribute("data-motion", "video");
  const video = media.locator("video");
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute("poster", "/media/donna-ambient-poster.webp");
  await expect(video.locator("source")).toHaveAttribute("src", "/media/donna-ambient-loop.mp4");
  expect(await video.evaluate((node) => {
    const element = node as HTMLVideoElement;
    return element.muted && element.autoplay && element.loop && element.playsInline;
  })).toBe(true);
  const pause = page.getByRole("button", { name: "Pause ambient motion" });
  await expect(pause).toBeVisible();
  // Reproduce the production cold-load race deterministically: application
  // state already offers Pause while native autoplay has not started yet.
  await video.evaluate((node) => (node as HTMLVideoElement).pause());
  expect(await video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(true);
  await pause.click();
  await expect(media).toHaveAttribute("data-motion", "paused");
  expect(await video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(true);
  await page.getByRole("button", { name: "Play ambient motion" }).click();
  await expect(media).toHaveAttribute("data-motion", "video");
});

test("reduced motion keeps the static poster and never mounts the ambient video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const media = page.locator(".intro-media");
  await expect(media).toBeVisible();
  await expect(media).toHaveAttribute("data-motion", "poster");
  await expect(media.locator("video")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /ambient motion/ })).toHaveCount(0);
  await expect(media).toHaveCSS("background-image", /donna-ambient-poster\.webp/);
});

test("ambient motion control never obscures the hero across responsive widths", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const size of [
    { width: 320, height: 568 },
    { width: 360, height: 640 },
    { width: 760, height: 900 },
  ]) {
    await page.setViewportSize(size);
    await page.reload();
    const heading = page.locator(".intro h1");
    const control = page.getByRole("button", { name: "Pause ambient motion" });
    await expect(control).toBeVisible();
    const [headingBox, controlBox] = await Promise.all([heading.boundingBox(), control.boundingBox()]);
    expect(headingBox).not.toBeNull();
    expect(controlBox).not.toBeNull();
    const overlaps = headingBox && controlBox
      ? headingBox.x < controlBox.x + controlBox.width && headingBox.x + headingBox.width > controlBox.x
        && headingBox.y < controlBox.y + controlBox.height && headingBox.y + headingBox.height > controlBox.y
      : true;
    expect(overlaps, `${size.width}px motion control overlaps hero`).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }

  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".intro-media")).toHaveAttribute("data-motion", "poster");
  await expect(page.locator(".intro-media video")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /ambient motion/ })).toHaveCount(0);
});

test("anonymous conversation uses the real server and official links", async ({ page }) => {
  if (!process.env.E2E_BASE_URL || process.env.E2E_EXPECT_MODE === "mock") {
    await expect(page.getByText(/Demo/)).toBeVisible();
  }
  await input(page).fill("What services does Cadre AI offer?");
  await input(page).press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(1);
  await expect(messages(page, "assistant").first()).toContainText("AI Strategy");
  await expect(messages(page, "assistant").first().locator('a[href="https://cadre.ai/strategy"]')).toBeVisible();
  await input(page).fill("How do I access my client portal?");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(messages(page, "assistant")).toHaveCount(2);
  await expect(messages(page, "assistant").last()).toContainText(/contact/i);
  await expect(messages(page, "assistant").last().locator('a[href="https://cadre.ai/contact"]')).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("Donna presentation handles one configured next step and an opt-out", async ({ page }) => {
  const nextStep = "Which part of the business is creating the most repetitive work today?";
  await page.route("**/api/chat", (route) => {
    const payload = route.request().postDataJSON() as { messages: { content: string }[] };
    const optedOut = payload.messages.at(-1)?.content.includes("no follow-up") ?? false;
    const reply = `Cadre AI is an AI strategy and implementation consultancy.${optedOut ? "" : `\n\n${nextStep}`}`;
    return route.fulfill({ json: { reply, kind: "grounded" } });
  });

  await input(page).fill("What does Cadre do?");
  await input(page).press("Enter");
  const reply = messages(page, "assistant").first();
  await expect(reply).toContainText("AI strategy and implementation consultancy");
  await expect(reply).toContainText(nextStep);
  expect((await reply.innerText()).split(nextStep)).toHaveLength(2);

  await page.getByRole("button", { name: "New conversation" }).click();
  await input(page).fill("What does Cadre do? Just answer, no follow-up questions please.");
  await input(page).press("Enter");
  await expect(messages(page, "assistant").first()).not.toContainText(nextStep);
});

test("all six entry points are present and clarification preserves an ordinal follow-up", async ({ page }) => {
  await page.locator(".topic-browser").evaluate((node) => { (node as HTMLDetailsElement).open = true; });
  for (const label of ["what Cadre AI does", "industries we serve", "booking a strategist call", "client portal access", "the AI Maturity Index", "models and data security"]) {
    await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
  }
  await input(page).fill("services and industries");
  await input(page).press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(1);
  await expect(messages(page, "assistant").first()).toContainText("industries");
  await input(page).fill("the second one");
  await input(page).press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(2);
  await expect(messages(page, "assistant").last()).toContainText("B2B companies");
});

test("loading is announced and rapid Enter cannot duplicate a request", async ({ page }) => {
  let calls = 0;
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/chat", async (route) => {
    calls += 1;
    await held;
    await route.fulfill({ json: { reply: "A verified response.", kind: "grounded" } });
  });
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect(page.getByRole("button", { name: "Stop response" })).toBeVisible();
  await expect(page.locator('[aria-busy="true"]').first()).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(messages(page, "user")).toHaveCount(1);
  expect(calls).toBe(1);
  release();
  await expect(messages(page, "assistant")).toHaveCount(1);
});

test("Donna visibly shapes while a grounded request is in flight", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/chat", async (route) => {
    await held;
    await route.fulfill({ json: { reply: "A grounded answer.", kind: "grounded" } });
  });
  await input(page).fill("What does Cadre do?");
  await input(page).press("Enter");
  await expect(page.locator('.chat-header .persona-avatar[data-avatar-state="shaping"]')).toBeVisible();
  await expect(page.locator(".pending-message")).toContainText("Shaping");
  release();
  await expect(messages(page, "assistant")).toHaveCount(1);
  await expect(page.locator('.chat-header .persona-avatar[data-avatar-state="idle"]')).toBeVisible();
});

test("pricing is empathetic and commercially aware without inventing a rate", async ({ page }) => {
  await input(page).fill("Is it costly?");
  await input(page).press("Enter");
  const reply = messages(page, "assistant").first();
  await expect(reply).toContainText("Fair question");
  await expect(reply).toContainText("revenue, profitability, and measurable business impact");
  await expect(reply).toContainText("price list or rate card");
  await expect(reply.locator('a[href="https://cadre.ai/contact"]')).toBeVisible();
  expect(await reply.innerText()).not.toMatch(/\$\s?\d|\b\d{2,}k\b/i);
});

test("retry preserves the failed turn and does not duplicate history", async ({ page }) => {
  const requests: unknown[] = [];
  await page.route("**/api/chat", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status: requests.length === 1 ? 503 : 200,
      json: requests.length === 1 ? { reply: "Chat is temporarily unavailable. Please try again.", kind: "error" }
        : { reply: "Ready to help.", kind: "grounded" } });
  });
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Retry response" }).click();
  await expect(messages(page, "assistant")).toHaveCount(1);
  await expect(messages(page, "user")).toHaveCount(1);
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
});

test("network failure has a safe retry path", async ({ page }) => {
  await page.route("**/api/chat", (route) => route.abort("failed"));
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry response" })).toBeEnabled();
  await expect(page.locator("body")).not.toContainText("TypeError");
});

test("cancelling prevents a late response from appearing and preserves a retry", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  let intercepted = 0;
  await page.route("**/api/chat", async (route) => {
    intercepted += 1;
    await held;
    await route.fulfill({ json: { reply: "This late answer must not appear.", kind: "grounded" } }).catch(() => {});
  });
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect(page.getByRole("button", { name: "Stop response" })).toBeVisible();
  await expect.poll(() => intercepted).toBe(1);
  await page.getByRole("button", { name: "Stop response" }).click();
  release();
  await expect(page.getByRole("button", { name: "Retry response" })).toBeVisible();
  await expect(messages(page, "assistant")).toHaveCount(0);
  await expect(messages(page, "user")).toHaveCount(1);
  await expect(input(page)).toHaveValue("services");
  expect(intercepted).toBe(1);
});

test("malformed responses produce a recoverable safe error", async ({ page }) => {
  await page.route("**/api/chat", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Internal stack trace</h1>" }));
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry response" })).toBeEnabled();
  await expect(page.locator("body")).not.toContainText("Internal stack trace");
});

test("model text is inert and only exact approved URLs become links", async ({ page }) => {
  const text = '<img src=x onerror="window.injected=1"> https://evil.example https://cadre.ai/contact.evil.example\n\nContact Cadre AI: https://cadre.ai/contact';
  await page.route("**/api/chat", (route) => route.fulfill({ json: { reply: text, kind: "grounded" } }));
  await input(page).fill("services");
  await input(page).press("Enter");
  const reply = messages(page, "assistant").first();
  await expect(reply).toContainText("<img");
  await expect(reply.locator("img")).toHaveCount(0);
  await expect(reply.locator("a")).toHaveCount(1);
  await expect(reply.locator("a")).toHaveAttribute("href", "https://cadre.ai/contact");
  expect(await page.evaluate(() => Reflect.get(window, "injected"))).toBeUndefined();
});

test("blank input, multiline entry, and IME composition do not send accidentally", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/chat", (route) => { calls += 1; return route.fulfill({ json: { reply: "Okay.", kind: "grounded" } }); });
  await input(page).focus();
  await input(page).press("Enter");
  await expect(page.getByRole("alert")).toContainText(/Write a message/);
  expect(calls).toBe(0);
  await input(page).fill("services");
  await input(page).press("Shift+Enter");
  await expect(input(page)).toHaveValue("services\n");
  await input(page).dispatchEvent("keydown", { key: "Enter", code: "Enter", isComposing: true, bubbles: true });
  expect(calls).toBe(0);
  await expect(messages(page, "user")).toHaveCount(0);
});

test("new conversation clears local state without persistence", async ({ page }) => {
  await page.route("**/api/chat", (route) => route.fulfill({ json: { reply: "An answer.", kind: "grounded" } }));
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(1);
  await page.getByRole("button", { name: "New conversation" }).click();
  await expect(messages(page, "user")).toHaveCount(0);
  await expect(messages(page, "assistant")).toHaveCount(0);
  const storage = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }));
  expect(storage).toEqual({ local: 0, session: 0 });
});

test("viewport has no horizontal overflow and primary controls are reachable", async ({ page }) => {
  await expect(page.getByRole("main")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await input(page).focus();
  await expect(input(page)).toBeFocused();
  await input(page).fill("services");
  const box = await page.getByRole("button", { name: "Send message", exact: true }).boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect(box?.width).toBeGreaterThanOrEqual(44);
});

test("long conversations and composer input remain bounded", async ({ page }) => {
  const lengths: number[] = [];
  await page.route("**/api/chat", (route) => {
    const payload = route.request().postDataJSON() as { messages: { role: string; content: string }[] };
    lengths.push(payload.messages.length);
    expect(payload.messages.length).toBeLessThanOrEqual(20);
    expect(payload.messages.every((message) => message.content.length <= 2000)).toBe(true);
    expect(payload.messages.at(-1)?.role).toBe("user");
    return route.fulfill({ json: { reply: "Approved answer.", kind: "grounded" } });
  });
  await input(page).fill("x".repeat(2100));
  await expect(input(page)).toHaveValue("x".repeat(2100));
  await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
  await expect(page.getByRole("alert")).toContainText(/2,?000/);
  for (let turn = 0; turn < 23; turn += 1) {
    await input(page).fill(`services ${turn}`);
    await input(page).press("Enter");
    await expect(page.getByRole("button", { name: "Stop response" })).toHaveCount(0);
    await expect(messages(page, "assistant").last()).toContainText("Approved answer.");
  }
  expect(lengths).toHaveLength(23);
  expect(await messages(page, "user").count() + await messages(page, "assistant").count()).toBeLessThanOrEqual(40);
});

test("long inert response remains within the mobile viewport with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/chat", (route) => route.fulfill({ json: { reply: "x".repeat(2300), kind: "grounded" } }));
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("a new conversation cannot be overwritten by an older in-flight response", async ({ page }) => {
  let calls = 0;
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/chat", async (route) => {
    calls += 1;
    if (calls === 1) {
      await held;
      await route.fulfill({ json: { reply: "Discarded old response.", kind: "grounded" } }).catch(() => {});
    } else await route.fulfill({ json: { reply: "Current conversation response.", kind: "grounded" } });
  });
  await input(page).fill("first services request");
  await input(page).press("Enter");
  await expect(page.getByRole("button", { name: "Stop response" })).toBeVisible();
  await page.getByRole("button", { name: "New conversation" }).click();
  await input(page).fill("second services request");
  await input(page).press("Enter");
  await expect(messages(page, "assistant")).toHaveText(/Current conversation response/);
  release();
  await expect(messages(page, "user")).toHaveCount(1);
  await expect(messages(page, "assistant")).toHaveCount(1);
  await expect(page.locator("body")).not.toContainText("Discarded old response.");
});

test("reading earlier messages is respected until Jump to latest is used", async ({ page }) => {
  await page.route("**/api/chat", (route) => route.fulfill({ json: { reply: "A grounded paragraph. ".repeat(70), kind: "grounded" } }));
  for (let turn = 0; turn < 4; turn += 1) {
    await input(page).fill(`services ${turn}`);
    await input(page).press("Enter");
    await expect(messages(page, "assistant")).toHaveCount(turn + 1);
  }
  const region = page.getByRole("region", { name: "Conversation", exact: true });
  await region.evaluate((element) => { element.scrollTop = 0; element.dispatchEvent(new Event("scroll")); });
  await expect(page.getByRole("button", { name: "Jump to latest" })).toBeVisible();
  await input(page).fill("another services question");
  await input(page).press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(5);
  expect(await region.evaluate((element) => element.scrollTop)).toBeLessThan(10);
  const jump = page.getByRole("button", { name: "Jump to latest" });
  await jump.focus();
  await jump.press("Enter");
  await expect(input(page)).toBeFocused();
  await expect(jump).toHaveCount(0);
  expect(await region.evaluate((element) => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(5);
});

test("welcome starts at the top and reset restores that position", async ({ page }) => {
  const region = page.getByRole("region", { name: "Conversation", exact: true });
  const top = () => region.evaluate((element) => element.scrollTop);
  await expect.poll(top).toBe(0);
  const geometry = await region.evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    heading: element.querySelector("h3")?.getBoundingClientRect().top,
  }));
  expect(geometry.heading).toBeGreaterThanOrEqual(geometry.top);
  await page.route("**/api/chat", (route) => route.fulfill({ json: { reply: "Resettable answer.", kind: "grounded" } }));
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(1);
  await page.getByRole("button", { name: "New conversation" }).click();
  await expect.poll(top).toBe(0);
  await expect(input(page)).toBeFocused();
  await expect(page.getByRole("button", { name: "Jump to latest" })).toHaveCount(0);
});

test("keyboard topic activation preserves a stable focus target", async ({ page }) => {
  await page.locator(".topic-browser").evaluate((node) => { (node as HTMLDetailsElement).open = true; });
  await page.route("**/api/chat", (route) => route.fulfill({ json: { reply: "A topic response.", kind: "grounded" } }));
  const topic = page.getByRole("button", { name: "what Cadre AI does", exact: true });
  await topic.focus();
  await topic.press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(1);
  await expect(input(page)).toBeFocused();
  await page.keyboard.type("next question");
  await expect(input(page)).toHaveValue("next question");
});

test("keyboard retry preserves focus without duplicating the user turn", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/chat", (route) => {
    calls += 1;
    return route.fulfill({ status: calls === 1 ? 503 : 200,
      json: calls === 1 ? { reply: "Unavailable.", kind: "error" } : { reply: "Recovered.", kind: "grounded" } });
  });
  await input(page).fill("services");
  await input(page).press("Enter");
  const retry = page.getByRole("button", { name: "Retry response" });
  await expect(retry).toBeVisible();
  await retry.focus();
  await retry.press("Enter");
  await expect(messages(page, "assistant")).toHaveCount(1);
  await expect(messages(page, "user")).toHaveCount(1);
  await expect(input(page)).toBeFocused();
  expect(calls).toBe(2);
});

test("client deadline yields a saved draft and does not accept late output", async ({ page }) => {
  await page.clock.install();
  let calls = 0;
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/chat", async (route) => {
    calls += 1;
    await held;
    await route.fulfill({ json: { reply: "Too late.", kind: "grounded" } }).catch(() => {});
  });
  await input(page).fill("services");
  await input(page).press("Enter");
  await expect.poll(() => calls).toBe(1);
  await page.clock.fastForward(25_001);
  await expect(page.getByRole("alert")).toContainText(/too long|timed out/i);
  await expect(page.getByRole("button", { name: "Retry response" })).toBeVisible();
  await expect(input(page)).toHaveValue("services");
  release();
  await expect(messages(page, "assistant")).toHaveCount(0);
  expect(calls).toBe(1);
});
