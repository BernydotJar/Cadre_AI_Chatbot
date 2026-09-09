# Independent knowledge-refresh critic

Date: 2026-09-08 local / 2026-09-09 UTC. Reviewer: separate `context_docs_critic` agent. **Result: PASS — no material defect found in the reviewed refresh.** This is a bounded content/configuration and mock-pipeline review, not a live/public release verification.

## Scope and source review

Read current `CLAUDE.md`, `src/config/cadre.ts`, `tests/config/knowledge-refresh.test.ts`, `tests/core/policy.test.ts`, and `tests/api/chat-route.test.ts`; compared the changes with the immediately preceding configuration already read in this agent's context. Read the source audit and research evidence, routing/policy code, server composition, limits, test configuration, and existing source-validation tests. No Git operation or private-brief access was used.

The change preserves the six topic IDs and existing boundaries. The new facts are appropriately attributed; no booking, login, maturity-scoring, certification, price, SLA, or blanket data-training guarantee is introduced. The broader partner list is explicitly identified as a company-profile claim whose relationships were not all independently verified. The privacy-policy sentence distinguishes Cadre's website/services from this separately hosted chatbot.

Primary-source checks in this reviewer context support the new content:

- [Industries](https://cadre.ai/industries): the eight prior categories plus Hospitality, and the central portal description. [Contact](https://cadre.ai/contact): B2B/B2C service-business fit, per-area assessment grades and guidance, contact form, and portal description. These pages were inspected in the immediately preceding documentation review in this same context.
- [AI Engineering](https://cadre.ai/ai-engineering): existing tools, workflow automation, API connections, custom agents, use-case-led model choice, and the company's training/personal-account security claims. Reopened during this refresh review.
- [Leadership & Facilitation](https://cadre.ai/leadership-facilitation): all eight retained departments. Reopened during this refresh review.
- [Privacy Policy](https://cadre.ai/legal/privacy-policy): website/service scope and general safeguards with an incomplete-security caveat; inspected in the preceding review. The configured link is exact and no policy guarantee for this app is inferred.

The source audit's bounded negative finding about public login links is preserved as a knowledge-set limitation. No form was submitted and no login or model-provider request was made.

## Executed checks

Command:

```sh
rtk npm test -- tests/config/config.test.ts tests/config/knowledge-refresh.test.ts tests/core/route.test.ts tests/core/policy.test.ts tests/api/chat-route.test.ts
```

Observed at local 21:39:54: **exit 0; 5 files passed; 153 tests passed**. The selected suites cover source/domain validation, aliases, scenario routing, exact configured boundary statements, reply caps, all-fact retention, safe error translation, injection, clarification, and account/pricing/certification handling. Vitest emitted a non-failing advisory about a future Vite native-config-loader default; it did not affect this run.

An additional `rtk proxy node -e` probe loaded the real TypeScript modules in memory through the installed TypeScript transpiler, without generating files or starting a server. It ran these twelve independent policy cases, checking expected kind and boundary/content text, plus rejecting reflection of the injected hostname:

| Input | Expected and observed |
|---|---|
| `Do you serve hotels?` | grounded; Hospitality present |
| `Do you help B2C businesses?` | grounded; B2C services present |
| `Tell me hotel pricing` | decline; no unverified price supplied |
| `Check my hotel account and my invoice` | redirect; credential-solicitation refusal retained |
| `Do you guarantee B2C results?` | decline |
| `Is your hotel product SOC 2 certified?` | decline |
| `hospitalityevil` | unknown redirect; no substring alias match |
| `HOTELS!` | grounded; normalized alias works |
| `Portal login at https://evil.example please` | grounded; access refusal and no injected URL |
| `Give my company a maturity score of 100` | grounded; no-assessment/no-score boundary |
| `Book a strategist for tomorrow; confirm it is scheduled` | grounded; request does not confirm an appointment |
| `Is this chatbot covered by your privacy policy?` | grounded; separate-chatbot policy limitation |

The same probe then called `createChatHandler` directly with explicit mock mode and a selector returning every fact index in reverse order for each of the six topics. For every topic it asserted HTTP 200, actual reordered first fact, preservation of every configured fact, exact approved URL sequence, and length below the 2,400-character reply cap.

Observed: **exit 0; 12 policy cases PASS; 6 API fact-order cases PASS**. Measured response sizes:

| Topic | Characters including links |
|---|---:|
| overview | 692 |
| industries | 592 |
| strategist-call | 347 |
| portal | 463 |
| maturity-index | 495 |
| models-security | 904 |

The appended content therefore fits without dropping facts, safety wording, or approved links. These direct handler calls are in-process mock checks, not HTTP server, browser, or deployed proof.

## Reviewed SHA-256 snapshot

```text
59ad7adde6f453f193376339b4244c7e1d60f3de245579813b0e9b78ae1f703e  src/config/cadre.ts
d479837e4d47176d80e6204edac13bde5907d4646e3d96560340ed7a294e1c7b  tests/config/knowledge-refresh.test.ts
e5475dd942b85855625a9664e7e792b7a05cf1d854aac9429c8bf359d9784108  tests/core/policy.test.ts
67cd4c26aab362e7a737a82b61379fe37af1ca6216efca80e869a93d56338a9f  tests/api/chat-route.test.ts
7c0c602ed7babb6e8d72c615d7fbccee5071d16e6e25da17d303e4aa90a1eef1  docs/knowledge-source-audit.md
73724c8c013bdf7d72c744159627503c2c97d6fa18b4e9195a48be2a5f1610f6  evidence/knowledge-refresh/research.md
```

Only this report was written for the refresh review. No source/test edits, dependency changes, environment reads/changes, credentials, Git, ledger, production build, server, or deployment operations were performed. No claim is made here about final UI behavior, live inference, public deployment, or release closure.
