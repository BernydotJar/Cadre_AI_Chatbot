import type { PolicyDecision } from "@/core/policy";
import { containsPhrase } from "@/core/text";
import type { ChatMessage } from "@/core/validate";
import type { PersonaProfile } from "./types";

const PROACTIVITY_OPTOUTS = [
  "no follow up",
  "no follow ups",
  "no followup",
  "no followups",
  "no questions",
  "do not ask",
  "don't ask",
  "just answer",
  "answer only",
] as const;

function optedOutOfProactivity(messages: readonly ChatMessage[]): boolean {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  return Boolean(lastUser && PROACTIVITY_OPTOUTS.some((phrase) => containsPhrase(lastUser.content, phrase)));
}

/**
 * Return at most one app-owned proactive question for a grounded decision.
 * Client-supplied history may suppress this optional question by replaying it;
 * suppression is safe because facts, links, routing, and boundaries do not
 * depend on persona state.
 */
export function proactiveQuestionFor(
  decision: PolicyDecision,
  messages: readonly ChatMessage[],
  persona: PersonaProfile | undefined,
): string | undefined {
  if (!persona || persona.proactive.maxSteps < 1 || decision.kind !== "grounded") return undefined;
  if (optedOutOfProactivity(messages)) return undefined;
  const step = persona.proactive.byTopic[decision.entry.topic];
  if (!step) return undefined;
  if (messages.some((message) => message.role === "assistant" && message.content.includes(step.text))) {
    return undefined;
  }
  return step.text;
}

export function appendProactiveQuestion(answer: string, question: string | undefined): string {
  return question ? `${answer}\n\n${question}` : answer;
}

/**
 * Add a short persona-owned empathy lead without letting persona configuration
 * own facts, links, routing, or safety boundaries.
 */
export function boundaryVoiceFor(
  decision: PolicyDecision,
  persona: PersonaProfile | undefined,
): string | undefined {
  const voice = persona?.boundaryVoice;
  if (!voice) return undefined;
  if (decision.kind === "decline") {
    return decision.reason === "pricing" ? voice.pricingLead : voice.declineLead;
  }
  if (decision.kind !== "redirect") return undefined;
  if (decision.reason === "account-specific") return voice.accountLead;
  if (decision.reason === "still-ambiguous") return voice.ambiguousLead;
  return voice.unknownLead;
}

export function prependBoundaryVoice(answer: string, lead: string | undefined): string {
  return lead ? `${lead} ${answer}` : answer;
}
