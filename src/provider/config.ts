import { ProviderError } from "./types";

export const OPENROUTER_MODEL = "openai/gpt-4.1-mini";
export const MODEL_PROFILES = Object.freeze({
  "openai/gpt-4.1-mini": Object.freeze({ inputPriceCeiling: 0.50, outputPriceCeiling: 2 }),
  "google/gemini-3.8-flash": Object.freeze({ inputPriceCeiling: 0.80, outputPriceCeiling: 4 }),
});
export type ApprovedModel = keyof typeof MODEL_PROFILES;

export function approvedModel(value: string | undefined): ApprovedModel {
  const model = value ?? OPENROUTER_MODEL;
  if (!Object.hasOwn(MODEL_PROFILES, model)) throw new ProviderError("configuration");
  return model as ApprovedModel;
}
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
  const model = approvedModel(env.OPENROUTER_MODEL);
  const expiresAt = Date.parse(env.OPENROUTER_KEY_EXPIRES_AT ?? "");
  if (getProviderMode(env) !== "openrouter"
    || !env.OPENROUTER_API_KEY?.trim()
    || !Number.isFinite(expiresAt) || expiresAt <= now || expiresAt > AUTHORIZED_LIVE_DEADLINE) {
    throw new ProviderError("configuration");
  }
  return { apiKey: env.OPENROUTER_API_KEY, expiresAt, model };
}
