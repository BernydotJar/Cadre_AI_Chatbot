/**
 * Conversation bounds. Product-wide safety limits, not client configuration.
 * Each limit is enforced at the layer named below; limits without an enforcing
 * layer yet are marked with the node that wires them in.
 */
export const LIMITS = {
  /** Max messages accepted in one request. Enforced by `chatRequestSchema`. */
  maxMessages: 20,
  /**
   * Max characters per message (UTF-16 code units, so worst-case bytes can be
   * ~4x this). Enforced by `chatRequestSchema`.
   */
  maxMessageChars: 2000,
  /**
   * Max raw request-body size in bytes, checked BEFORE JSON parsing so an
   * oversized payload is rejected without buffering-then-validating. Sized
   * from maxMessages x maxMessageChars with generous JSON-escaping headroom.
   * Enforced by the /api/chat route handler.
   */
  maxBodyBytes: 256 * 1024,
  /** Messages forwarded to the provider (server-side truncation; wired in N3). */
  historyWindow: 10,
  /** Hard cap on reply length returned to the client (wired in N3). */
  maxReplyChars: 2400,
  /** Per-request provider timeout (wired in N3). */
  requestTimeoutMs: 20_000,
} as const;
