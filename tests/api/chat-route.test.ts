import { describe, expect, it } from "vitest";
import { POST } from "../../app/api/chat/route";
import { GET as healthGet } from "../../app/api/health/route";
import { LIMITS } from "@/core/limits";

function chatRequest(body: string, headers: Record<string, string> = {}) {
  return new Request("http://127.0.0.1/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

describe("POST /api/chat (walking skeleton)", () => {
  it("echoes the last user message with a bounded reply", async () => {
    const response = await POST(
      chatRequest(
        JSON.stringify({
          messages: [
            { role: "user", content: "first" },
            { role: "assistant", content: "reply" },
            { role: "user", content: "second question" },
          ],
        }),
      ),
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.reply).toContain("second question");
    expect(payload.kind).toBe("clarify");
    expect(payload.reply.length).toBeLessThanOrEqual(LIMITS.maxReplyChars);
  });

  it("returns 400 for invalid JSON without leaking internals", async () => {
    const response = await POST(chatRequest("{not json"));
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toEqual({ error: "request body must be valid JSON" });
  });

  it("returns 400 for schema violations", async () => {
    const response = await POST(chatRequest(JSON.stringify({ messages: [] })));
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(typeof payload.error).toBe("string");
  });

  it("returns 413 when the declared content-length exceeds the cap", async () => {
    const response = await POST(
      chatRequest(JSON.stringify({ messages: [{ role: "user", content: "hi" }] }), {
        "content-length": String(LIMITS.maxBodyBytes + 1),
      }),
    );
    expect(response.status).toBe(413);
  });

  it("returns 413 for an oversized body even without content-length", async () => {
    const hugeContent = "x".repeat(LIMITS.maxBodyBytes + 10);
    const body = JSON.stringify({ messages: [{ role: "user", content: hugeContent }] });
    const headerless = new Request("http://127.0.0.1/api/chat", {
      method: "POST",
      body,
    });
    const response = await POST(headerless);
    expect(response.status).toBe(413);
  });
});

describe("GET /api/health", () => {
  it("reports ok and disables caching", async () => {
    const response = healthGet();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "ok" });
  });
});
