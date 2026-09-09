import { validateClientConfig, type ClientConfig } from "../types";

/**
 * TEST FIXTURE ONLY — a fictional second client used to exercise the reuse
 * hypothesis: the chat core must produce grounded behavior for a different
 * client purely through configuration. Demonstrates core/config separation at
 * unit level; it does not prove production multi-client reuse.
 */
const acmeConfig: ClientConfig = {
  clientName: "Acme Outdoors",
  botName: "Acme Outdoors Helper",
  tagline: "Ask about Acme Outdoors gear guides and store services.",
  officialDomain: "https://acme-outdoors.example",
  contact: { label: "Contact Acme Outdoors", url: "https://acme-outdoors.example/contact" },
  knowledge: [
    {
      id: "store-services",
      topic: "services",
      label: "store services",
      keywords: ["repair", "rental", "fitting", "services", "what do you offer"],
      facts: [
        "Acme Outdoors offers gear repair, equipment rental, and boot fitting in every store.",
      ],
      approvedLinks: [
        { label: "Store services", url: "https://acme-outdoors.example/services" },
      ],
      source: { origin: "fixture", retrievedAt: "2026-09-08" },
    },
    {
      id: "returns",
      topic: "returns",
      label: "returns and exchanges",
      keywords: ["return", "returns", "exchange", "refund policy window"],
      facts: ["Acme Outdoors accepts returns within 60 days with a receipt."],
      approvedLinks: [
        { label: "Returns", url: "https://acme-outdoors.example/returns" },
      ],
      source: { origin: "fixture", retrievedAt: "2026-09-08" },
    },
  ],
  boundaries: {
    declineTopics: ["price match", "discount code"],
    accountTopics: ["my order", "order status", "my account"],
    escalationMessage:
      "I can't look up personal orders here, and I won't ask for account details in chat.",
    declineMessage: "I don't have verified information to answer that.",
  },
};

export const acme: ClientConfig = validateClientConfig(acmeConfig);
