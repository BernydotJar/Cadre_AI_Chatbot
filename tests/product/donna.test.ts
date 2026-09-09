import { describe, expect, it, vi } from "vitest";
import { cadre } from "@/config/cadre";
import { appendProactiveQuestion, proactiveQuestionFor } from "@/product/conversation";
import { cadreDonna } from "@/product/profiles/cadre-donna";
import { createChatHandler } from "@/server/chat";

function request(content: string, history: { role: "user" | "assistant"; content: string }[] = []) {
  return new Request("http://127.0.0.1/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [...history, { role: "user", content }] }),
  });
}

describe("Donna one-step initiative", () => {
  it("adds one configured question after a grounded answer and leaves facts intact", async () => {
    const selectFacts = vi.fn().mockResolvedValue([1]);
    const response = await createChatHandler({
      product: cadreDonna,
      env: { CHAT_PROVIDER: "mock" },
      selector: { selectFacts },
    })(request("What does Cadre do?"));
    const body = await response.json();
    const entry = cadre.knowledge.find((item) => item.topic === "overview")!;
    const question = cadreDonna.persona.proactive.byTopic.overview!.text;

    expect(body.kind).toBe("grounded");
    expect(body.reply.startsWith(entry.facts[1])).toBe(true);
    for (const fact of entry.facts) expect(body.reply).toContain(fact);
    expect(body.reply.split(question)).toHaveLength(2);
    expect(body.reply.indexOf(question)).toBeGreaterThan(body.reply.indexOf(entry.facts.at(-1)!));
  });

  it.each([
    ["hello", "greeting"],
    ["What is your pricing?", "decline"],
    ["Check my invoice", "redirect"],
    ["services and industries", "clarify"],
    ["How far away is the moon?", "redirect"],
  ])("never adds proactive copy to %s (%s)", async (message, kind) => {
    const response = await createChatHandler({ product: cadreDonna, env: { CHAT_PROVIDER: "mock" } })(request(message));
    const body = await response.json();
    expect(body.kind).toBe(kind);
    for (const step of Object.values(cadreDonna.persona.proactive.byTopic)) {
      expect(body.reply).not.toContain(step.text);
    }
  });

  it.each([
    "What does Cadre do? Just answer, no follow-up questions please.",
    "What does Cadre do? Do not ask me anything else.",
    "What does Cadre do? Answer only.",
  ])("respects explicit proactivity opt-out: %s", async (message) => {
    const question = cadreDonna.persona.proactive.byTopic.overview!.text;
    const body = await (await createChatHandler({ product: cadreDonna, env: { CHAT_PROVIDER: "mock" } })(request(message))).json();
    expect(body.kind).toBe("grounded");
    expect(body.reply).not.toContain(question);
    expect(body.reply).toContain("AI strategy and implementation consultancy");
  });

  it("does not repeat the same Donna question when assistant history already contains it", async () => {
    const question = cadreDonna.persona.proactive.byTopic.overview!.text;
    const history = [
      { role: "user" as const, content: "What does Cadre do?" },
      { role: "assistant" as const, content: `Grounded answer\n\n${question}` },
    ];
    const response = await createChatHandler({ product: cadreDonna, env: { CHAT_PROVIDER: "mock" } })(
      request("What does Cadre do?", history),
    );
    const body = await response.json();
    expect(body.kind).toBe("grounded");
    expect(body.reply).not.toContain(question);
  });

  it("keeps booking and portal topics informative without inventing a proactive step", async () => {
    for (const message of ["How do I book a call?", "I need portal access"]) {
      const body = await (await createChatHandler({ product: cadreDonna, env: { CHAT_PROVIDER: "mock" } })(request(message))).json();
      expect(body.kind).toBe("grounded");
      expect(body.reply).not.toContain("?");
    }
  });

  it("explicit ClientConfig test seams retain the previous no-persona behavior", async () => {
    const body = await (await createChatHandler({ config: cadre, env: { CHAT_PROVIDER: "mock" } })(request("What does Cadre do?"))).json();
    expect(body.kind).toBe("grounded");
    expect(body.reply).not.toContain(cadreDonna.persona.proactive.byTopic.overview!.text);
  });

  it("makes pricing warm and commercially aware without inventing a number", async () => {
    const body = await (await createChatHandler({ product: cadreDonna, env: { CHAT_PROVIDER: "mock" } })(request("Is it costly?"))).json();
    expect(body.kind).toBe("decline");
    expect(body.reply).toContain("Fair question — the economics matter.");
    expect(body.reply).toContain("drives revenue, profitability, and measurable business impact");
    expect(body.reply).toContain("don't have a verified price list or rate card");
    expect(body.reply).toContain("https://cadre.ai/contact");
    expect(body.reply).not.toMatch(/\$\s?\d|\b\d{2,}k\b/i);
  });

  it("keeps unsupported claims empathetic but separate from pricing copy", async () => {
    const body = await (await createChatHandler({ product: cadreDonna, env: { CHAT_PROVIDER: "mock" } })(request("Are you SOC 2 certified?"))).json();
    expect(body.kind).toBe("decline");
    expect(body.reply).toContain("precision beats a confident guess");
    expect(body.reply).not.toContain("the economics matter");
  });

  it("pure helper cannot attach persona guidance to a non-grounded decision", () => {
    expect(proactiveQuestionFor({ kind: "decline", reason: "pricing" }, [{ role: "user", content: "price" }], cadreDonna.persona)).toBeUndefined();
    expect(appendProactiveQuestion("answer", undefined)).toBe("answer");
  });
});
