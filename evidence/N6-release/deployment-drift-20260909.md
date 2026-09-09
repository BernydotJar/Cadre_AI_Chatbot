# N6 release blocker — current source is newer than the verified public deployment

Date: 2026-09-09 UTC. Current source HEAD at observation: `1ac5c4c343690efbd6522ee2b8bb6865047b1878`.

**Result: BLOCKED for final source-to-public-release equivalence.** The public app is healthy and the previously deployed hydration release has live-provider evidence, but the current submission candidate contains product changes that are not evidenced as deployed. Final release must not claim the ZIP and public URL are the same release until a fresh deployment is authorized and verified.

## Verified public state

Read-only smoke against `https://cadre-ai-chatbot-tawny.vercel.app`:

- `/` -> HTTP 200, 13,049 bytes, HTML.
- `/api/health` -> HTTP 200, 15 bytes, JSON.

The retained production receipt `hydration-deployment.json` identifies deployed runtime commit `c6f781cf588689deee9ae229261effdd08e5d24b`. `independent-live-hydration-20260909.md` independently passed one real browser conversation on that repaired hydration deployment. These remain valid evidence for that deployed snapshot.

## Drift from the deployed runtime

Current product paths differ from `c6f781c`:

```text
24  23  app/globals.css
76   0  e2e/readability.spec.ts
13   2  src/provider/config.ts
12  11  src/provider/openrouter.ts
```

Current hashes:

```text
f7b5159eff097cbfb692e8098b486cb5c7bc76d407383f3275dc4f105122c4f4  app/globals.css
5581eb499e4525e1892a9ffe277b4a5f3296f7a2f6dd84184f1d93631773e907  src/provider/config.ts
bea1f37d621c916c87be93b26bb4954196c6d72b6483f3cc1fd78fab6795eb39  src/provider/openrouter.ts
3c44944e1876350fe3f460c2e14e00b5e98aaa156982eeafb5d2e8f8c288b051  src/ui/support-chat.tsx
```

The current source has passed clean candidate-package verification, including 245 unit/integration tests and 48 browser cases. That local proof does not establish public deployment identity.

## Why deployment cannot be completed from this sandbox

Fresh Vercel CLI observation:

- Vercel CLI 59.12.0 is installed.
- `vercel whoami` reports **Logged out**.
- `.vercel/project.json` is absent in the checkout.
- `VERCEL_TOKEN` is absent from the process environment.

Creating an unrelated anonymous temporary deployment would not prove equivalence to the authorized Cadre Vercel project and would not carry the authorized live provider configuration. No deployment was attempted after observing the missing authorization.

The sandbox also has no `OPENROUTER_API_KEY` in its process environment and no `.env.local`; therefore the optional GPT-4.1-mini vs Gemini 3.8 Flash live A/B cannot be run here without new credential availability. The existing live public matrix remains the core live-provider evidence; the two-model experiment stays pending and must not be fabricated from dry-run results.

## Required unblock

1. Restore an authorized Vercel CLI session/token for the existing `cadre-ai-chatbot` project/team.
2. Deploy the current reviewed source snapshot (or a later reviewed closure snapshot) without changing provider secrets.
3. Re-run anonymous public smoke and the repaired public browser/readability suite against that deployment.
4. Run one bounded real-provider conversation if the deployed environment requires a fresh source-to-live round-trip proof.
5. If the owner still wants the Gemini comparison, make the chatbot-only OpenRouter key available to the bounded evaluator and run the already independently verified 14-case/18-attempt experiment; do not use that key for coding assistance.

Until steps 1–4 are complete, N6 release closure is partial with a documented deployment blocker, not COMPLETED.
