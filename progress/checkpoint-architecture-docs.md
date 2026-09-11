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

Graph Harness is authoritative for AD0-AD5 state; this checkpoint is a resumable projection.

## Terminal Graph state

**COMPLETED.** Architecture/documentation graph sequence 60 is valid with no READY nodes.

- `AD0-freeze-r15-baseline` — DONE; verification PASS.
- `AD1-as-built-architecture` — DONE; design-review PASS; verification PASS.
- `AD2-aws-target-reference` — DONE; design-review PASS; verification PASS.
- `AD3-lucid-architecture-pack` — DONE; design-review PASS; integration-proof PASS.
- `AD4-architecture-handoff` — DONE; verification PASS; integration-proof PASS.
- `AD5-as-built-runtime-sequence` — DONE; verification PASS; design-review PASS; integration-proof PASS.

No application/runtime path changed in this workstream. The editable Lucidchart is the final architecture artifact for this node set.


## AD5 addendum - detailed AS-BUILT runtime sequence

Owner requested a UML sequence view matching the supplied reference style. A source-backed companion Lucidchart was created and linked from Page 2 of the primary architecture pack.

- Sequence document ID: `66ba9fb3-c567-40b0-9c06-1b40ade57daf`
- Edit URL: `https://lucid.app/lucidchart/66ba9fb3-c567-40b0-9c06-1b40ade57daf/edit`
- Main pack Page 2 now contains a clickable `AS-BUILT DETAILED SEQUENCE DIAGRAM` block.
- Sequence is grounded in `app/api/chat/route.ts`, `src/server/chat.ts`, `src/core/route.ts`, `src/core/policy.ts`, `src/product/conversation.ts`, and `src/provider/openrouter.ts`.
- No runtime source or deployment configuration changed.

Graph node: `AD5-as-built-runtime-sequence`.

---

## Documentation continuation terminal checkpoint — 2026-09-11

State: **COMPLETED**

Owner continuation scope delivered:

- AD6 `reference-patterns-and-doc-scope` — DONE
- AD7 `consolidated-lucid-master` — DONE
- AD8 `donna-sdd-r15` — DONE
- AD9 `donna-user-manual-r15` — DONE
- AD10 `documentation-handoff` — DONE

Canonical architecture is now one editable seven-page Lucid document:

- `Donna Architecture Pack - r15`
- `bd103b7c-614d-4e48-9cd0-e5ede867f924`
- Pages: System Context, Runtime & Trust, Component Architecture, Engineering Control Plane, TARGET AWS, Runtime Request Sequence, User Journey & Operating Modes.

Canonical written deliverables:

- `docs/donna-documentation-reference-patterns-r15.md`
- `docs/donna-architecture-pack-r15.md`
- `docs/donna-software-design-document-r15.md`
- `docs/donna-user-manual-r15.md`
- `docs/donna-documentation-pack-r15.md`

Final live non-model smoke at handoff:

- `GET /api/health` — 200 / ok
- `GET /` — 200 / `Ask Donna` present
- deterministic `hello` — 200 / greeting

Truth/quality state:

- Documentation graph validated with 113 events after AD10 closure.
- READY nodes: none.
- Runtime drift from documentation-continuation baseline `87db004a9d5a6b3b1bca7b822547d014aa111ef8`: 0 files under `app/`, `src/`, `extension/`, `integrations/`, `.github/`.
- AD7 critic found and fixed real Lucid legibility defects before release.
- AD10 integration-proof first rejected a `review_report` as the wrong evidence kind; the required `integration_check` was then recorded and the gate passed without weakening the contract.
- Existing application/runtime limitations remain documented and were not converted into new development.

Terminal rationale: all safe, useful, unlocked work inside the owner-authorized documentation scope is complete; further work would either duplicate documentation or open a new runtime/product scope.
