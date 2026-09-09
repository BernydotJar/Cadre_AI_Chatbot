# N2 greeting/source repair review — 2026-09-09

## Reproduced defect

An exact ordinary greeting (`hello`) had no routed knowledge topic and therefore fell through to the generic unsupported-information handoff. The first interaction was truthful but unnecessarily brittle.

## Bounded repair

- Added an exact normalized whole-message greeting decision; it does not match greeting prefixes on substantive requests.
- Preserved policy precedence: decline topics and account/private requests are evaluated before greeting detection.
- Greeting reply is deterministic, contains no external link, and requires no model/provider call.
- Refreshed official-source provenance to 2026-09-09 and promoted one explicitly attributed public About-page claim (100+ high-ROI use cases across 50+ companies) into the reviewed typed knowledge configuration.
- Raw research inventory remains documentation only; it is not read at runtime.

## Regression boundary

Focused verification passed 146 tests. Explicit cases cover `hello`, `hi`, `hey there`, daypart greetings, `hola`, plus greeting-prefixed pricing/account/service requests. Granite 3.3 2B returned `VERDICT: PASS` for the bounded policy review with reasoning disabled for the final verdict call.
