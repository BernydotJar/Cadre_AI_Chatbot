import { cadre } from "@/config/cadre";
import type { ClientConfig } from "@/config/types";
import { LIMITS } from "@/core/limits";
import { composeReply, decide } from "@/core/policy";
import { parseChatRequest } from "@/core/validate";
import { getProviderMode, liveConfiguration, type ProviderEnvironment } from "@/provider/config";
import { MockFactSelector } from "@/provider/mock";
import { OpenRouterFactSelector } from "@/provider/openrouter";
import { ProviderError, validateFactIndices, type FactSelector } from "@/provider/types";
import { abortable, BodyError, cancelBody, deadline, readBoundedJson, systemClock, throwIfAborted, type Clock } from "./io";
import { clientKey, RateLimiter } from "./rate-limit";

function json(body: { reply: string; kind: string }, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });
}

function errorResponse(error: unknown) {
  if (error instanceof BodyError) {
    const copy = error.code === "too_large" ? "Your message is too large. Please shorten it and try again."
      : error.code === "invalid_json" ? "The request must contain valid JSON. Please try again."
        : "Your message could not be read. Please try again.";
    return json({ reply: copy, kind: "error" }, error.code === "too_large" ? 413 : 400);
  }
  const code = error instanceof ProviderError ? error.code : "unavailable";
  const copy = code === "cancelled" ? "The request was cancelled. You can try again."
    : code === "timeout" ? "The reply took too long. Please try again."
      : code === "rate_limited" ? "Chat is busy right now. Please wait a moment and try again."
        : "Chat is temporarily unavailable. Please try again or contact the team through the official website.";
  return json({ reply: copy, kind: "error" }, code === "cancelled" ? 499
    : code === "timeout" ? 504 : code === "rate_limited" ? 429 : 503);
}

/** Injectable seams are for mock tests; live mode never falls back to a mock. */
export function createChatHandler(options: {
  config?: ClientConfig;
  env?: ProviderEnvironment;
  selector?: FactSelector;
  fetch?: typeof fetch;
  clock?: Clock;
  limiter?: RateLimiter;
} = {}) {
  const config = options.config ?? cadre;
  const env = options.env ?? process.env;
  const clock = options.clock ?? systemClock;
  const limiter = options.limiter ?? new RateLimiter();
  let selector: FactSelector | undefined = options.selector;

  return async function handleChat(request: Request): Promise<Response> {
    const operation = deadline(LIMITS.requestTimeoutMs, request.signal, clock);
    try {
      throwIfAborted(operation.signal);
      const admission = limiter.take(clientKey(request, env), clock.now());
      if (!admission.allowed) {
        cancelBody(request.body);
        return json({ reply: "You've sent several messages recently. Please wait a moment and try again.", kind: "error" },
          429, { "retry-after": String(admission.retryAfter) });
      }
      // JSON is not a CORS-safelisted media type. Requiring it blocks browser
      // cross-site simple POSTs from spending inference budget; the route does
      // not grant cross-origin preflight access. This is not authentication.
      if (request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !== "application/json") {
        cancelBody(request.body);
        return json({ reply: "Please send your message as JSON.", kind: "error" }, 415);
      }
      const body = await readBoundedJson(request, LIMITS.maxBodyBytes, operation.signal);
      const parsed = parseChatRequest(body);
      if (!parsed.ok) return json({ reply: `Please check your message: ${parsed.error}.`, kind: "error" }, 400);

      const mode = getProviderMode(env);
      if (mode === "unavailable") throw new ProviderError("configuration");
      const live = mode === "openrouter" ? liveConfiguration(env, clock.now()) : undefined;
      if (!selector) selector = live
        ? new OpenRouterFactSelector({ ...live, fetch: options.fetch, clock }) : new MockFactSelector();

      // Decide from the full validated history so canonical clarify state is
      // preserved; only the history sent to the model is truncated.
      const decision = decide(parsed.request.messages, config);
      const composed = composeReply(decision, config);
      let text = composed.text;
      if (decision.kind === "grounded") {
        const selected = validateFactIndices(await abortable(selector.selectFacts({
          entry: decision.entry,
          messages: parsed.request.messages.slice(-LIMITS.historyWindow),
          signal: operation.signal,
        }), operation.signal), decision.entry.facts.length);
        // Relevance ordering only: all remaining facts stay, including the
        // portal/security/booking/assessment boundaries and necessary context.
        const order = [...selected, ...decision.entry.facts.map((_, index) => index)
          .filter((index) => !selected.includes(index))];
        text = order.map((index) => decision.entry.facts[index]!).join(" ");
      }
      // URLs and labels are app-owned. Plain text API remains {reply, kind};
      // the UI must render text and allowlist links rather than arbitrary HTML.
      const links = composed.links.map((link) => `${link.label}: ${link.url}`);
      const reply = [text, ...links].join("\n\n");
      // Never truncate a safety boundary or a URL to fit the cap.
      if (reply.length > LIMITS.maxReplyChars) throw new ProviderError("invalid_response");
      throwIfAborted(operation.signal);
      return json({ reply, kind: composed.kind });
    } catch (error) {
      return errorResponse(error);
    } finally {
      operation.dispose();
    }
  };
}
