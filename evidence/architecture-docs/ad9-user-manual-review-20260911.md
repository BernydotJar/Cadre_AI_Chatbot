# AD9 Critic / Red-Team Review - Donna r15 User Manual

Result: **PASS**

## Review focus

- Is the manual usable by a non-engineering visitor?
- Does it describe only visible r15 behavior?
- Are privacy, model, memory and transactional limits explicit?
- Are optional Chrome/n8n workstreams separated from the normal website?
- Do controls and labels match the actual UI?

## Findings

1. **PASS - user journey is task-oriented.** The manual starts with what Donna can/cannot do, then covers entry points, status, asking, interpreting answers, continuing, recovery controls, privacy, accessibility-oriented behavior, troubleshooting, walkthrough and FAQ.
2. **PASS - exact UI vocabulary.** `Ask Donna`, `Browse verified topics`, `Stop response`, `Retry response`, `New`, `Close chat`, `Jump to latest`, `Available`, `Demo`, `Unavailable` and `Shaping a grounded answer` match r15 source.
3. **PASS - model authority is not overstated.** The manual explains that grounded model use selects relevance/order of approved fact indices while application text/links/boundaries remain authoritative.
4. **PASS - privacy/memory distinction.** No app persistent chat history is clearly distinguished from possible hosting/provider logging or retention.
5. **PASS - transactional boundaries.** No login/private account/CRM/booking/assessment/email/tool execution capability is implied.
6. **PASS - optional integrations separated.** Chrome is reviewer/internal optional; n8n is explicitly not an end-user feature in r15.

No fixer action required.
