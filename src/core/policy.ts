import type { ApprovedLink, ClientConfig, KnowledgeEntry } from "@/config/types";
import type { ChatMessage } from "./validate";
import { matchesTriggers, routeMessage } from "./route";

/**
 * Response policy: decides HOW the assistant answers — grounded from the
 * knowledge set, a clarifying question (at most once per thread), an honest
 * redirect to a human, or a decline when no verified answer exists.
 * Pure functions; no network, no provider. The composed grounded content is
 * what a live model may rephrase (never extend) in a later increment.
 */

export type PolicyDecision =
  | { kind: "grounded"; entry: KnowledgeEntry }
  | { kind: "clarify"; candidates: KnowledgeEntry[] }
  | { kind: "redirect"; reason: "account-specific" | "unknown" | "still-ambiguous" }
  | { kind: "decline" };

/** Marker embedded in clarify replies so a stateless server can detect that a clarification was already asked. */
export const CLARIFY_MARKER = "Could you tell me a bit more about what you need?";

/**
 * TRUST ASSUMPTION: history arrives from the client, so this marker scan is
 * forgeable in both directions (forge the marker to skip clarification, or
 * omit history to clarify repeatedly). Both outcomes are safe reply shapes —
 * clarify carries no facts/links and redirect carries only the contact link —
 * so no fact, link, or credential path depends on this. If a live model ever
 * rephrases replies, clarify state must move server-side instead.
 */
function alreadyClarified(messages: readonly ChatMessage[]): boolean {
  return messages.some(
    (message) => message.role === "assistant" && message.content.includes(CLARIFY_MARKER),
  );
}

export function decide(messages: readonly ChatMessage[], config: ClientConfig): PolicyDecision {
  const last = messages[messages.length - 1];
  const text = last?.content ?? "";

  // Boundary triggers outrank topic routing: an account-specific or
  // unverifiable request must not be answered "helpfully" by a nearby topic.
  if (matchesTriggers(text, config.boundaries.accountTopics)) {
    return { kind: "redirect", reason: "account-specific" };
  }
  if (matchesTriggers(text, config.boundaries.declineTopics)) {
    return { kind: "decline" };
  }

  const routed = routeMessage(text, config);
  if (routed.kind === "match") return { kind: "grounded", entry: routed.entry };
  if (routed.kind === "ambiguous") {
    return alreadyClarified(messages)
      ? { kind: "redirect", reason: "still-ambiguous" }
      : { kind: "clarify", candidates: routed.candidates };
  }
  return { kind: "redirect", reason: "unknown" };
}

export type ComposedReply = {
  text: string;
  /** Links are app-controlled: only approved links ever leave the policy. */
  links: ApprovedLink[];
  kind: "grounded" | "clarify" | "redirect" | "decline";
};

/** Deterministic phrasing of a decision, used by the mock provider verbatim. */
export function composeReply(decision: PolicyDecision, config: ClientConfig): ComposedReply {
  switch (decision.kind) {
    case "grounded": {
      const { entry } = decision;
      return {
        kind: "grounded",
        text: entry.facts.join(" "),
        links: entry.approvedLinks,
      };
    }
    case "clarify": {
      const topics = decision.candidates.map((candidate) => candidate.label).join(", ");
      return {
        kind: "clarify",
        text: `${CLARIFY_MARKER} I can help with a few related areas here (${topics}) — which one fits best?`,
        links: [],
      };
    }
    case "decline": {
      return {
        kind: "decline",
        text: `${config.boundaries.declineMessage} You can reach the ${config.clientName} team through the link below.`,
        links: [config.contact],
      };
    }
    case "redirect": {
      const intro =
        decision.reason === "account-specific"
          ? config.boundaries.escalationMessage
          : decision.reason === "still-ambiguous"
            ? "I still can't pin down what you need, so rather than guess, let me hand you to a person."
            : "That's outside what I can answer from verified information.";
      return {
        kind: "redirect",
        text: `${intro} You can reach the ${config.clientName} team through the link below.`,
        links: [config.contact],
      };
    }
  }
}

/** Convenience: full policy pass from validated messages to a composed reply. */
export function respond(messages: readonly ChatMessage[], config: ClientConfig): ComposedReply {
  return composeReply(decide(messages, config), config);
}
