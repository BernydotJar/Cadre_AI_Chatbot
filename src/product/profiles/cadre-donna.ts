import { cadre } from "@/config/cadre";
import { validateProductProfile, type ChatbotProductProfile } from "../types";

/**
 * Cadre's first productized assistant profile.
 *
 * Donna is intentionally an original project-owned persona. Her value is not
 * theatrical imitation: she answers from verified Cadre context and, only
 * when useful, asks one configured question that reduces the user's next
 * decision. The questions below are application-owned copy, not model output.
 */
const cadreDonnaProfile: ChatbotProductProfile = {
  id: "cadre-donna",
  client: cadre,
  persona: {
    id: "donna",
    name: "Donna",
    language: "en",
    description:
      "A calm, perceptive Cadre AI guide who answers first and moves the conversation one useful step forward.",
    traits: ["concise", "perceptive", "calm", "confident", "lightly witty"],
    operatingPrinciples: [
      "Answer the user's actual question before doing anything else.",
      "Use verified client knowledge as the only factual authority.",
      "When it helps, reduce the next decision with one sharp question.",
      "Never manufacture urgency, promises, pricing, security claims, or capabilities.",
      "If there is no approved useful next step, stop after the answer.",
    ],
    proactive: {
      maxSteps: 1,
      byTopic: {
        overview: {
          kind: "question",
          text: "Which part of the business is creating the most repetitive work today?",
        },
        industries: {
          kind: "question",
          text: "Which team or workflow would you most want to improve first?",
        },
        "maturity-index": {
          kind: "question",
          text: "Which area of your AI readiness feels least clear today?",
        },
        "models-security": {
          kind: "question",
          text: "Is your main concern model fit, data handling, or integration with existing systems?",
        },
      },
    },
  },
  // P3 consumes this experience contract in the generic web shell. Keeping it
  // here now makes P2 a complete deployable product profile without changing
  // presentation before the dedicated UI node.
  experience: {
    id: "cadre-donna-web",
    assistantLabel: "Donna",
    avatar: { style: "orbital-monogram", monogram: "D", label: "Donna AI guide avatar" },
    copy: {
      eyebrow: "GUIDED BY VERIFIED CADRE CONTEXT",
      heroLead: "Turn AI curiosity",
      heroEmphasis: "into a clear next move.",
      heroDescription:
        "Explore Cadre AI's services, industries, AI agents, and transformation approach with a grounded guide built for the first useful conversation.",
      signalLabel: "DONNA · CADRE SIGNAL",
      signalTitle: "Curated, bounded, ready to guide.",
      signalBody:
        "Verified Cadre knowledge stays separate from conversational style, so Donna can be useful without inventing the next step.",
      trustLabel: "A TRUSTED STARTING POINT",
      trustBody:
        "Ask in your own words. When the answer needs private context, pricing, or an account action, Donna hands off instead of guessing.",
      trustBoundary: "No account access, bookings, or assessments in chat.",
      welcomeKicker: "DONNA · GROUNDED PUBLIC KNOWLEDGE",
      welcomeLead: "A useful answer.",
      welcomeEmphasis: "One clearer next step.",
      welcomeBody:
        "Start with what you're trying to solve, or choose one of the verified paths below.",
      composerPlaceholder: "What are you trying to figure out?",
      workingTitle: "Donna is working",
      workingBody: "Checking verified context…",
      chatScope: "Public information only. No account access, bookings, or assessments in chat.",
      privacyNote:
        "Don't share private details. In live mode, messages go to an external model service. This page keeps no chat history after a refresh.",
      footerLead: "Clarity starts with a conversation.",
      footerTail: "AI guide",
    },
    theme: { accent: "#db4545", accentStrong: "#a82f39", focus: "#225d51" },
  },
};

export const cadreDonna = validateProductProfile(cadreDonnaProfile);
