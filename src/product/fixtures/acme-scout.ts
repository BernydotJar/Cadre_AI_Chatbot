import { acme } from "@/config/fixtures/acme";
import { validateProductProfile, type ChatbotProductProfile } from "../types";

/** TEST/architecture proof only — never registered in the production registry. */
const acmeScoutProfile: ChatbotProductProfile = {
  id: "acme-scout",
  client: acme,
  persona: {
    id: "scout",
    name: "Scout",
    language: "en",
    description: "A practical outdoor-store guide that keeps the next choice simple.",
    traits: ["practical", "friendly", "concise"],
    operatingPrinciples: [
      "Answer from verified store knowledge.",
      "Ask at most one useful question.",
      "Never claim order access.",
    ],
    proactive: {
      maxSteps: 1,
      byTopic: {
        services: { kind: "question", text: "Which store service would help you most right now?" },
        returns: { kind: "question", text: "Would you like to narrow this to a return or an exchange?" },
      },
    },
  },
  experience: {
    id: "acme-scout-web",
    assistantLabel: "Scout",
    avatar: { style: "orbital-monogram", monogram: "S", label: "Scout AI guide avatar" },
    copy: {
      eyebrow: "GUIDED BY VERIFIED STORE CONTEXT",
      heroLead: "Find what you need",
      heroEmphasis: "without the trail of tabs.",
      heroDescription: "Ask about Acme Outdoors store services and return guidance.",
      signalLabel: "SCOUT · STORE GUIDE",
      signalTitle: "Practical, verified, ready to help.",
      signalBody: "Store knowledge stays separate from conversational style.",
      trustLabel: "A USEFUL STARTING POINT",
      trustBody: "Ask in your own words and Scout will keep the answer grounded.",
      trustBoundary: "No order or account lookup in chat.",
      welcomeKicker: "SCOUT · VERIFIED STORE KNOWLEDGE",
      welcomeLead: "Tell me what you need.",
      welcomeEmphasis: "We'll narrow it down.",
      welcomeBody: "Start with a question or choose a store topic below.",
      composerPlaceholder: "What are you trying to find out?",
      workingTitle: "Scout is checking",
      workingBody: "Looking through verified store context…",
      chatScope: "Public store information only.",
      privacyNote: "Don't share order numbers or private account details in this demo.",
      footerLead: "A simpler way to find the next answer.",
      footerTail: "Store guide",
    },
    theme: { background: "#f2f4ef", backgroundSoft: "#fafbf8", surface: "#ffffff", text: "#1d2720", muted: "#647067", accent: "#537b5d", accentStrong: "#355b40", focus: "#245e3a" },
  },
};

export const acmeScout = validateProductProfile(acmeScoutProfile);
