# PX6 revision 12 — post-release closure handoff

Date: 2026-09-10 UTC

## Product terminal state

PX6 revision 12 is DONE and publicly verified.

- Deployed runtime source: `80438863ee91e18fcc4fb070e360e9754b52e887`
- GitHub CI run: `34446809913` — PASS
- Existing-project Vercel deployment: `dpl_FGqGheG1GSx8EmUEJvd4rhEsdKYh`
- Immutable deployment: `https://cadre-ai-chatbot-k9yc245h3-cadre-ai3.vercel.app`
- Production alias: `https://cadre-ai-chatbot-tawny.vercel.app`
- Anonymous release-marker smoke: PASS
- Detached local final verifier: 302/302 Vitest, 68/68 Playwright, extension build, 73/73 extension tests, 24/24 synthetic extension browser, build/typecheck/lint/Graph PASS
- Complete public browser coverage: 34/34 desktop + fresh client-rate window + 34/34 mobile = 68/68 PASS
- Premium Graph: revision 12 DONE; design-review PASS; verification PASS; post-DONE public integration-proof PASS at sequence 232

Two monolithic external Playwright attempts remain retained at 67/68 FAIL. They reached the intentional per-client 10 requests / 60 seconds production rate limit at the same mobile second-turn request. Captured UI preserved the user turn, exposed the 429 state and retry path, and did not lose conversation state. The eventual 68/68 public proof did not change the product limit, trusted-header policy, or test assertions; it ran the same complete desktop and mobile projects in separate fresh rate windows.

## Claude Code workflow evidence

Actual Claude Code 2.1.266 executions are retained, not inferred from configuration:

- revision-11 bounded Producer for source freshness;
- revision-11 constrained independent critic used for the design-review gate;
- a separate first critic attempt that self-disclosed forbidden informational Bash use and was retained but excluded from gate evidence;
- revision-12 bounded Fixer for the extension approved-link integration defect;
- revision-12 constrained independent critic used for the repaired source gate.

Coordinator review materially changed AI-generated output before acceptance: it narrowed delegated-domain trust to the exact observed `portal.gocadre.ai` host, corrected stale PX5/PX6 CI provenance, rejected ownership-like wording not established by public evidence, and caught a Fixer bug that compared `url.hostname` against full `https://...` domain strings.

## Automation-only blocker

GitHub deploy workflow run `34447034685` for source `8043886` passed exact source resolution, repository release gating and dependency installation, then failed closed at the existing-project binding preflight because the GitHub `production` environment does not contain the required Vercel org/project/token values. No replacement project or bypass was created. Manual authorized delivery through the already-linked existing project is proven and the public runtime is green.

## Post-release evidence commit boundary

The commit that includes this file, the public evidence files, Graph events 226–232, and synchronized documentation is intentionally **documentation/evidence-only**. It is expected to be newer than deployed runtime source `8043886`. That newer commit is not a new runtime release because it changes no application, provider, config, test, extension runtime, dependency, workflow, or deployment source file. The final source ZIP should be created from that closure commit so the reviewer receives the complete audit trail and usable Git history, while `8043886` remains the exact deployed application source.

External submission/upload remains a separate human action.