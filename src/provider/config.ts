import { ProviderError } from "./types";

export const OPENROUTER_MODEL = "openai/gpt-4.1-mini";
/** Owner's seven-day allowance, not the credential's potentially later expiry. */
export const AUTHORIZED_LIVE_DEADLINE = Date.parse("2026-09-15T00:00:00Z");
export type ProviderMode = "mock" | "openrouter" | "unavailable";
export type ProviderEnvironment = Record<string, string | undefined>;

/** Safe for a server page to export as a label; never exposes a credential. */
export function getProviderMode(env: ProviderEnvironment = process.env): ProviderMode {
  if (env.CHAT_PROVIDER === undefined || env.CHAT_PROVIDER === "mock") return "mock";
  return env.CHAT_PROVIDER === "openrouter" ? "openrouter" : "unavailable";
}

export function liveConfiguration(env: ProviderEnvironment, now: number) {
  const expiresAt = Date.parse(env.OPENROUTER_KEY_EXPIRES_AT ?? "");
  if (getProviderMode(env) !== "openrouter"
    || !env.OPENROUTER_API_KEY?.trim()
    || (env.OPENROUTER_MODEL !== undefined && env.OPENROUTER_MODEL !== OPENROUTER_MODEL)
    || !Number.isFinite(expiresAt) || expiresAt <= now || expiresAt > AUTHORIZED_LIVE_DEADLINE) {
    throw new ProviderError("configuration");
  }
  return { apiKey: env.OPENROUTER_API_KEY, expiresAt };
}
