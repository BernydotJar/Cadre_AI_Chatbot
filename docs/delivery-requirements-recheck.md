# Delivery requirements recheck

Reviewed 2026-09-08 against the supplied v1.1 product brief, including its scenario list, deliverables, weighted review dimensions and engineering tips. The private original is not copied into the repository. The later owner-provided clarification allowing any coding assistant remains recorded; execution evidence must describe what actually happened.

## Requirement-to-evidence map

| Expectation | Current implementation/evidence | Remaining work |
|---|---|---|
| Plan before implementation | Root CLAUDE.md, plan.md, approved specs and original approval events | Keep instructions current; do not rewrite historical approvals |
| Public working chatbot | Repaired interface deployed; 38 intercepted public browser cases and one independent real conversation PASS; prior 30-check matrix retained | Clean archive and human closure |
| Six supported scenario families | Refreshed src/config/cadre.ts; independent N2/N3 evidence; six grounded public scenarios PASS | Maintain source freshness; no broad semantic coverage claim |
| Deliberate architecture | Separated config/core/provider/server/UI; docs/component-inventory.md | Maintain explicit limitations |
| Real independent agent work | N2/N3 lifecycle; N4 original FAIL and repaired independent PASS | Retain authentic evidence; do not relabel earlier failures |
| Small authentic commits | Existing Git history with foundation, policy repairs, API, deployment and process increments | Continue staging bounded changes; retain .git in ZIP |
| Custom commands/context management | npm graph/verify scripts; startup and role contracts in CLAUDE.md; resumable checkpoint | Demonstrate real commands, not invented slash-command or role history |
| Test and inspect output | 233 tests, 42 independent local browser cases + four cold probes; 38 intercepted repaired-public cases + one real conversation; original 30 public/API checks retained | Clean-extraction package verification |
| Explicit scope decisions | No auth/CRM/vector DB, real booking or account access; optional extension isolated | Keep stretch work behind core-readiness gate |
| Lightweight complete archive | Exclusion rules and planned clean-extraction check | Create and independently verify source ZIP before closure |

The brief weights workflow/context management 30%, architecture 25%, scope/speed 20%, verification 15% and communication 10%. More framework text or an extension does not by itself satisfy those dimensions. Specific instructions, actual review findings, fixed regressions and an anonymously working product provide the evidence.

## CLAUDE.md refinement

The prior file mentioned the graph but retained scaffold-era wording and omitted the concrete stack and operational lifecycle. It has been updated with the actual architecture, Graph Engineering role boundaries, startup recovery, knowledge ownership, runnable commands, safety constraints and context discipline. It links to detailed records rather than importing the entire history.

The [Claude Academy lesson](https://academy.claude.com/courses/claude-code-101/the-claude-md-file) frames CLAUDE.md as project onboarding with stack, conventions, commands and useful references. Current [Claude Code memory guidance](https://code.claude.com/docs/en/memory) emphasizes concise, specific instructions; this file remains below 200 lines. These are instruction-design references, not evidence that a native Claude command or a particular model performed this work.

## Extension decision

The brief requires a public URL and lightweight source ZIP, not a browser extension. The owner suggested an optional local integration demonstration. Its design and safety gates are in [extension-preview-design.md](extension-preview-design.md). It must not replace, postpone or be misrepresented as the core product. The original site remains outside our deployment authority.

## Status honesty

Initial browser evidence (2026-09-08 local): the first run could not launch because its matching Chromium runtime was missing. After installing that runtime, the suite executed: 22 passed, 8 failed. Six failures were test selectors that included the framework's unrelated route announcer; two exposed a real Stop/Send duplicate-request bug. Independent review also reproduced initial welcome scrolling and keyboard focus loss. After repairs the expanded 38-case suite passed; independent verification then found another keyboard focus issue in Jump to latest. These dated observations do not close N4 or the release; follow-up reports and the ledger carry the current verdict.
