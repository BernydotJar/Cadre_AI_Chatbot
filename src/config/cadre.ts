import { validateClientConfig, type ClientConfig } from "./types";

/**
 * Cadre AI client configuration.
 *
 * Fact provenance (kept per entry in `source`):
 * - "https://cadre.ai (retrieved 2026-09-08)": verified against the official
 *   public website on that date (cadreai.com 301-redirects to cadre.ai).
 * - "Cadre AI company profile (provided 2026-09)": company-supplied profile
 *   facts for this assistant's knowledge set (e.g. the partner list) — stated
 *   by the company, not independently verified on the public site.
 * No pricing, certifications, client results, or security guarantees are in
 * this set, so the assistant must decline or redirect those requests.
 *
 * Trigger design rule (learned in review): boundary triggers outrank routing,
 * so they must be request-shaped ("my invoice", "reset my password"), never
 * bare nouns that appear in capability questions ("invoice", "reset").
 */
const cadreConfig: ClientConfig = {
  clientName: "Cadre AI",
  botName: "Cadre AI Assistant",
  tagline: "Ask about Cadre AI's services, booking a strategy call, or the AI Maturity Index.",
  officialDomain: "https://cadre.ai",
  contact: { label: "Contact Cadre AI", url: "https://cadre.ai/contact" },
  knowledge: [
    {
      id: "company-overview",
      topic: "overview",
      label: "what Cadre AI does",
      keywords: [
        "what does cadre", "what is cadre", "about cadre", "who are you",
        "what do you do", "company", "consultancy", "services", "service",
        "offer", "offering", "help my business", "what can cadre",
        "agents", "agent", "ai agents", "engineering", "ai engineering",
        "strategy", "ai strategy", "automate", "automation", "workflow",
        "workflows", "train", "training",
      ],
      facts: [
        "Cadre AI is an AI strategy and implementation consultancy that helps businesses move from AI confusion to AI confidence.",
        "Cadre AI works department by department to identify high-ROI AI opportunities, build workflows and agents, and train teams so changes stick.",
        "Core services are AI Strategy, AI Leadership & Facilitation, AI Engineering, and AI Agents.",
      ],
      approvedLinks: [
        { label: "AI Strategy", url: "https://cadre.ai/strategy" },
        { label: "AI Engineering", url: "https://cadre.ai/ai-engineering" },
        { label: "AI Agents", url: "https://cadre.ai/agents" },
        { label: "AI Leadership & Facilitation", url: "https://cadre.ai/leadership-facilitation" },
      ],
      source: { origin: "https://cadre.ai and Cadre AI company profile (provided 2026-09)", retrievedAt: "2026-09-08" },
    },
    {
      id: "industries-served",
      topic: "industries",
      label: "industries we serve",
      keywords: [
        "industry", "industries", "sector", "work with", "private equity",
        "real estate", "financial services", "professional services",
        "construction", "manufacturing", "retail", "logistics", "mortgage",
        "lending", "e-commerce", "fit for", "case studies", "case study",
        "clients",
      ],
      facts: [
        "Cadre AI serves B2B companies across professional services, private equity, financial services, real estate, mortgage and lending, construction, retail and e-commerce, and manufacturing and logistics.",
        "Cadre AI works across departments including sales, marketing, customer success, executive leadership, finance, operations, technology, and legal.",
        "Client examples are published on the case studies page.",
      ],
      approvedLinks: [
        { label: "Case studies", url: "https://cadre.ai/case-studies" },
        { label: "About Cadre AI", url: "https://cadre.ai/about" },
      ],
      source: { origin: "https://cadre.ai", retrievedAt: "2026-09-08" },
    },
    {
      id: "strategist-call",
      topic: "strategist-call",
      label: "booking a strategist call",
      keywords: [
        "book", "call", "meeting", "schedule", "talk to", "speak with",
        "strategist", "consultation", "demo", "get started", "appointment",
        "reach out", "sales",
      ],
      facts: [
        "You can request a conversation with an AI strategist through the official contact page — the site's 'Talk to an AI Strategist' action goes there.",
        "This assistant cannot create bookings itself; the Cadre AI team follows up after you submit the contact form.",
      ],
      approvedLinks: [
        { label: "Talk to an AI Strategist", url: "https://cadre.ai/contact" },
      ],
      source: { origin: "https://cadre.ai", retrievedAt: "2026-09-08" },
    },
    {
      id: "client-portal",
      topic: "portal",
      label: "client portal access",
      keywords: [
        "portal", "log in", "login", "sign in", "dashboard", "track my",
        "client access", "my tools", "my agents", "my results",
      ],
      facts: [
        "This assistant does not have access to client portals or account systems, and no public portal address is verified in its knowledge set.",
        "Existing clients should use the access instructions from their Cadre AI team, or reach out through the contact page to be connected with the right person.",
      ],
      approvedLinks: [
        { label: "Contact Cadre AI", url: "https://cadre.ai/contact" },
      ],
      source: { origin: "https://cadre.ai (no public portal link found)", retrievedAt: "2026-09-08" },
    },
    {
      id: "maturity-index",
      topic: "maturity-index",
      label: "the AI Maturity Index",
      keywords: [
        "maturity", "index", "assessment", "score", "scored", "benchmark",
        "readiness", "evaluate my company", "how ready",
      ],
      facts: [
        "The AI Maturity Index is Cadre AI's assessment that scores a company across its eight-pillar framework.",
        "To get scored, use the official contact page — the site's 'Get Your AI Maturity Index' action goes there.",
        "This assistant cannot run the assessment or produce a score in chat.",
      ],
      approvedLinks: [
        { label: "Get Your AI Maturity Index", url: "https://cadre.ai/contact" },
      ],
      source: { origin: "https://cadre.ai", retrievedAt: "2026-09-08" },
    },
    {
      id: "models-and-security",
      topic: "models-security",
      label: "models and data security",
      keywords: [
        "model", "models", "llm", "openai", "anthropic", "claude", "gpt",
        "gemini", "which ai", "data security", "secure", "privacy",
        "data protection", "data privacy", "my data", "protect",
        "openrouter", "snowflake", "salesforce", "aws",
      ],
      facts: [
        "Cadre AI works across major AI platforms: its partners include OpenAI, Anthropic (Claude), Google, Microsoft, AWS, Salesforce, and Snowflake, plus OpenRouter for model access.",
        "Model selection is matched to each client's use case rather than tied to a single vendor.",
        "Specific security practices, certifications, and data-handling policies are not published in this assistant's knowledge set — for those details, ask the team directly.",
      ],
      approvedLinks: [
        { label: "AI Engineering", url: "https://cadre.ai/ai-engineering" },
        { label: "Contact Cadre AI", url: "https://cadre.ai/contact" },
      ],
      source: { origin: "Cadre AI company profile (provided 2026-09); services pages on https://cadre.ai", retrievedAt: "2026-09-08" },
    },
  ],
  boundaries: {
    declineTopics: [
      "price", "pricing", "prices", "cost", "costs", "fee", "fees",
      "quote", "quotes", "how much", "budget", "charge", "ballpark",
      "hourly rate", "your rates", "rate card", "day rate",
      "guarantee", "guaranteed", "certified", "certification",
      "certifications", "soc 2", "soc2", "iso 27001", "iso27001", "hipaa",
      "gdpr", "refund", "discount",
    ],
    accountTopics: [
      "my account", "my invoice", "my billing", "billing question",
      "my password", "reset my password", "my contract", "my subscription",
      "cancel my", "delete my", "access my data", "export my data",
      "my project status", "status of my", "my ticket",
    ],
    escalationMessage:
      "I can't help with account-specific or private matters in this chat, and I won't ask you for credentials or personal details here. The Cadre AI team can help you directly.",
    declineMessage:
      "I don't have verified information to answer that — I'd rather connect you with the team than guess.",
  },
};

/** Validated at module load so a bad config fails fast, not mid-conversation. */
export const cadre: ClientConfig = validateClientConfig(cadreConfig);
