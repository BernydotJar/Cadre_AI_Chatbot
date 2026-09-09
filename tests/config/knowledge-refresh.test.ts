import { describe, expect, it } from "vitest";
import { cadre } from "@/config/cadre";
import { LIMITS } from "@/core/limits";
import { composeReply, respond } from "@/core/policy";
import { routeMessage } from "@/core/route";
import { createChatHandler } from "@/server/chat";

describe("official knowledge refresh — six-topic boundary", () => {
  it.each(["hospitality", "hotel", "hotels", "b2b", "b2c"])("routes %s to industry fit", (message) => {
    const route = routeMessage(message, cadre);
    expect(route.kind).toBe("match");
    if (route.kind === "match") expect(route.entry.topic).toBe("industries");
    const reply = respond([{ role: "user", content: message }], cadre);
    expect(reply.text).toContain("hospitality");
    expect(reply.text).toContain("B2C services");
    expect(reply.links).toContainEqual({ label: "Industries", url: "https://cadre.ai/industries" });
  });

  it("explains the portal without inventing access", () => {
    const reply = respond([{ role: "user", content: "client portal" }], cadre);
    expect(reply.text).toContain("tools, agents, training, and results");
    expect(reply.text).toContain("does not have access");
    expect(reply.text).toContain("no public portal address is verified");
    expect(reply.links).toEqual([cadre.contact]);
  });

  it("explains assessment results without issuing a score or timeline", () => {
    const reply = respond([{ role: "user", content: "maturity index" }], cadre);
    expect(reply.text).toContain("grade for each area");
    expect(reply.text).toContain("scoring weights and assessment duration are not verified");
    expect(reply.text).toContain("cannot run the assessment or produce a score");
    expect(reply.text).not.toMatch(/45.day|your score is/i);
  });

  it("does not promise a booking or follow-up SLA", () => {
    const reply = respond([{ role: "user", content: "book a strategist call" }], cadre);
    expect(reply.text).toContain("does not confirm an appointment or a response time");
    expect(reply.text).not.toContain("the Cadre AI team follows up");
  });

  it("attributes security claims and separates this chatbot from Cadre's policy", () => {
    const reply = respond([{ role: "user", content: "data security" }], cadre);
    expect(reply.text).toContain("company claims, not a verified guarantee");
    expect(reply.text).toContain("does not automatically describe this separately hosted chatbot");
    expect(reply.text).toContain("not all been independently verified");
    expect(reply.links).toContainEqual({ label: "Cadre privacy policy", url: "https://cadre.ai/legal/privacy-policy" });
    expect(respond([{ role: "user", content: "Are you SOC 2 certified?" }], cadre).kind).toBe("decline");
    expect(respond([{ role: "user", content: "Do you guarantee no training?" }], cadre).kind).toBe("decline");
  });

  it.each(cadre.knowledge)("retains all $topic facts and links within the API reply cap", async (entry) => {
    const pure = composeReply({ kind: "grounded", entry }, cadre);
    const size = [pure.text, ...pure.links.map((link) => `${link.label}: ${link.url}`)].join("\n\n").length;
    expect(size).toBeLessThanOrEqual(LIMITS.maxReplyChars);
    const handle = createChatHandler({ env: { CHAT_PROVIDER: "mock" }, selector: { selectFacts: async () => [0] } });
    const response = await handle(new Request("http://localhost/api/chat", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: entry.label }] }),
    }));
    expect(response.status).toBe(200);
    const data = await response.json() as { kind: string; reply: string };
    expect(data.kind).toBe("grounded");
    for (const fact of entry.facts) expect(data.reply).toContain(fact);
    for (const link of entry.approvedLinks) expect(data.reply).toContain(link.url);
  });
});
