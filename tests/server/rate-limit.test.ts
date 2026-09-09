import { describe, expect, it } from "vitest";
import { clientKey, RATE_LIMIT, RateLimiter } from "@/server/rate-limit";

describe("bounded, best-effort fixed-window admission", () => {
  it("limits one client and resets exactly at the next window", () => {
    const limiter = new RateLimiter();
    for (let count = 0; count < 10; count += 1) expect(limiter.take("first", 1000).allowed).toBe(true);
    expect(limiter.take("first", 1001)).toEqual({ allowed: false, retryAfter: 60 });
    expect(limiter.take("second", 1001).allowed).toBe(true);
    expect(limiter.take("first", 61_000).allowed).toBe(true);
  });
  it("bounds storage and rate-limits overflow without evicting hot clients", () => {
    const limiter = new RateLimiter();
    for (let index = 0; index < RATE_LIMIT.maxClients; index += 1) limiter.take(String(index), 1000);
    for (let index = 0; index < 10; index += 1) expect(limiter.take(`overflow-${index}`, 1000).allowed).toBe(true);
    expect(limiter.take("another overflow", 1000).allowed).toBe(false);
    expect(limiter.size).toBe(RATE_LIMIT.maxClients);
    expect(limiter.take("new window", 61_000).allowed).toBe(true);
    expect(limiter.size).toBe(1);
  });
  it("requires explicit trusted-header opt-in and falls back on malformed or ambiguous metadata", () => {
    const request = (headers: Record<string, string>) => new Request("http://localhost", { headers });
    expect(clientKey(request({ "x-forwarded-for": "192.0.2.1" }), {})).toBe("global");
    const env = { CHAT_TRUSTED_PROXY_IP_HEADER: "x-forwarded-for" };
    expect(clientKey(request({ "x-forwarded-for": "192.0.2.1" }), env)).toBe("ip:192.0.2.1");
    expect(clientKey(request({ "x-forwarded-for": "192.0.2.1, 192.0.2.2" }), env)).toBe("global");
    expect(clientKey(request({ "x-forwarded-for": "fake-ip" }), env)).toBe("global");
    expect(clientKey(request({}), env)).toBe("global");
    expect(clientKey(request({ "x-real-ip": "2001:db8::1" }), { CHAT_TRUSTED_PROXY_IP_HEADER: "x-real-ip" })).toBe("ip:2001:db8::1");
    expect(clientKey(request({ "arbitrary-user-input": "192.0.2.1" }), { CHAT_TRUSTED_PROXY_IP_HEADER: "arbitrary-user-input" })).toBe("global");
  });
});
