# Independent context/documentation review

Reviewed 2026-09-08 local / 2026-09-09 UTC by the separate `context_docs_critic` agent. Outcome: **PASS WITH MINOR FOLLOW-UPS** for documentation consistency; this is not an app, deployment, extension, or release gate.

Scope: `CLAUDE.md`, `plan.md`, `docs/delivery-requirements-recheck.md`, `docs/extension-preview-design.md`, and `docs/knowledge-source-audit.md`. Compared with the locked package versions, npm scripts and their implementations, Playwright configuration, config/provider/server code, approved requirements, authorization record, workflow, checkpoint, public research record, and a read-only projection of the event ledger. No private brief was opened or copied. Its exact weights and wording were therefore not independently rechecked here.

## Follow-ups

1. **P3 — Refresh the N4 projection at handoff.** `plan.md:25` still labels N4 as running with producer work underway; `docs/delivery-requirements-recheck.md:34` says the browser defects are being repaired. At review, event 71 (`44ee1dcc-e9aa-4d24-80cc-35c93206ba6d`) instead moves N4 to `review` because repairs are complete and independent verification is underway. Keep the original 22-pass/8-fail observation as dated history, then add the latest verified state and evidence link. This avoids sending a resumed agent back to an already repaired phase. No premature PASS is present.
2. **P3 — Preserve the fact-ordering safety rule explicitly.** `CLAUDE.md:16` says the model selects fact indices. The implementation in `src/server/chat.ts` uses those indices for ordering only and appends every remaining approved fact, preserving portal, booking, assessment, and security boundaries. State this invariant in the durable architecture instructions so a future content/retrieval change does not accidentally treat omitted model indices as permission to omit safety facts.

The coordinator restored English product copy and the prohibition on soliciting credentials or sensitive personal data during review; both were verified in `CLAUDE.md:60`. No outstanding finding remains for those two rules.

## Confirmed consistency

- Stack claims match `package-lock.json`: Next 16.3.4, React 19.2.8, TypeScript 6.0.3, Zod 4.5.4, Vitest 5.0.0, Playwright 1.63.0, ESLint 9.39.5. The model/deadline match provider configuration. The described verify, graph, and browser commands exist and their stated behavior matches their source.
- Latest transition projection contains N1/N2/N3/N5 `done`, N4 `review`, N6 `approved`, across 71 events. This review read events; it did not rerun the pinned runtime's hash/schema validation or change the ledger. The baseline pin and single-writer/append-only instructions are consistent across the documents and wrapper.
- The extension remains proposed, optional, generic “Integration Preview” copy, and subordinate to the anonymous public app and source archive. Its contract limitations match the current `{reply, kind}` API. It claims no extension build, installation, actual-site injection, endorsement, or publication.
- The knowledge audit separates recommendations from shipped facts, bounded absence findings from proof of nonexistence, and company claims from verified guarantees. No runtime-content or deployed-behavior claim is made.
- No fabricated native command, installed skill execution, tool use, extension completion, or release approval was found. Historical bootstrap text is explicitly labeled historical.

## Bounded primary-source spot checks

Official pages were opened read-only on this review date. These checks validate the relevant assertions, not the entire original research run or every recorded HTTP status:

- [Cadre Industries](https://cadre.ai/industries): Hospitality and the existing eight industry categories are present; the page also describes the central portal.
- [Cadre Contact](https://cadre.ai/contact): the public form, per-area maturity grades and improvement guidance, and B2B/B2C fit description support the proposed audit refinements. No form was submitted.
- [Cadre Strategy](https://cadre.ai/strategy): the eight pillars, distinct 45-day intensive, model/data-control marketing language, and Cadre's own OpenAI service-partner statement are present. The audit correctly retains attribution and avoids turning them into blanket operational guarantees.
- [Cadre Privacy Policy](https://cadre.ai/legal/privacy-policy): displayed revision `09/01/2026` and general safeguards with incomplete-security caveat match the audit. This does not establish that the policy governs the separately hosted chatbot.
- [Claude Academy](https://academy.claude.com/courses/claude-code-101/the-claude-md-file) and [Claude Code memory guidance](https://code.claude.com/docs/en/memory) support concise onboarding instructions covering stack, commands, conventions, and references; the current guidance recommends under 200 lines.
- [Chrome content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) confirms isolated JavaScript environments still share the page DOM. [Chrome cross-origin guidance](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests) warns against accepting arbitrary destination URLs from content scripts. The extension proposal reflects those boundaries.

## Reviewed snapshot hashes

These identify the files at the end of the read-only review, before any coordinator follow-up; a later update needs its own clearly labeled recheck.

```text
41882a1a4ceac01b8a61a1e4c4dcac408c4c156130cee49c72bd2f762fc10d1c  CLAUDE.md
8b248c22902f5330f5f1abe91b0c6e269281e0f969da28d0c64cf98582c695c9  plan.md
7f130e779dfcbe94228bb99f0b5c2e55a5150697924469ea454c763ece251625  docs/delivery-requirements-recheck.md
c059855f4f7e437f4d7ecc1a04071cf6db4a2b1dd792dc2a1551ed42a29e3103  docs/extension-preview-design.md
7c0c602ed7babb6e8d72c615d7fbccee5071d16e6e25da17d303e4aa90a1eef1  docs/knowledge-source-audit.md
```

Only this review file was written. All shell commands used RTK. No Git, build, test, server, environment, model/API, or deployment operation was performed by this reviewer.
