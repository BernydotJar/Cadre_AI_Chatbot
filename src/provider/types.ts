import type { KnowledgeEntry } from "@/config/types";
import type { ChatMessage } from "@/core/validate";

export type ProviderErrorCode =
  | "configuration" | "budget" | "rate_limited" | "unavailable"
  | "timeout" | "cancelled" | "invalid_response";

/** Static messages only: never retain an upstream body, key, or exception. */
export class ProviderError extends Error {
  constructor(public readonly code: ProviderErrorCode) {
    super(`Chat provider: ${code}`);
    this.name = "ProviderError";
  }
}

export type FactSelectionInput = {
  entry: KnowledgeEntry;
  messages: readonly ChatMessage[];
  signal?: AbortSignal;
};

export interface FactSelector {
  selectFacts(input: FactSelectionInput): Promise<readonly number[]>;
}

/** Selects relevance/order, never business prose or URLs. */
export function validateFactIndices(value: unknown, factCount: number): number[] {
  if (!Array.isArray(value) || !value.length || value.length > factCount
    || value.some((index) => !Number.isInteger(index) || index < 0 || index >= factCount)
    || new Set(value).size !== value.length) {
    throw new ProviderError("invalid_response");
  }
  return value as number[];
}
