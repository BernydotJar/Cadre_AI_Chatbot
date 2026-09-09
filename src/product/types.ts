import { z } from "zod";
import { clientConfigSchema, validateClientConfig, type ClientConfig } from "@/config/types";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "expected a six-digit hex color");

export const proactiveQuestionSchema = z.object({
  kind: z.literal("question"),
  text: z.string().trim().min(1).max(220),
}).superRefine((step, ctx) => {
  if (/https?:\/\/|www\./i.test(step.text)) {
    ctx.addIssue({ code: "custom", message: "proactive questions cannot contain URLs" });
  }
  if (/[\r\n]/.test(step.text)) {
    ctx.addIssue({ code: "custom", message: "proactive questions must be a single line" });
  }
  const questionMarks = (step.text.match(/\?/g) ?? []).length;
  if (questionMarks !== 1 || !step.text.endsWith("?")) {
    ctx.addIssue({ code: "custom", message: "proactive guidance must be exactly one question" });
  }
  if (/[.!;]/.test(step.text.slice(0, -1))) {
    ctx.addIssue({ code: "custom", message: "proactive guidance cannot bundle statements or extra steps" });
  }
});

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
    /** One exact, deterministic question keyed by ClientConfig topic. */
    byTopic: z.record(z.string().min(1), proactiveQuestionSchema),
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
    background: hexColor,
    backgroundSoft: hexColor,
    surface: hexColor,
    text: hexColor,
    muted: hexColor,
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

export type ProactiveQuestion = z.infer<typeof proactiveQuestionSchema>;
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
