import { afterEach, describe, expect, it, vi } from "vitest";
import { cadre } from "@/config/cadre";
import { LIMITS } from "@/core/limits";
import { AUTHORIZED_LIVE_DEADLINE, getProviderMode, liveConfiguration } from "@/provider/config";
import { OpenRouterFactSelector, PROVIDER_LIMITS } from "@/provider/openrouter";

const now = Date.parse("2026-09-09T00:00:00Z");
const entry = cadre.knowledge[0]!;
const input = { entry, messages: [{ role: "user" as const, content: "What services do you offer?" }] };
const metadata = (overrides = {}) => Response.json({ data: {
  limit: 5, limit_remaining: 5, usage: 0, limit_reset: null, ...overrides,
} });
const completion = (content = '{"fact_indices":[0]}', overrides = {}) => Response.json({
  choices: [{ finish_reason: "stop", message: { role: "assistant", content } }],
  usage: { prompt_tokens: 400, completion_tokens: 12, cost: 0.0002 }, ...overrides,
});
function adapter(fetcher: typeof fetch, expiresAt = Date.now() + 60_000) {
  return new OpenRouterFactSelector({ apiKey: "synthetic-test-only", expiresAt, fetch: fetcher });
}
afterEach(() => vi.useRealTimers());

describe("OpenRouter contract with entirely synthetic transport", () => {
  it("sends only a bounded fact selection prompt with enforced provider price ceilings", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata()).mockResolvedValueOnce(completion());
    expect(await adapter(fetcher).selectFacts(input)).toEqual([0]);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0]![0]).toBe("https://openrouter.ai/api/v1/key");
    const [url, options] = fetcher.mock.calls[1]!;
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(options).toMatchObject({ method: "POST", redirect: "error", cache: "no-store" });
    const payload = JSON.parse(options!.body as string);
    expect(payload.model).toBe("openai/gpt-4.1-mini");
    expect(payload.max_tokens).toBe(PROVIDER_LIMITS.maxOutputTokens);
    expect(payload.provider).toEqual({ require_parameters: true, data_collection: "deny", max_price: { prompt: 0.5, completion: 2 } });
    expect(payload.response_format.json_schema.strict).toBe(true);
    expect(payload.tools).toBeUndefined();
    expect(payload.plugins).toBeUndefined();
    expect(payload.messages).toHaveLength(2);
    expect(options!.body).not.toContain("synthetic-test-only");
    const data = JSON.parse(payload.messages[1].content);
    expect(data.facts).toEqual(entry.facts.map((text, index) => ({ index, text })));
  });

  it.each([
    { limit: null }, { limit: 6 }, { limit_reset: "daily" }, { usage: -1 },
    { limit_remaining: 6 }, { limit_remaining: 4, usage: 2 }, { limit_remaining: 0 },
    { limit_remaining: 0.50 }, { limit_remaining: 0.501 },
  ])("refuses unsafe or exhausted budget metadata %j without an inference call", async (overrides) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata(overrides));
    await expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "budget" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([401, 403, 429, 500])("fails closed when key preflight returns %s", async (status) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response("private upstream details", { status }));
    await expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "configuration" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each(["not JSON", '{"fact_indices":[]}', '{"fact_indices":[-1]}', '{"fact_indices":[999]}',
    '{"fact_indices":[0,0]}', '{"fact_indices":[0.5]}', '{"fact_indices":["0"]}',
    '{"fact_indices":[0],"prose":"invented"}'])("rejects untrusted output %s without retry", async (content) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata()).mockResolvedValueOnce(completion(content));
    await expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "invalid_response" });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it.each([
    { error: { message: "raw upstream error" } },
    { choices: [{ finish_reason: "length", message: { role: "assistant", content: '{"fact_indices":[0]}' } }] },
    { usage: { prompt_tokens: 999999, completion_tokens: 12, cost: 0.0002 } },
    { usage: { prompt_tokens: 400, completion_tokens: 999999, cost: 0.0002 } },
    { usage: { prompt_tokens: 400, completion_tokens: 12, cost: 1 } },
    { usage: { prompt_tokens: 400, completion_tokens: 12 } },
  ])("rejects HTTP 200 errors and impossible accounting %j", async (overrides) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata()).mockResolvedValueOnce(completion(undefined, overrides));
    await expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "invalid_response" });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it.each([429, 503])("retries one explicit %s rejection only once with bounded delay", async (status) => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata())
      .mockResolvedValueOnce(new Response("", { status, headers: { "retry-after": "99999" } }))
      .mockResolvedValueOnce(completion());
    const result = adapter(fetcher).selectFacts(input);
    const assertion = expect(result).resolves.toEqual([0]);
    await vi.advanceTimersByTimeAsync(PROVIDER_LIMITS.maxRetryDelayMs);
    await assertion;
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("stops after a second explicit transient rejection", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata())
      .mockImplementation(async () => new Response("private provider message", { status: 429 }));
    const assertion = expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "rate_limited" });
    await vi.advanceTimersByTimeAsync(250);
    await assertion;
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it.each([401, 403, 408, 500, 502, 504])("does not retry ambiguous or permanent HTTP %s", async (status) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata())
      .mockResolvedValueOnce(new Response("private provider message", { status }));
    await expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({
      code: [401, 403].includes(status) ? "configuration" : "unavailable",
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("does not retry a network failure or expose its raw message", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata()).mockRejectedValueOnce(new Error("sensitive upstream"));
    await expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "unavailable", message: "Chat provider: unavailable" });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("bounds a stalled preflight and a stalled inference by the same total timeout", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    const fetcher = vi.fn<typeof fetch>().mockImplementation(() => new Promise(() => undefined));
    const assertion = expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "timeout" });
    await vi.advanceTimersByTimeAsync(LIMITS.requestTimeoutMs);
    await assertion;
    expect(fetcher).toHaveBeenCalledTimes(1);
    fetcher.mockReset().mockResolvedValueOnce(metadata()).mockImplementation(() => new Promise(() => undefined));
    const second = expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "timeout" });
    await vi.advanceTimersByTimeAsync(LIMITS.requestTimeoutMs);
    await second;
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("cancels a stalled response stream and releases the deadline", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    const cancel = vi.fn();
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata()).mockResolvedValueOnce(new Response(new ReadableStream({ cancel })));
    const assertion = expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "timeout" });
    await vi.advanceTimersByTimeAsync(LIMITS.requestTimeoutMs);
    await assertion;
    expect(cancel).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("rejects oversized streamed provider data and cancels it", async () => {
    const cancel = vi.fn();
    const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(33 * 1024)); }, cancel });
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(metadata()).mockResolvedValueOnce(new Response(stream));
    await expect(adapter(fetcher).selectFacts(input)).rejects.toMatchObject({ code: "invalid_response" });
    expect(cancel).toHaveBeenCalled();
  });

  it("checks cancellation and operational expiry before any outbound request", async () => {
    const controller = new AbortController(); controller.abort();
    const fetcher = vi.fn<typeof fetch>();
    await expect(adapter(fetcher).selectFacts({ ...input, signal: controller.signal })).rejects.toMatchObject({ code: "cancelled" });
    await expect(adapter(fetcher, Date.now() - 1).selectFacts(input)).rejects.toMatchObject({ code: "configuration" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("cannot replenish local allowance from stale metadata after ambiguous inference", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (url) => {
      if (String(url).endsWith("/key")) return metadata({ limit_remaining: 0.51, usage: 4.49 });
      throw new Error("ambiguous network outcome");
    });
    const selector = adapter(fetcher);
    const failures: string[] = [];
    for (let i = 0; i < 20; i++) {
      try { await selector.selectFacts(input); } catch (error) { failures.push((error as { code: string }).code); }
    }
    expect(failures).toContain("unavailable");
    expect(failures.at(-1)).toBe("budget");
    const inferenceCalls = fetcher.mock.calls.filter(([url]) => String(url).endsWith("/chat/completions"));
    expect(inferenceCalls.length).toBeLessThan(20);
  });
});

describe("server-only configuration", () => {
  it("defaults to mock and never silently falls back from invalid live configuration", () => {
    expect(getProviderMode({})).toBe("mock");
    expect(getProviderMode({ CHAT_PROVIDER: "typo" })).toBe("unavailable");
    expect(() => liveConfiguration({ CHAT_PROVIDER: "openrouter" }, now)).toThrow();
  });
  it("requires the approved model and caps the operational expiry", () => {
    const env = { CHAT_PROVIDER: "openrouter", OPENROUTER_API_KEY: "synthetic-test-only", OPENROUTER_KEY_EXPIRES_AT: "2026-09-15T00:00:00Z" };
    expect(liveConfiguration(env, now).expiresAt).toBe(AUTHORIZED_LIVE_DEADLINE);
    expect(() => liveConfiguration({ ...env, OPENROUTER_MODEL: "unapproved" }, now)).toThrow();
    expect(() => liveConfiguration({ ...env, OPENROUTER_KEY_EXPIRES_AT: "2026-10-08T00:00:00Z" }, now)).toThrow();
    expect(() => liveConfiguration(env, AUTHORIZED_LIVE_DEADLINE)).toThrow();
  });
});
