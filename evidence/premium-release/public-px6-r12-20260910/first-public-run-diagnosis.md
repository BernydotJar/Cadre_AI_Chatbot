# PX6 r12 first public Playwright run — retained 67/68 diagnosis

Deployment: `dpl_FGqGheG1GSx8EmUEJvd4rhEsdKYh`
Alias: `https://cadre-ai-chatbot-tawny.vercel.app`
Release source: `80438863ee91e18fcc4fb070e360e9754b52e887`

The first external Playwright run finished **67/68 PASS**. The only failure was mobile `all six entry points are present and clarification preserves an ordinal follow-up`, on the second user turn (`the second one`).

The captured page state proves this was not a lost client conversation transition: the transcript contains the first user turn, Donna's clarification, and the second user turn. The error panel says **`Chat is busy. Please wait a moment, then try again.`** and preserves the second message for retry. That is the UI mapping for HTTP 429.

Production rate limiting is intentionally conservative when no trusted proxy IP header is configured: `clientKey()` returns `global`, and `RATE_LIMIT` permits 10 requests per 60 seconds per process-local bucket. Immediately before the full external suite, the release verifier had also executed a deterministic public `hello` preflight. The external suite then exercised multiple real-server scenarios before reaching the mobile ordinal test. The preflight plus suite therefore contaminated the same fixed window.

This diagnosis does **not** weaken or change the product rate limit, does not enable a trusted proxy header without ingress proof, and does not alter the failing test. The first 67/68 result remains retained as FAIL evidence.

The bounded verification repair is procedural: allow the 60-second window to expire, then run the complete 68-case external Playwright matrix from a fresh window with no API preflight immediately beforehand. A second failure would require release/source re-evaluation; only a full fresh-window 68/68 PASS can establish public browser equivalence.