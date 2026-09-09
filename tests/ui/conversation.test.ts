import { describe, expect, it } from "vitest";
import { approvedTextParts, buildRequestHistory, readReply, type Message } from "@/ui/conversation";

describe("UI boundary helpers", () => {
  const links = [{ label: "Contact", url: "https://cadre.ai/contact" }];
  it("recognizes only complete approved URLs, allowing sentence punctuation", () => {
    const parts = approvedTextParts("https://cadre.ai/contact. https://cadre.ai/contact.evil.example https://cadre.ai/contact?next=evil https://evil.example", links);
    expect(parts.filter((part) => part.href).map((part) => part.href)).toEqual(["https://cadre.ai/contact"]);
    expect(parts.map((part) => part.text).join("")).toBe("https://cadre.ai/contact. https://cadre.ai/contact.evil.example https://cadre.ai/contact?next=evil https://evil.example");
  });
  it.each([null, {}, { reply: "", kind: "grounded" }, { reply: "x".repeat(2401), kind: "grounded" },
    { reply: "okay", kind: ["grounded"] }, { reply: "okay", kind: "error" }, { reply: 12, kind: "grounded" }])("rejects an invalid response contract: %j", (value) => {
    expect(readReply(value)).toBeUndefined();
  });
  it.each(["grounded", "clarify", "redirect", "decline"])("accepts a bounded %s reply", (kind) => {
    expect(readReply({ reply: "Verified response.", kind })).toEqual({ reply: "Verified response.", kind });
  });
  it("bounds the newest history while retaining the final question", () => {
    const messages: Message[] = Array.from({ length: 41 }, (_, id) => ({ id, role: id % 2 ? "assistant" : "user", content: `message ${id}` }));
    const result = buildRequestHistory(messages);
    expect(result).toHaveLength(20);
    expect(result.at(-1)).toEqual({ role: "user", content: "message 40" });
    expect(result[0]?.content).toBe("message 21");
  });
  it("retains an earlier clarification marker and the latest immediate exchange", () => {
    const messages: Message[] = Array.from({ length: 41 }, (_, id) => ({ id, role: id % 2 ? "assistant" : "user", content: `message ${id}` }));
    const first = messages.slice(0, 2);
    const result = buildRequestHistory(messages, first);
    expect(result).toHaveLength(20);
    expect(result.slice(0, 2)).toEqual(first.map(({ role, content }) => ({ role, content })));
    expect(result.slice(-3)).toEqual(messages.slice(-3).map(({ role, content }) => ({ role, content })));
    expect(new Set(result.map((item) => item.content)).size).toBe(20);
  });
  it("bounds outbound assistant content without mutating display text", () => {
    const messages: Message[] = [{ id: 1, role: "assistant", content: "x".repeat(2400) }, { id: 2, role: "user", content: "services" }];
    const result = buildRequestHistory(messages);
    expect(result[0]?.content.length).toBe(2000);
    expect(messages[0]?.content.length).toBe(2400);
  });
});
