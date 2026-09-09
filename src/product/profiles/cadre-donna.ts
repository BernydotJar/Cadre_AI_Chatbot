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
      "Acknowledge the business intent behind a question before handing off, without manufactured urgency.",
      "Never manufacture promises, pricing, security claims, capabilities, or private context.",
      "If there is no approved useful next step, stop after the answer.",
    ],
    boundaryVoice: {
      pricingLead: "Fair question — the economics matter.",
      declineLead: "Good question — precision beats a confident guess.",
      unknownLead: "Good question — I'd rather be useful than pretend.",
      accountLead: "Privacy first — we can get you to the right person without asking for sensitive details here.",
      ambiguousLead: "I'm close, but not close enough to guess.",
    },
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
    avatar: { style: "signal-orb", monogram: "D", label: "Donna signal avatar" },
    quickPrompts: [
      { label: "Find a high-ROI starting point", message: "Where could Cadre AI help my business drive revenue or reduce repetitive work?" },
      { label: "Show me AI agents for my team", message: "What kinds of AI agents does Cadre build for different teams?" },
      { label: "Track AI results", message: "How does Cadre help clients track AI tools, agents, training, and results?" },
      { label: "Check AI readiness", message: "How does the AI Maturity Index work?" },
    ],
    ambientMedia: {
      posterSrc: "/media/donna-ambient-poster.webp",
      videoSrc: "/media/donna-ambient-loop.mp4",
      durationSeconds: 8,
    },
    copy: {
      eyebrow: "VERIFIED CADRE CONTEXT",
      heroLead: "From AI curiosity",
      heroEmphasis: "to a clear next move.",
      heroDescription:
        "Explore where AI can drive revenue, improve profitability, and remove repetitive work — with a grounded guide that knows when to hand off instead of guessing.",
      contactCta: "Talk to an AI Strategist",
      outcomesEyebrow: "AI STRATEGY & IMPLEMENTATION",
      outcomesTitle: "AI that earns its place in the business.",
      outcomesBody: "Start with the business move, then find the right AI path — grounded in Cadre's verified public positioning and outcomes.",
      resultsEyebrow: "MEASURE WHAT WORKS",
      trustEyebrow: "HOW DONNA WORKS",
      trustTitle: "Useful by design. Bounded on purpose.",
      trustBody: "The experience separates what Cadre says from how Donna says it, then keeps actions and handoffs explicit.",
      nudgeKicker: "HEY — QUICK THOUGHT",
      launcherHint: "Try a question. I'll keep it grounded.",
      signalLabel: "DONNA · CADRE SIGNAL",
      signalTitle: "Curated, bounded, ready to guide.",
      signalBody:
        "Verified Cadre knowledge stays separate from conversational style, so Donna can be useful without inventing the next step.",
      trustLabel: "A TRUSTED STARTING POINT",
      trustBody:
        "Ask in your own words. When the answer needs private context, pricing, or an account action, Donna hands off instead of guessing.",
      trustBoundary: "No account access, bookings, or assessments in chat.",
      welcomeKicker: "DONNA · GROUNDED PUBLIC KNOWLEDGE",
      welcomeLead: "What are you trying",
      welcomeEmphasis: "to move forward?",
      welcomeBody:
        "Ask in your own words, try a high-value prompt, or browse the verified Cadre topics.",
      composerPlaceholder: "What are you trying to figure out?",
      workingTitle: "Shaping…",
      workingBody: "Grounding the answer in verified Cadre context.",
      chatScope: "Public information only. No account access, bookings, or assessments in chat.",
      privacyNote:
        "Don't share private details. In live mode, messages go to an external model service. This page keeps no chat history after a refresh.",
      footerLead: "Clarity starts with a conversation.",
      footerTail: "AI guide",
    },
    theme: { background: "#f5f1e8", backgroundSoft: "#fbfaf6", surface: "#fffdf9", text: "#1d1d20", muted: "#66645f", accent: "#db4545", accentStrong: "#a82f39", focus: "#225d51" },
  },
};

export const cadreDonna = validateProductProfile(cadreDonnaProfile);
