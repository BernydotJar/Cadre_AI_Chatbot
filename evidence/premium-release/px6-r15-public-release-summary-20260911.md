# PX6 revision 15 public release summary

Status: **PUBLIC EQUIVALENCE PASS**

## Release identity

- Runtime repair source: `af7e3ff91ae91fc231defe87fde0139bd1c7f298` (`fix(donna): keep mobile invitation readable`).
- Published closure source: `f33461679ebbe5322a9030f1f2b17319874d7e03` (`chore(graph): close PX6 revision 15 locally`). The closure commit adds Graph/evidence/status documentation only after the runtime repair.
- GitHub CI run: `34562930679` — **PASS** (`quality` and `browser`).
- Vercel project: existing `cadre-ai3 / cadre-ai-chatbot`; no replacement project or infrastructure was created.
- Production deployment ID: `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr` — **Ready**.
- Immutable deployment: `https://cadre-ai-chatbot-8jzn4qlxp-cadre-ai3.vercel.app`.
- Production alias: `https://cadre-ai-chatbot-tawny.vercel.app`.

## Local release gates

Revision 15 closed only after the retained repair lifecycle:

1. r13 detached verifier: all non-browser checks PASS, Playwright **68/70**; both failures were mobile because the historical `<=430px` rule hid the new invitation nudge.
2. r14 focused mobile repair: 2/2 targeted checks PASS, but independent Claude Code critic returned **CHANGES_REQUESTED** because important invitation/trust copy was reduced below the repository 12px readability floor.
3. r15 repair: launcher remains icon-only at `<=430px`; separate pre-chat invitation remains visible/compact; important invitation/trust copy restored to `>=12px`; targeted readability regression added.
4. Fresh independent source critic: **PASS**.
5. Detached verifier on exact runtime source `af7e3ff`: **302/302 Vitest, 70/70 Playwright, 73/73 extension tests, 24/24 synthetic extension browser**, production build, lint, typecheck, and Graph validation — all PASS.
6. Existing-project Vercel production pull/prebuild: **PASS**, tracked source drift `0`.
7. Repository `release:gate`: **PASS**.

## Publication and production verification

- Audited Git publication advanced `origin/main` to `f334616`.
- GitHub CI `34562930679`: **PASS**.
- Exact published snapshot was built and deployed through the already-linked Vercel production project.
- Anonymous production-alias smoke: `/api/health` PASS; current hero/results/Donna/product markers PASS; stale marker absent; deterministic `hello -> kind=greeting` PASS.
- Rate-aware public Playwright equivalence: **35/35 desktop + fresh 65-second client window + 35/35 mobile = 70/70 PASS**. No test, production rate limit, trusted-header policy, or assertion was weakened.

## Tooling note retained without relabeling product state

The first deployment capture script successfully deployed and Vercel reported the production deployment Ready/Aliased, but its shell parser selected a later `vercel redeploy ...` help line as the deployment URL and therefore the follow-up `vercel inspect` command failed. The original log is retained as `px6-r15-production-deploy-20260910.txt`. No redeploy or product repair was performed because of that parsing error. A separate reconciliation used the immutable URL emitted in the original Vercel output and independently confirmed deployment ID, Ready state, aliases, health, release markers, and deterministic greeting in `px6-r15-production-deploy-reconciled-20260910.txt`.

## Remaining operational gap

Automated GitHub production CD remains independently blocked because the GitHub `production` environment does not contain the existing-project Vercel binding values. This does not invalidate the manually authorized exact-project production release; it remains an explicit operational automation gap and must not be bypassed by creating replacement infrastructure.
