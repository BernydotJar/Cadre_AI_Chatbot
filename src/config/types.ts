import { z } from "zod";
import { normalize } from "@/core/text";

/**
 * Client configuration contract. Everything client-specific — brand, topics,
 * verified facts, approved links, boundary copy — lives behind this schema.
 * The chat core (`src/core`) consumes only this contract, never a concrete
 * client module, so a second client is a new configuration, not new logic
 * (a reuse hypothesis exercised by the fixture in `src/config/fixtures`).
 */

export const approvedLinkSchema = z.object({
  label: z.string().min(1),
  url: z.url().startsWith("https://"),
});

export const knowledgeEntrySchema = z.object({
  /** Stable id, used in tests and evidence. */
  id: z.string().min(1),
  /** Routing topic; one entry per topic. */
  topic: z.string().min(1),
  /** Human-readable topic name, used in user-facing clarification copy. */
  label: z.string().min(1),
  /** Lowercase keywords/phrases that route a message to this entry. */
  keywords: z.array(z.string().min(1)).min(1),
  /** Verified statements only — the ONLY facts the bot may assert. */
  facts: z.array(z.string().min(1)).min(1),
  /** The only links the bot may surface for this topic. */
  approvedLinks: z.array(approvedLinkSchema),
  /** Provenance: where the facts come from and when they were retrieved. */
  source: z.object({
    origin: z.string().min(1),
    retrievedAt: z.string().min(1).optional(),
  }),
});

export const clientConfigSchema = z.object({
  clientName: z.string().min(1),
  botName: z.string().min(1),
  /** Short description shown in the UI header. */
  tagline: z.string().min(1),
  /** Official https domain; every approved link must live under it. */
  officialDomain: z.url().startsWith("https://"),
  /** Canonical human-escalation link (contact page). */
  contact: approvedLinkSchema,
  knowledge: z.array(knowledgeEntrySchema).min(1),
  boundaries: z.object({
    /**
     * Lowercase triggers for requests the bot must DECLINE because no
     * verified answer exists (e.g. pricing, certifications, guarantees).
     * Keep these request-shaped: a trigger that also appears in natural
     * capability questions will swallow supported scenarios.
     */
    declineTopics: z.array(z.string().min(1)),
    /**
     * Lowercase triggers for account-specific requests that must be
     * REDIRECTED to a human channel without collecting sensitive data.
     * Prefer possessive/request-shaped phrases ("my invoice", "reset my
     * password") over bare nouns for the same reason.
     */
    accountTopics: z.array(z.string().min(1)),
    /** Copy used when redirecting to a human. */
    escalationMessage: z.string().min(1),
    /** Copy used when declining an unverifiable request. */
    declineMessage: z.string().min(1),
  }),
});

export type ApprovedLink = z.infer<typeof approvedLinkSchema>;
export type KnowledgeEntry = z.infer<typeof knowledgeEntrySchema>;
export type ClientConfig = z.infer<typeof clientConfigSchema>;

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.getOwnPropertyNames(value)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
  }
  return value;
}

/**
 * Validate a client configuration and its structural invariants:
 * - every approved link on the official domain;
 * - unique entry ids and topics;
 * - keywords that survive normalization, unique across ALL entries
 *   (a shared keyword would make messages permanently ambiguous);
 * - boundary triggers that survive normalization and never equal a knowledge
 *   keyword (a shadowing trigger would swallow a supported scenario).
 * Returns a deep-frozen copy so the validated config cannot drift at runtime.
 * Throws with a descriptive message on violation.
 */
export function validateClientConfig(config: ClientConfig): ClientConfig {
  const parsed = clientConfigSchema.parse(config);
  const domain = new URL(parsed.officialDomain).hostname;
  const links = [
    parsed.contact,
    ...parsed.knowledge.flatMap((entry) => entry.approvedLinks),
  ];
  for (const link of links) {
    const host = new URL(link.url).hostname;
    if (host !== domain && !host.endsWith(`.${domain}`)) {
      throw new Error(
        `approved link ${link.url} is not on the official domain ${domain}`,
      );
    }
  }

  const seenTopics = new Set<string>();
  const seenIds = new Set<string>();
  const keywordOwners = new Map<string, string>();
  for (const entry of parsed.knowledge) {
    if (seenIds.has(entry.id)) throw new Error(`duplicate knowledge id ${entry.id}`);
    if (seenTopics.has(entry.topic)) throw new Error(`duplicate topic ${entry.topic}`);
    seenIds.add(entry.id);
    seenTopics.add(entry.topic);
    for (const keyword of entry.keywords) {
      const normalized = normalize(keyword);
      if (!normalized) {
        throw new Error(`entry ${entry.id}: keyword ${JSON.stringify(keyword)} normalizes to nothing`);
      }
      const owner = keywordOwners.get(normalized);
      if (owner && owner !== entry.id) {
        throw new Error(
          `keyword ${JSON.stringify(keyword)} is shared by ${owner} and ${entry.id}; shared keywords make routing permanently ambiguous`,
        );
      }
      keywordOwners.set(normalized, entry.id);
    }
  }

  for (const [listName, triggers] of [
    ["declineTopics", parsed.boundaries.declineTopics],
    ["accountTopics", parsed.boundaries.accountTopics],
  ] as const) {
    for (const trigger of triggers) {
      const normalized = normalize(trigger);
      if (!normalized) {
        throw new Error(`${listName}: trigger ${JSON.stringify(trigger)} normalizes to nothing`);
      }
      const owner = keywordOwners.get(normalized);
      if (owner) {
        throw new Error(
          `${listName}: trigger ${JSON.stringify(trigger)} shadows a keyword of entry ${owner}; boundaries outrank routing, so this would swallow a supported scenario`,
        );
      }
    }
  }

  return deepFreeze(parsed);
}
