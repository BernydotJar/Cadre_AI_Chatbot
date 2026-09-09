# n8n human-handoff adapter

This optional integration models **human handoff**, not “send an email.” The chatbot/domain layer should eventually depend on a `HumanHandoffProvider`; n8n is one replaceable adapter behind that contract.

`cadre-handoff.workflow.json` is intentionally credential-free. It accepts `POST /webhook/cadre-handoff`, validates explicit contact consent and a bounded structured payload, maps the handoff type to an environment/configuration key, and returns controlled `202 accepted` or `400 failed` JSON. It does **not** claim that an email, CRM entry, or meeting was created.

Supported types:

- `qualified_lead` -> `CADRE_SALES_EMAIL`
- `client_support` -> `CADRE_CLIENT_SUCCESS_EMAIL`
- `portal_support` -> `CADRE_SUPPORT_EMAIL`
- `general_escalation` -> `CADRE_GENERAL_EMAIL`

Required application-level fields include `contact.email`, `intent`, `summary`, `recommended_next_step`, `consent_to_contact: true`, and `source: "cadre-ai-concierge"`. The workflow truncates optional free text and caps pain points before constructing its notification object. Real destination addresses and provider credentials must live in n8n/environment configuration, never this file.

## Verified isolated runtime

A separate sandbox workstream discovered no existing n8n service. Nested Docker image extraction failed, so n8n 2.38.1 was run under an isolated Node 24.9.0 runtime with persistent SQLite state. Health, CLI import/export, publish/restart, and four live local webhook probes passed. See `evidence/n8n/parallel-workstream-20260909.md`.

This is not wired into the public chatbot yet. Before a live handoff demo, add the application `HumanHandoffProvider` boundary plus an approved delivery provider/recipient and prove one successful delivery. The chatbot must never say “sent” until n8n returns a successful delivery result.
