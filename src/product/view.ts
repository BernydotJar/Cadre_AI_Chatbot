import type { ApprovedLink, PublicHighlight } from "@/config/types";
import type { ChatbotProductProfile, ExperienceProfile } from "./types";

export type ChatExperienceView = Readonly<{
  productId: string;
  clientName: string;
  contact: ApprovedLink;
  approvedLinks: ApprovedLink[];
  publicHighlights: PublicHighlight[];
  topics: { id: string; label: string }[];
  experience: ExperienceProfile;
}>;

/**
 * Server-side projection for the client UI. The browser receives only the
 * presentation profile plus link/topic metadata; verified facts, provenance,
 * persona operating rules, and routing triggers remain server-side.
 */
export function chatExperience(profile: ChatbotProductProfile): ChatExperienceView {
  const approvedLinks = [...new Map([
    profile.client.contact,
    ...profile.client.knowledge.flatMap((entry) => entry.approvedLinks),
  ].map((link) => [link.url, link])).values()];

  return Object.freeze({
    productId: profile.id,
    clientName: profile.client.clientName,
    contact: profile.client.contact,
    approvedLinks,
    publicHighlights: profile.client.publicHighlights ?? [],
    topics: profile.client.knowledge.map((entry) => ({ id: entry.id, label: entry.label })),
    experience: profile.experience,
  });
}
