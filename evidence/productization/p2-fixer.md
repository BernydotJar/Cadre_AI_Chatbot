# P2 Fixer Report — Respect Explicit No-Follow-Up Requests

Repair commit: `4dcca7b48f4139d7e4aae065e95f811f511f8d25`

P2-CRIT-001 is repaired with a deterministic opt-out check scoped only to the latest user message. Narrow request-shaped phrases (`no follow up`, `no questions`, `do not ask`, `don't ask`, `just answer`, `answer only`) suppress Donna's optional question while leaving routing, facts, approved links, provider calls, and all boundary reply kinds unchanged.

Permanent tests cover three opt-out phrasings and still preserve the normal one-question path. Focused Donna tests pass 13/13.
