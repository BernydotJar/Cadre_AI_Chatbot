# Donna Architecture & Documentation checkpoint

Updated: 2026-09-11 UTC.

## Current objective

Finish the architecture pack for the frozen Donna PX6 revision-15 release without changing runtime behavior and without representing the AWS reference design as deployed.

## Artifact

Editable Lucidchart: `Donna Architecture Pack - r15`

- Document ID: `3991f2c1-fc1d-4cad-ab01-eec0d3296bfc`
- Edit URL: `https://lucid.app/lucidchart/3991f2c1-fc1d-4cad-ab01-eec0d3296bfc/edit`
- Pages: 5

### AS-BUILT

1. System Context
2. Runtime & Trust
3. Component Architecture
4. Engineering Control Plane

### TARGET / NOT DEPLOYED

5. AWS Reference Architecture

The target preserves the existing stateless Next.js/Node + deterministic core + `FactSelector`/OpenRouter boundary. It proposes Route 53, CloudFront, WAF, ALB, ECS/Fargate, ECR, Secrets Manager, IAM/OIDC, CloudWatch and controlled egress. ElastiCache is explicitly optional future scale control. No database, Bedrock migration, auth platform, CRM, vector store, or EKS is implied by parity.

## Verification

Lucid creation returned an editable five-page document. All pages were exported and visually inspected. Runtime & Trust and AWS connector routing were refined in-place after visual QA. Architecture semantics remained unchanged.

Graph Harness is authoritative for AD0-AD4 state; this checkpoint is a resumable projection.

## Terminal Graph state

**COMPLETED.** Architecture/documentation graph sequence 48 is valid with no READY nodes.

- `AD0-freeze-r15-baseline` — DONE; verification PASS.
- `AD1-as-built-architecture` — DONE; design-review PASS; verification PASS.
- `AD2-aws-target-reference` — DONE; design-review PASS; verification PASS.
- `AD3-lucid-architecture-pack` — DONE; design-review PASS; integration-proof PASS.
- `AD4-architecture-handoff` — DONE; verification PASS; integration-proof PASS.

No application/runtime path changed in this workstream. The editable Lucidchart is the final architecture artifact for this node set.


## AD5 addendum - detailed AS-BUILT runtime sequence

Owner requested a UML sequence view matching the supplied reference style. A source-backed companion Lucidchart was created and linked from Page 2 of the primary architecture pack.

- Sequence document ID: `66ba9fb3-c567-40b0-9c06-1b40ade57daf`
- Edit URL: `https://lucid.app/lucidchart/66ba9fb3-c567-40b0-9c06-1b40ade57daf/edit`
- Main pack Page 2 now contains a clickable `AS-BUILT DETAILED SEQUENCE DIAGRAM` block.
- Sequence is grounded in `app/api/chat/route.ts`, `src/server/chat.ts`, `src/core/route.ts`, `src/core/policy.ts`, `src/product/conversation.ts`, and `src/provider/openrouter.ts`.
- No runtime source or deployment configuration changed.

Graph node: `AD5-as-built-runtime-sequence`.
