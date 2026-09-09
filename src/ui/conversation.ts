import { LIMITS } from "@/core/limits";

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  kind?: "greeting" | "grounded" | "redirect" | "clarify" | "decline";
};
export type RequestMessage = Pick<Message, "role" | "content">;
export type ApprovedLink = { label: string; url: string };
export type Reply = { reply: string; kind: NonNullable<Message["kind"]> };
export const DISPLAY_MESSAGE_LIMIT = 40;
export const CLIENT_TIMEOUT_MS = LIMITS.requestTimeoutMs + 5_000;

/** Display full replies, shorten only outbound history. Keep the original
 * clarification pair to retain the one-clarification rule, plus recent turns
 * including the immediately preceding exchange for ordinal selections. */
export function buildRequestHistory(
  messages: readonly Message[], firstClarification: readonly Message[] = [],
): RequestMessage[] {
  const recent = messages.slice(-LIMITS.maxMessages);
  const missingContext = firstClarification.some(
    (message) => !recent.some((item) => item.id === message.id),
  );
  const bounded = missingContext
    ? [...firstClarification, ...messages.filter(
      (message) => !firstClarification.some((item) => item.id === message.id),
    ).slice(-(LIMITS.maxMessages - firstClarification.length))]
    : recent;
  return bounded.map(({ role, content }) => ({ role, content: content.slice(0, LIMITS.maxMessageChars) }));
}

export function readReply(value: unknown): Reply | undefined {
  if (!value || typeof value !== "object") return undefined;
  const result = value as Record<string, unknown>;
  if (typeof result.reply !== "string" || !result.reply.trim()
    || result.reply.length > LIMITS.maxReplyChars
    || typeof result.kind !== "string"
    || !["greeting", "grounded", "redirect", "clarify", "decline"].includes(result.kind)) return undefined;
  return { reply: result.reply, kind: result.kind as Reply["kind"] };
}

export type TextPart = { text: string; href?: string };

/** Match complete URL tokens before allowlisting, never an approved prefix. */
export function approvedTextParts(text: string, approvedLinks: readonly ApprovedLink[]): TextPart[] {
  const allowed = new Set(approvedLinks.map((link) => link.url));
  const tokens = text.split(/(https?:\/\/[^\s<>"']+)/giu);
  return tokens.flatMap((token) => {
    if (!/^https?:\/\//iu.test(token)) return [{ text: token }];
    const candidate = token.replace(/[.,;:!?\])}]+$/u, "");
    if (!allowed.has(candidate)) return [{ text: token }];
    const suffix = token.slice(candidate.length);
    return [{ text: candidate, href: candidate }, ...(suffix ? [{ text: suffix }] : [])];
  });
}
