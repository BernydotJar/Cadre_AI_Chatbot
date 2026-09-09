import { z } from "zod";
import { clientConfigSchema, validateClientConfig, type ClientConfig } from "@/config/types";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "expected a six-digit hex color");

/**
 * Conversational behavior only. A persona never owns facts, URLs, provider
 * credentials, routing, or safety boundaries. `proactive.byTopic` contains
 * app-owned copy that may be appended after a grounded answer.
 */
export const personaProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  language: z.string().min(1),
  description: z.string().min(1),
  traits: z.array(z.string().min(1)).min(1),
  operatingPrinciples: z.array(z.string().min(1)).min(1),
  proactive: z.object({
    /** Product invariant: no persona may move more than one step ahead. */
    maxSteps: z.number().int().min(0).max(1),
    /** Exact, deterministic next-step copy keyed by ClientConfig topic. */
    byTopic: z.record(z.string().min(1), z.string().min(1)),
  }),
});

/**
 * Presentation copy and safe theme tokens. The reusable shell consumes this
 * contract instead of branching on a client or persona name.
 */
export const experienceProfileSchema = z.object({
  id: z.string().min(1),
  assistantLabel: z.string().min(1),
  avatar: z.object({
    style: z.literal("orbital-monogram"),
    monogram: z.string().min(1).max(3),
    label: z.string().min(1),
  }),
  copy: z.object({
    eyebrow: z.string().min(1),
    heroLead: z.string().min(1),
    heroEmphasis: z.string().min(1),
    heroDescription: z.string().min(1),
    signalLabel: z.string().min(1),
    signalTitle: z.string().min(1),
    signalBody: z.string().min(1),
    trustLabel: z.string().min(1),
    trustBody: z.string().min(1),
    trustBoundary: z.string().min(1),
    welcomeKicker: z.string().min(1),
    welcomeLead: z.string().min(1),
    welcomeEmphasis: z.string().min(1),
    welcomeBody: z.string().min(1),
    composerPlaceholder: z.string().min(1),
    workingTitle: z.string().min(1),
    workingBody: z.string().min(1),
    chatScope: z.string().min(1),
    privacyNote: z.string().min(1),
    footerLead: z.string().min(1),
    footerTail: z.string().min(1),
  }),
  theme: z.object({
    accent: hexColor,
    accentStrong: hexColor,
    focus: hexColor,
  }),
});

export const chatbotProductProfileSchema = z.object({
  id: z.string().min(1),
  client: clientConfigSchema,
  persona: personaProfileSchema,
  experience: experienceProfileSchema,
});

export type PersonaProfile = z.infer<typeof personaProfileSchema>;
export type ExperienceProfile = z.infer<typeof experienceProfileSchema>;
export type ChatbotProductProfile = z.infer<typeof chatbotProductProfileSchema>;

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
 * Validate the composition boundary in addition to each nested schema.
 * Persona next-step keys must be real configured topics, so a persona cannot
 * introduce an unreviewed routing surface or attach advice to an unknown area.
 */
export function validateProductProfile(profile: ChatbotProductProfile): ChatbotProductProfile {
  const parsed = chatbotProductProfileSchema.parse(profile);
  const client: ClientConfig = validateClientConfig(parsed.client);
  const topics = new Set(client.knowledge.map((entry) => entry.topic));

  for (const topic of Object.keys(parsed.persona.proactive.byTopic)) {
    if (!topics.has(topic)) {
      throw new Error(
        `persona ${parsed.persona.id}: proactive topic ${JSON.stringify(topic)} is not present in client knowledge`,
      );
    }
  }

  return deepFreeze({ ...parsed, client });
}
