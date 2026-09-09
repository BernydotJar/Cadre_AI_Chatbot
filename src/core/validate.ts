import { z } from "zod";
import { LIMITS } from "./limits";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .trim()
    .min(1, "message content must not be empty")
    .max(LIMITS.maxMessageChars, "message content is too long"),
});

export const chatRequestSchema = z
  .object({
    messages: z
      .array(chatMessageSchema)
      .min(1, "at least one message is required")
      .max(LIMITS.maxMessages, "too many messages in one request"),
  })
  .refine(
    (request) => request.messages[request.messages.length - 1]?.role === "user",
    { message: "the last message must be from the user" },
  );

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export type ParseResult =
  | { ok: true; request: ChatRequest }
  | { ok: false; error: string };

/** Parse unknown input into a bounded ChatRequest without throwing. */
export function parseChatRequest(input: unknown): ParseResult {
  const parsed = chatRequestSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, request: parsed.data };
  }
  const first = parsed.error.issues[0];
  return { ok: false, error: first ? first.message : "invalid request" };
}
