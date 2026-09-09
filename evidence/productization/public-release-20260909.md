# Donna productized public release — 2026-09-09

Result: **PASS**.

## Exact release identity

- reviewed/deployed source SHA: `7b6004c1fa5b715b1c2775d07981ebac1eee8622`;
- existing Vercel project: `Cadre_AI / cadre-ai3 / cadre-ai-chatbot`;
- project ID: `prj_n1nwQI54mbIplgaExeVkeNC8hrv2`;
- deployment ID: `dpl_DMA3WxfAfMgwc7kZLueKctx6kfsy`;
- immutable deployment URL: `https://cadre-ai-chatbot-ed8mc7byh-cadre-ai3.vercel.app`;
- existing production alias: `https://cadre-ai-chatbot-tawny.vercel.app`;
- Vercel inspection: target `production`, status `Ready`.

No replacement project was created or linked. The authenticated owner CLI session used the existing `.vercel/project.json`, then `vercel pull --environment=production`, `vercel build --prod`, and `vercel deploy --prebuilt --prod`.

## Anonymous public release markers

Direct public probes against the production alias passed:

- `/api/health` → `status=ok`;
- root contains Donna/productized presentation (`Donna | Cadre AI`, `cadre-donna`, `What are you trying to figure out?`);
- `/icon.svg` is present;
- exact `hello` → `kind=greeting`;
- `What does Cadre do?` → `kind=grounded` and contains the configured Donna overview question **exactly once**;
- `What does Cadre do? Just answer, no follow-up questions please.` → `kind=grounded` and contains **no** Donna overview question;
- `What is your pricing?` → `kind=decline` and contains **no** Donna question.

A public desktop/mobile screenshot probe also passed title/product/assistant/placeholder/no-overflow checks. Screenshots are under `evidence/productization/public-ui/`.

## Public browser matrix

The first external 52-case run immediately followed four manual public API probes. It passed 51/52; the one mobile clarification case received no assistant turn after the prior probes and desktop run had consumed the intentionally process-local anonymous rate window. This was retained as an operational/test-order observation rather than bypassing the rate limiter.

After waiting 65 seconds for a clean rate window and making no additional API calls, the full external matrix was rerun unchanged against the same production alias: **52/52 PASS**. Production rate-limit behavior was not weakened or special-cased.

## Verdict

The productized Donna source is release-equivalent to the existing public Vercel alias for the tested markers and browser contract. This does not imply GitHub workflow publication: the dedicated audited `git_push` credential remains a separate CI/CD gate.
