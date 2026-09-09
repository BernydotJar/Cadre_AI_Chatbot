# N3 fixer — serialized prompt byte budget

## Finding addressed

The independent critic found that valid ten-message API requests containing nine 2,000-character Greek-alpha or quote-filled history messages plus a final `services` question exceeded the provider's 32 KiB serialized prompt limit. The adapter returned `invalid_response`, which became an incorrect HTTP 503 for a valid supported question.

## Change

`src/provider/openrouter.ts` now measures the complete serialized UTF-8 payload and removes the oldest history message while it exceeds the byte limit. It retains the final question unchanged, the complete approved facts, and the system instructions. Token/cost bounds use the final reduced payload. If even the final question plus required context cannot fit, the adapter still fails before any outbound request.

No request/response schema, dependency, provider configuration, credentials, or budget/retry policy changed.

## Mock regression evidence

`tests/provider/openrouter.test.ts` adds two API-to-adapter cases with synthetic transport for Greek-alpha history and nested JSON escaping. Both requests pass input validation and remain below the 256 KiB inbound limit. Both now return HTTP 200 with `kind: grounded`; the outgoing payload is at most 32 KiB, retains the final question and facts, and preserves the newest history suffix. Restoring one discarded message exceeds the cap. A third case verifies zero network calls when required context still cannot fit.

Actual fixer commands:

- `rtk proxy npm test -- tests/provider/openrouter.test.ts tests/api/chat-route.test.ts` — PASS, 92 tests in 2 files.
- `rtk proxy npm test` — PASS, 203 tests in 8 files.
- `rtk proxy npm run typecheck` — PASS.

Vitest also reports the existing Vite config-loader compatibility warning. No live requests, credential reads, environment changes, Git operations, ledger changes, or build were performed by this fixer. Independent verification and node acceptance remain separate.
