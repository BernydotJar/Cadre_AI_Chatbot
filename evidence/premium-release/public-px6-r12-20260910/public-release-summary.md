# PX6 revision 12 public release equivalence

Date: 2026-09-10 UTC

## Exact release

- Source: `80438863ee91e18fcc4fb070e360e9754b52e887`
- `origin/main` matched that SHA at deployment time.
- GitHub CI: run `34446809913` — PASS (quality + browser jobs).
- Automated production workflow: run `34447034685` — fail-closed at `Require an existing Vercel project binding` because GitHub `production` still lacks `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN`. It did not reach Vercel pull/build/deploy.
- Manual authorized deployment used the already-linked existing `cadre-ai-chatbot` project only: production pull, production build, tracked source drift 0, then `vercel deploy --prebuilt --prod`.
- Deployment: `dpl_FGqGheG1GSx8EmUEJvd4rhEsdKYh`
- Immutable URL: `https://cadre-ai-chatbot-k9yc245h3-cadre-ai3.vercel.app`
- Production alias: `https://cadre-ai-chatbot-tawny.vercel.app`

## Public marker smoke

Anonymous checks on the production alias passed:

- `/api/health` -> `{"status":"ok"}`
- page title marker `Donna | Cadre AI`
- root `data-product="cadre-donna"`
- hero `From AI curiosity`
- product marker `Track your AI results`
- visible `Ask Donna`
- stale `YOUR NEXT STEP STARTS HERE` marker absent
- `/icon.svg` is current SVG
- exact `hello` -> non-empty deterministic reply with `kind="greeting"`

The root also exposes the current public `Get Your AI Results` link at `https://portal.gocadre.ai/ai-maturity-index`.

## Full external Playwright and rate-limit evidence

A single-process production client is intentionally limited to 10 requests per 60 seconds. Production is configured with `CHAT_TRUSTED_PROXY_IP_HEADER=x-forwarded-for`, so Vercel ingress uses a per-client-IP bucket rather than the global fallback.

Two monolithic external runs are retained as **67/68 FAIL**. Both failed at the same second mobile ordinal-follow-up request. Captured DOM state showed the conversation was preserved and the UI displayed `Chat is busy. Please wait a moment, then try again.` with retry and saved draft, proving HTTP 429 admission rather than lost conversation state. The second monolithic run started after a fresh rate window, so the full desktop+mobile invocation itself is sufficient to exceed the single-IP production bucket before that point.

The mandatory complete matrix was then executed without weakening product controls or changing/skipping tests: all 34 desktop cases ran in a fresh rate window, the verifier waited 65 seconds, then all 34 mobile cases ran in a fresh rate window. Result: **34/34 desktop PASS + 34/34 mobile PASS = 68/68 public PASS**.

This rate-aware execution is the correct production verification procedure for a suite that intentionally exercises multiple live API scenarios from one IP. No rate limit was raised, no trusted-header bypass was added, and no extra mocking was introduced.

## Product behaviors exercised publicly

The full external matrix includes:

- real-server service answer with approved official links;
- private client-portal question handed to the official contact path rather than pretending account access;
- clarification followed by ordinal selection;
- empathetic pricing response containing no fabricated numeric rate;
- Donna proactive-question opt-out behavior;
- signal-orb shaping state;
- retry/cancel/malformed/network recovery paths;
- inert model text / exact approved URL rendering;
- reset, history position, keyboard/focus, IME, deadline and stale-response controls;
- reduced-motion, ambient media, responsive 320/360/760 geometry and text-spacing/readability checks.

## Release conclusion

Public runtime equivalence for PX6 revision 12 is PASS on the exact deployed source above. The earlier 67/68 attempts remain retained as verifier/rate-window evidence rather than being rewritten. The only outstanding delivery automation issue is GitHub's missing existing-project Vercel binding; manual exact-project production delivery is proven and public product behavior is green.