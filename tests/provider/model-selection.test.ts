import { describe, expect, it, vi } from "vitest";
import { cadre } from "@/config/cadre";
import { AUTHORIZED_LIVE_DEADLINE, liveConfiguration } from "@/provider/config";
import { OpenRouterFactSelector } from "@/provider/openrouter";

const env = { CHAT_PROVIDER: "openrouter", OPENROUTER_API_KEY: "synthetic-only",
  OPENROUTER_KEY_EXPIRES_AT: new Date(AUTHORIZED_LIVE_DEADLINE).toISOString() };
const now = AUTHORIZED_LIVE_DEADLINE - 100_000;
const input = { entry: cadre.knowledge[0]!, messages: [{ role: "user" as const, content: "What services?" }] };

describe("allowlisted server model selection", () => {
  it("keeps the original default", () => {
    expect(liveConfiguration(env, now).model).toBe("openai/gpt-4.1-mini");
  });
  it.each(["openai/gpt-4.1-mini", "google/gemini-3.8-flash"])("accepts reviewed model %s", (model) => {
    expect(liveConfiguration({ ...env, OPENROUTER_MODEL: model }, now).model).toBe(model);
  });
  it.each(["", "unapproved", "__proto__", "constructor", "google/gemini-flash-latest", " google/gemini-3.8-flash"])("rejects unreviewed ID %s", (model) => {
    expect(() => liveConfiguration({ ...env, OPENROUTER_MODEL: model }, now)).toThrow();
  });
  it.each([
    ["openai/gpt-4.1-mini", 0.5, 2],
    ["google/gemini-3.8-flash", 0.8, 4],
  ] as const)("uses exact %s and its ceilings without widening output or prompts", async (model, prompt, completion) => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ data: { limit: 5, usage: 0, limit_remaining: 5, limit_reset: null } }))
      .mockResolvedValueOnce(Response.json({ choices: [{ finish_reason: "stop", message: { role: "assistant", content: '{"fact_indices":[0]}' } }],
        usage: { prompt_tokens: 400, completion_tokens: 12, cost: 0.0004 } }));
    const selector = new OpenRouterFactSelector({ ...liveConfiguration({ ...env, OPENROUTER_MODEL: model }, now), fetch: fetcher });
    expect(await selector.selectFacts(input)).toEqual([0]);
    const sent = JSON.parse(fetcher.mock.calls[1]![1]!.body as string);
    expect(sent.model).toBe(model);
    expect(sent.provider.max_price).toEqual({ prompt, completion });
    expect(sent.provider.require_parameters).toBe(true);
    expect(sent.provider.data_collection).toBe("deny");
    expect(sent.temperature).toBe(0);
    expect(sent.max_tokens).toBe(256);
    expect(sent.tools).toBeUndefined();
    expect(sent.response_format.json_schema.strict).toBe(true);
  });
  it("retains the reserve for the higher-cost profile before inference", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ data: { limit: 5, usage: 4.499, limit_remaining: 0.501, limit_reset: null } }));
    const selector = new OpenRouterFactSelector({ ...liveConfiguration({ ...env, OPENROUTER_MODEL: "google/gemini-3.8-flash" }, now), fetch: fetcher });
    await expect(selector.selectFacts(input)).rejects.toMatchObject({ code: "budget" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
