# Parallel n8n human-handoff workstream — 2026-09-09

Scope: isolated development workspace, deliberately separate from the candidate repository so the stretch integration cannot destabilize the core release.

## Runtime discovery and recovery

- No existing n8n container, compose project, persistent volume, or listener was found.
- Nested Docker failed twice while applying the official n8n image with `archive/tar: invalid tar header`; this was treated as sandbox infrastructure failure rather than product evidence.
- The sandbox host Node was 22.23.2 while current n8n 2.38.1 requires Node >=24.
- A private Node 24.9.0 runtime was installed inside the isolated workstream; missing local npm runtime dependencies were repaired there only.
- n8n 2.38.1 starts with persistent SQLite state and `GET http://127.0.0.1:5678/healthz` returns `{"status":"ok"}`.

## Workflow proof

Workflow: `Cadre AI Concierge — Human Handoff`.

- `POST /webhook/cadre-handoff`.
- Validates one of four handoff types: `qualified_lead`, `client_support`, `portal_support`, `general_escalation`.
- Requires `consent_to_contact: true`, a valid email, required summary/intent/next-step fields, and exact source `cadre-ai-concierge`.
- Maps type to configuration keys (`CADRE_SALES_EMAIL`, `CADRE_CLIENT_SUCCESS_EMAIL`, `CADRE_SUPPORT_EMAIL`, `CADRE_GENERAL_EMAIL`) rather than embedding an employee address.
- Produces a bounded structured notification payload and `handoffId`; the complete transcript is not forwarded.
- Workflow import and export through n8n CLI PASS; workflow was published and n8n restarted so the production-style webhook registered.

Local webhook probes:

1. qualified lead -> HTTP 202, `status: accepted`, route `CADRE_SALES_EMAIL`.
2. existing client -> HTTP 202, `status: accepted`, route `CADRE_CLIENT_SUCCESS_EMAIL`.
3. missing consent -> HTTP 400, `status: failed`, reason `consent_required`.
4. invalid email -> HTTP 400, `status: failed`, reason `invalid_email`.

No real Cadre recipient, SMTP credential, or external email provider was configured. Therefore this evidence proves the n8n runtime + contract + consent/routing boundary, not real email delivery. The application should expose this later as `HumanHandoffProvider`, with n8n remaining an adapter.
