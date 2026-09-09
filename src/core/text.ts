/**
 * Text normalization shared by routing, boundary triggers, and config
 * validation. User text is DATA; these helpers only ever compare it against
 * configured phrases.
 */

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    // Delete (not space-replace) invisible format characters so zero-width
    // insertions cannot split trigger words, e.g. "co​st".
    .replace(/\p{Cf}/gu, "")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Whole-word / whole-phrase containment. Both sides are normalized here
 * (idempotent for pre-normalized input), so callers cannot silently bypass
 * matching by passing raw text.
 */
export function containsPhrase(haystack: string, phrase: string): boolean {
  const needle = normalize(phrase);
  if (!needle) return false;
  const padded = ` ${normalize(haystack)} `;
  return padded.includes(` ${needle} `);
}
