import { throwIfAborted } from "@/server/io";
import type { FactSelectionInput, FactSelector } from "./types";

/** Fully local simulation. No fetch, no key, no hidden fallback to live. */
export class MockFactSelector implements FactSelector {
  async selectFacts({ entry, signal }: FactSelectionInput): Promise<number[]> {
    throwIfAborted(signal);
    return entry.facts.map((_, index) => index);
  }
}
