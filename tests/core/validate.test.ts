import { describe, expect, it } from "vitest";
import { LIMITS } from "@/core/limits";
import { parseChatRequest } from "@/core/validate";

function userMessage(content: string) {
  return { role: "user" as const, content };
}

describe("parseChatRequest", () => {
  it("accepts a minimal valid request", () => {
    const result = parseChatRequest({ messages: [userMessage("Hello")] });
    expect(result.ok).toBe(true);
  });

  it("accepts a bounded multi-turn conversation ending with the user", () => {
    const result = parseChatRequest({
      messages: [
        userMessage("What does Cadre AI do?"),
        { role: "assistant", content: "Cadre AI is an AI consultancy." },
        userMessage("Do you work with real estate?"),
      ],
    });
    expect(result.ok).toBe(true);
  });

  it("rejects an empty message list", () => {
    const result = parseChatRequest({ messages: [] });
    expect(result.ok).toBe(false);
  });

  it("rejects empty and whitespace-only content", () => {
    expect(parseChatRequest({ messages: [userMessage("")] }).ok).toBe(false);
    expect(parseChatRequest({ messages: [userMessage("   ")] }).ok).toBe(false);
  });

  it("rejects oversized content", () => {
    const oversized = "x".repeat(LIMITS.maxMessageChars + 1);
    expect(parseChatRequest({ messages: [userMessage(oversized)] }).ok).toBe(false);
  });

  it("rejects too many messages", () => {
    const messages = Array.from({ length: LIMITS.maxMessages + 1 }, () =>
      userMessage("hi"),
    );
    expect(parseChatRequest({ messages }).ok).toBe(false);
  });

  it("rejects a conversation that does not end with the user", () => {
    const result = parseChatRequest({
      messages: [
        userMessage("Hello"),
        { role: "assistant", content: "Hi there" },
      ],
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown roles and non-object input", () => {
    expect(
      parseChatRequest({ messages: [{ role: "system", content: "x" }] }).ok,
    ).toBe(false);
    expect(parseChatRequest("not an object").ok).toBe(false);
    expect(parseChatRequest(null).ok).toBe(false);
  });

  it("returns a human-readable error message on failure", () => {
    const result = parseChatRequest({ messages: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});
