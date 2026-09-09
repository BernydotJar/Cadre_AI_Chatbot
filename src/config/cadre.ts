import { validateClientConfig, type ClientConfig } from "./types";

/**
 * Cadre AI client configuration.
 *
 * Fact provenance (kept per entry in `source`):
 * - "https://cadre.ai (retrieved 2026-09-09)": verified against the official
 *   public website on that date (cadreai.com 301-redirects to cadre.ai).
 * - "Cadre AI company profile (provided 2026-09)": company-supplied profile
 *   facts for this assistant's knowledge set (e.g. the partner list) — stated
 *   by the company, not independently verified on the public site.
 * Published service/security statements are attributed company claims, not
 * independent guarantees. No pricing, certifications or private client results.
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
  publicHighlights: [
    {
      id: "high-roi-proof",
      kind: "proof",
      title: "100+ high-ROI use cases",
      body: "Cadre states that it has delivered more than 100 high-ROI use cases across more than 50 companies.",
      source: { origin: "https://cadre.ai/about", retrievedAt: "2026-09-09" },
    },
    {
      id: "drive-revenue",
      kind: "outcome",
      title: "Drive Revenue",
      body: "Cadre frames AI transformation around unlocking growth with automation and predictive insights.",
      source: { origin: "https://cadre.ai; https://cadre.ai/about", retrievedAt: "2026-09-09" },
    },
    {
      id: "increase-profitability",
      kind: "outcome",
      title: "Increase Profitability",
      body: "Cadre focuses on reducing inefficiency so AI contributes to stronger margins and enterprise value.",
      source: { origin: "https://cadre.ai; https://cadre.ai/about", retrievedAt: "2026-09-09" },
    },
    {
      id: "elevate-employees",
      kind: "outcome",
      title: "Elevate Employees",
      body: "Cadre positions AI as a way to remove tedious work and move teams toward higher-impact work.",
      source: { origin: "https://cadre.ai; https://cadre.ai/about", retrievedAt: "2026-09-09" },
    },
    {
      id: "track-ai-results",
      kind: "product",
      title: "Track your AI results",
      body: "Cadre gives you a centralized portal to track tools, agents, training, and results. Stay aligned, stay accountable, and scale what works.",
      link: { label: "Get Your AI Results", url: "https://cadre.ai/contact" },
      source: { origin: "https://cadre.ai; https://cadre.ai/departments", retrievedAt: "2026-09-09" },
    },
  ],
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
        "workflows", "train", "training", "revenue", "profitability", "ebitda",
        "roi", "high roi", "business impact",
      ],
      facts: [
        "Cadre AI is an AI strategy and implementation consultancy that helps businesses move from AI confusion to AI confidence.",
        "Cadre AI works department by department to identify high-ROI AI opportunities, build workflows and agents, and train teams so changes stick.",
        "Cadre states that it has delivered more than 100 high-ROI use cases across more than 50 companies.",
        "Core services are AI Strategy, AI Leadership & Facilitation, AI Engineering, and AI Agents.",
        "Its engineering approach considers existing tools, workflow automation, API connections, and custom agents according to the business problem.",
      ],
      approvedLinks: [
        { label: "AI Strategy", url: "https://cadre.ai/strategy" },
        { label: "AI Engineering", url: "https://cadre.ai/ai-engineering" },
        { label: "AI Agents", url: "https://cadre.ai/agents" },
        { label: "AI Leadership & Facilitation", url: "https://cadre.ai/leadership-facilitation" },
      ],
      source: { origin: "https://cadre.ai; https://cadre.ai/about (published delivery count); https://cadre.ai/ai-engineering (approach); Cadre AI company profile (provided 2026-09)", retrievedAt: "2026-09-09" },
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
        "clients", "department", "departments", "sales", "marketing",
        "customer success", "executive leadership", "finance", "operations",
        "technology", "legal", "hospitality", "hotel", "hotels", "b2b", "b2c",
      ],
      facts: [
        "Cadre AI serves B2B companies and B2C services businesses. Published industries include professional services, private equity, financial services, real estate, mortgage and lending, construction, retail and e-commerce, manufacturing and logistics, and hospitality.",
        "Cadre AI works across departments including sales, marketing, customer success, executive leadership, finance, operations, technology, and legal.",
        "Client examples are published on the case studies page.",
      ],
      approvedLinks: [
        { label: "Industries", url: "https://cadre.ai/industries" },
        { label: "Case studies", url: "https://cadre.ai/case-studies" },
        { label: "About Cadre AI", url: "https://cadre.ai/about" },
      ],
      source: { origin: "https://cadre.ai/industries (industry index); https://cadre.ai/contact (fit FAQ); https://cadre.ai/leadership-facilitation (departments)", retrievedAt: "2026-09-09" },
    },
    {
      id: "strategist-call",
      topic: "strategist-call",
      label: "booking a strategist call",
      keywords: [
        "book", "call", "meeting", "schedule", "talk to", "speak with",
        "strategist", "consultation", "demo", "get started", "appointment",
        "reach out", "contact sales", "talk to sales",
      ],
      facts: [
        "You can request a conversation with an AI strategist through the official contact page — the site's 'Talk to an AI Strategist' action goes there.",
        "This assistant cannot create bookings itself; use the contact form to submit a request. A request does not confirm an appointment or a response time.",
      ],
      approvedLinks: [
        { label: "Talk to an AI Strategist", url: "https://cadre.ai/contact" },
      ],
      source: { origin: "https://cadre.ai (strategist CTA); https://cadre.ai/contact (request form)", retrievedAt: "2026-09-09" },
    },
    {
      id: "client-portal",
      topic: "portal",
      label: "client portal access",
      keywords: [
        "portal", "log in", "log into", "login", "sign in", "sign into",
        "dashboard", "agent dashboard", "agents dashboard", "ai agents dashboard",
        "track my", "track ai results", "track results", "track ai tools", "results portal",
        "client access", "my tools", "my agent", "my ai agent", "my agents",
        "my ai agents", "my results",
      ],
      facts: [
        "Cadre describes a central portal for tools, agents, training, and results; its public results action leads to the contact page.",
        "This assistant does not have access to client portals or account systems, and no public portal address is verified in its knowledge set.",
        "Existing clients should use the access instructions from their Cadre AI team, or reach out through the contact page to be connected with the right person.",
      ],
      approvedLinks: [
        { label: "Contact Cadre AI", url: "https://cadre.ai/contact" },
      ],
      source: { origin: "https://cadre.ai/industries (Track your AI results); https://cadre.ai/contact (no public login link found in reviewed pages)", retrievedAt: "2026-09-09" },
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
        "Cadre describes a grade for each area, explanations, and guidance for improvement; scoring weights and assessment duration are not verified in this knowledge set.",
        "To get scored, use the official contact page — the site's 'Get Your AI Maturity Index' action goes there.",
        "This assistant cannot run the assessment or produce a score in chat.",
      ],
      approvedLinks: [
        { label: "Get Your AI Maturity Index", url: "https://cadre.ai/contact" },
      ],
      source: { origin: "https://cadre.ai (maturity CTA); https://cadre.ai/contact (AI Maturity Index FAQ)", retrievedAt: "2026-09-09" },
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
        "Cadre's company-provided profile names OpenAI, Anthropic (Claude), Google, Microsoft, AWS, Salesforce, Snowflake, and OpenRouter among its platforms and partners; these relationships have not all been independently verified here.",
        "Model selection is matched to each client's use case rather than tied to a single vendor.",
        "Cadre's engineering page describes measures intended to keep business data out of model training and reduce use of personal AI accounts. These are company claims, not a verified guarantee for every deployment.",
        "Cadre publishes a privacy policy for its website and services; it does not automatically describe this separately hosted chatbot. Certifications and client-specific controls are not verified here — ask the team directly.",
      ],
      approvedLinks: [
        { label: "AI Engineering", url: "https://cadre.ai/ai-engineering" },
        { label: "Cadre privacy policy", url: "https://cadre.ai/legal/privacy-policy" },
        { label: "Contact Cadre AI", url: "https://cadre.ai/contact" },
      ],
      source: { origin: "Cadre AI company profile (provided 2026-09); https://cadre.ai/ai-engineering (LLM Selection & Data Security); https://cadre.ai/legal/privacy-policy (scope and security)", retrievedAt: "2026-09-09" },
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
    pricingTopics: [
      "price", "pricing", "prices", "cost", "costs", "fee", "fees", "quote", "quotes",
      "how much", "budget", "charge", "ballpark", "hourly rate", "your rates", "rate card",
      "day rate", "discount",
    ],
    accountTopics: [
      "my account", "my invoice", "my billing", "billing question",
      "my password", "reset my password", "my contract", "my subscription",
      "cancel my", "delete my", "access my data", "export my data",
      "my project status", "status of my", "my ticket",
      "when will my agent", "when will my ai agent",
      "my agent status", "my ai agent status",
      "is my agent ready", "is my ai agent ready",
    ],
    escalationMessage:
      "I can't help with account-specific or private matters in this chat, and I won't ask you for credentials or personal details here. The Cadre AI team can help you directly.",
    declineMessage:
      "I don't have a verified answer for that in this knowledge set, so I won't turn uncertainty into a confident claim.",
    pricingMessage:
      "Cadre focuses on AI that drives revenue, profitability, and measurable business impact, but I don't have a verified price list or rate card here, so I won't make one up.",
  },
};

/** Validated at module load so a bad config fails fast, not mid-conversation. */
export const cadre: ClientConfig = validateClientConfig(cadreConfig);
