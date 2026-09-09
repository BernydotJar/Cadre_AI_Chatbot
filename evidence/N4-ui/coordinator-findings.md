# N4 coordinator findings during implementation

## Response discriminator validation

Actual command on the initial UI helper: `rtk proxy npm test -- tests/ui/conversation.test.ts`.
Observed: 14 tests passed, one failed. `readReply({ reply: "okay", kind: ["grounded"] })` incorrectly accepted an array discriminator because the helper coerced the value with `String(kind)` before validation.

The added regression requires a true string enum. The finding was sent to the UI producer for repair; independent review and verification remain separate. This failed run used no network or credentials. The other helper tests passed for exact URL allowlisting, output length, newest-history bounds, preserved clarification context, and avoiding mutation of displayed replies.
