import type { ClientConfig, KnowledgeEntry } from "@/config/types";
import { containsPhrase, normalize } from "./text";

export { containsPhrase, normalize };

/**
 * Deterministic intent routing over the curated knowledge set.
 * User text is DATA: it is normalized and matched against configured
 * keywords; nothing in it can add links, facts, or instructions.
 */

export type RouteResult =
  | { kind: "match"; entry: KnowledgeEntry; score: number }
  | { kind: "ambiguous"; candidates: KnowledgeEntry[] }
  | { kind: "unknown" };

function scoreEntry(normalizedMessage: string, entry: KnowledgeEntry): number {
  const words = normalizedMessage.split(" ");
  const matches: Array<{ start: number; length: number }> = [];
  // Labels are valid answers to the choices we show in a clarification.
  for (const phrase of new Set([...entry.keywords, entry.label].map(normalize))) {
    if (!phrase) continue;
    const phraseWords = phrase.split(" ");
    for (let start = 0; start <= words.length - phraseWords.length; start += 1) {
      if (phraseWords.every((word, offset) => words[start + offset] === word)) {
        matches.push({ start, length: phraseWords.length });
        break; // Repeating a phrase does not increase its routing weight.
      }
    }
  }

  // Prefer specific phrases and count each span once. Nested aliases such as
  // "AI agents" and "agents" are one signal, not two independent votes.
  matches.sort((a, b) => b.length - a.length || a.start - b.start);
  const covered = new Set<number>();
  let score = 0;
  for (const match of matches) {
    const positions = Array.from({ length: match.length }, (_, offset) => match.start + offset);
    if (positions.some((position) => covered.has(position))) continue;
    positions.forEach((position) => covered.add(position));
    score += match.length;
  }
  return score;
}

/**
 * Route a user message to at most one knowledge entry.
 * - No keyword hits -> unknown.
 * - A clear winner -> match.
 * - Two leaders with the same score -> ambiguous (caller may clarify once).
 */
export function routeMessage(message: string, config: ClientConfig): RouteResult {
  const normalized = normalize(message);
  if (!normalized) return { kind: "unknown" };

  const scored = config.knowledge
    .map((entry) => ({ entry, score: scoreEntry(normalized, entry) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0];
  if (!top) return { kind: "unknown" };

  const leaders = scored.filter((candidate) => candidate.score === top.score);
  if (leaders.length > 1) {
    return { kind: "ambiguous", candidates: leaders.map((leader) => leader.entry) };
  }
  return { kind: "match", entry: top.entry, score: top.score };
}

/** True when the message hits any boundary trigger list. */
export function matchesTriggers(message: string, triggers: readonly string[]): boolean {
  const normalized = normalize(message);
  return triggers.some((trigger) => containsPhrase(normalized, trigger));
}
