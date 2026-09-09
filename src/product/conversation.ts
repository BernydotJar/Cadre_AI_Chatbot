import type { PolicyDecision } from "@/core/policy";
import type { ChatMessage } from "@/core/validate";
import type { PersonaProfile } from "./types";

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
