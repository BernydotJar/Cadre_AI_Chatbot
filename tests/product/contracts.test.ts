import { describe, expect, it } from "vitest";
import { acme } from "@/config/fixtures/acme";
import { createProductRegistry, resolveProductProfile } from "@/product/registry";
import {
  validateProductProfile,
  type ChatbotProductProfile,
  type ExperienceProfile,
  type PersonaProfile,
} from "@/product/types";

const persona: PersonaProfile = {
  id: "guide",
  name: "Guide",
  language: "en",
  description: "A concise test persona.",
  traits: ["clear", "calm"],
  operatingPrinciples: ["Answer first.", "Move at most one step forward."],
  proactive: {
    maxSteps: 1,
    byTopic: { services: { kind: "question", text: "Which service would be most useful to unpack next?" } },
  },
};

const experience: ExperienceProfile = {
  id: "acme-web",
  assistantLabel: "Guide",
  avatar: { style: "editorial-monogram", monogram: "A", label: "Acme Guide monogram" },
  quickPrompts: [
    { label: "Ask about services", message: "What services do you offer?" },
    { label: "Plan a return", message: "How do returns work?" },
    { label: "Ask about fitting", message: "Do you offer boot fitting?" },
  ],
  copy: {
    eyebrow: "GUIDED BY VERIFIED ACME CONTEXT",
    heroLead: "Find the right gear",
    heroEmphasis: "without the guesswork.",
    heroDescription: "Ask about store services and returns.",
    contactCta: "Contact Acme",
    outcomesEyebrow: "OUTCOMES",
    outcomesTitle: "A reusable outcome section.",
    outcomesBody: "Fixture-specific presentation copy.",
    resultsEyebrow: "RESULTS",
    trustEyebrow: "HOW IT WORKS",
    trustTitle: "A reusable trust section.",
    trustBody: "Fixture-specific trust copy.",
    nudgeKicker: "QUICK NOTE",
    launcherHint: "Ask a question.",
    signalLabel: "ACME GUIDE",
    signalTitle: "Useful, bounded guidance.",
    signalBody: "Verified store knowledge stays separate from conversational style.",
    trustLabel: "A TRUSTED STARTING POINT",
    trustBody: "Ask in your own words.",
    trustBoundary: "No order lookup in chat.",
    welcomeKicker: "ACME · VERIFIED PUBLIC KNOWLEDGE",
    welcomeLead: "A useful answer.",
    welcomeEmphasis: "One clear next step.",
    welcomeBody: "Start with a question or choose a verified path.",
    composerPlaceholder: "What are you trying to figure out?",
    workingTitle: "Acme Guide is working",
    workingBody: "Checking verified context…",
    chatScope: "Public information only.",
    privacyNote: "Don't share private details.",
    footerLead: "Clarity starts with a question.",
    footerTail: "Support guide",
  },
  theme: { background: "#f5f1e8", backgroundSoft: "#fbfaf6", surface: "#fffdf9", text: "#1d1d20", muted: "#66645f", accent: "#db4545", accentStrong: "#a82f39", focus: "#225d51" },
};

function fixture(overrides: Partial<ChatbotProductProfile> = {}): ChatbotProductProfile {
  return {
    id: "acme-guide",
    client: structuredClone(acme),
    persona: structuredClone(persona),
    experience: structuredClone(experience),
    ...overrides,
  };
}

describe("product profile contracts", () => {
  it("validates and deep-freezes a composed product", () => {
    const product = validateProductProfile(fixture());
    expect(product.client.clientName).toBe("Acme Outdoors");
    expect(product.persona.proactive.maxSteps).toBe(1);
    expect(Object.isFrozen(product)).toBe(true);
    expect(Object.isFrozen(product.persona.proactive.byTopic)).toBe(true);
    expect(Object.isFrozen(product.experience.copy)).toBe(true);
  });

  it("rejects a persona that tries to move more than one step ahead", () => {
    const bad = fixture();
    // Exercise runtime validation against an untrusted configuration shape.
    (bad.persona.proactive as { maxSteps: number }).maxSteps = 2;
    expect(() => validateProductProfile(bad)).toThrow();
  });

  it("rejects URLs in persona boundary tone and first-turn prompts", () => {
    const badTone = fixture();
    badTone.persona.boundaryVoice = {
      pricingLead: "See https://example.com",
      declineLead: "No guess.",
      unknownLead: "Not sure.",
      accountLead: "Privacy first.",
      ambiguousLead: "Need one detail.",
    };
    expect(() => validateProductProfile(badTone)).toThrow(/boundary voice cannot contain URLs/);

    const badPrompt = fixture();
    badPrompt.experience.quickPrompts[0]!.message = "Open https://example.com";
    expect(() => validateProductProfile(badPrompt)).toThrow(/quick prompts cannot contain URLs/);
  });

  it("rejects proactive guidance for a topic the client does not own", () => {
    const bad = fixture();
    bad.persona.proactive.byTopic["pricing"] = { kind: "question", text: "Would pricing be useful to discuss next?" };
    expect(() => validateProductProfile(bad)).toThrow(/not present in client knowledge/);
  });

  it("rejects invalid theme tokens rather than injecting arbitrary CSS", () => {
    const bad = fixture();
    bad.experience.theme.accent = "red; background:url(https://evil.example)";
    expect(() => validateProductProfile(bad)).toThrow(/hex color/);
  });

  it("keeps ambient media local, bounded, and optional", () => {
    const valid = fixture();
    valid.experience.ambientMedia = {
      posterSrc: "/media/ambient.webp",
      videoSrc: "/media/ambient.mp4",
      durationSeconds: 8,
    };
    expect(validateProductProfile(valid).experience.ambientMedia?.durationSeconds).toBe(8);

    const remote = fixture();
    remote.experience.ambientMedia = {
      posterSrc: "https://cdn.example/poster.webp",
      videoSrc: "/media/ambient.mp4",
      durationSeconds: 8,
    };
    expect(() => validateProductProfile(remote)).toThrow(/local \/media image asset/);

    const tooLong = fixture();
    tooLong.experience.ambientMedia = {
      posterSrc: "/media/ambient.webp",
      videoSrc: "/media/ambient.mp4",
      durationSeconds: 12,
    };
    expect(() => validateProductProfile(tooLong)).toThrow();
  });

  it("rejects presentation identity that drifts from the persona name", () => {
    const bad = fixture();
    bad.experience.assistantLabel = "Someone Else";
    expect(() => validateProductProfile(bad)).toThrow(/must match persona name/);
  });

  it("rejects a proactive question that smuggles a URL or extra instruction", () => {
    const withUrl = fixture();
    withUrl.persona.proactive.byTopic.services = {
      kind: "question",
      text: "Would you visit https://evil.example next?",
    };
    expect(() => validateProductProfile(withUrl)).toThrow(/cannot contain URLs/);

    const bundled = fixture();
    bundled.persona.proactive.byTopic.services = {
      kind: "question",
      text: "Do this first. What should we unpack next?",
    };
    expect(() => validateProductProfile(bundled)).toThrow(/cannot bundle statements/);
  });
});

describe("allowlisted product registry", () => {
  it("resolves only explicitly registered profiles and fails unknown IDs to the default", () => {
    const primary = validateProductProfile(fixture());
    const alternate = validateProductProfile(fixture({ id: "acme-guide-alt" }));
    const registry = createProductRegistry([primary, alternate]);

    expect(registry.ids).toEqual(["acme-guide", "acme-guide-alt"]);
    expect(resolveProductProfile(registry, "acme-guide-alt", "acme-guide").id).toBe("acme-guide-alt");
    expect(resolveProductProfile(registry, "../../secrets", "acme-guide").id).toBe("acme-guide");
    expect(resolveProductProfile(registry, "", "acme-guide").id).toBe("acme-guide");
  });

  it("rejects duplicate IDs", () => {
    expect(() => createProductRegistry([fixture(), fixture()])).toThrow(/duplicate product profile id/);
  });
});
