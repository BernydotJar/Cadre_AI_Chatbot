# Donna r15 Documentation Reference Patterns and Scope

Status: **AS-BUILT documentation workstream / reference-only analysis**  
Runtime impact: **NONE**  
Frozen product: Donna PX6 revision 15

## Purpose

This note converts the two owner-supplied Rice conversational-AI documents into documentation patterns for Donna. The Rice documents are used only for structure, review discipline, and handoff conventions. Their implementation facts are not evidence for Donna.

## Reference patterns retained

### 1. Formal SDD as the engineering handoff spine

The reference SDD treats one document as the formal engineering reference for architecture, components, interfaces, data, AI integration, deployment, quality, risks, known documentation gaps, and sign-off. Donna will follow that pattern so a new engineer or reviewer can understand both the product and the operational truth from one canonical technical document.

Donna adaptation:
- document control and revision history;
- purpose, scope, definitions, references;
- product personas and delivered posture;
- architecture drivers and system topology;
- component and source ownership;
- interface/runtime contracts;
- configuration and data/persistence posture;
- provider/AI boundary;
- security and trust boundaries;
- QA, release evidence and live verification;
- non-functional characteristics;
- deployment/release view;
- risk register and known gaps;
- top files, environment/configuration reference and sign-off.

### 2. Truth labelling is a first-class control

The reference material explicitly separates implemented behavior from fallback, draft, and concept behavior. Donna already has a compatible architecture legend and will make the same distinction consistently across the SDD, diagrams, and user manual:

- **AS-BUILT / DEPLOYED** - present in the frozen r15 public runtime and evidence-backed.
- **AS-BUILT / OPTIONAL** - implemented/tested adapter or contract, but outside the normal public runtime path.
- **TARGET / NOT DEPLOYED** - proposed architecture only.
- **OPTIONAL FUTURE** - deliberately deferred enhancement.
- **KNOWN GAP** - documented limitation with no implication that it is already solved.

No document may convert a target, prototype, or optional integration into an AS-BUILT claim by wording alone.

### 3. Architecture is explained by drivers, layers and runtime contracts

The reference SDD does more than draw a topology: it identifies architecture drivers and then maps them to component boundaries and runtime contracts. Donna will use its actual drivers:

- deterministic business authority;
- bounded model authority through `FactSelector`;
- reviewed facts and allowlisted links;
- fail-closed provider/configuration behavior;
- stateless public runtime;
- server-only provider credentials;
- source/configuration ownership separated from presentation;
- exact-SHA/evidence-backed release discipline.

### 4. Guardrails must be written as enforceable behavior

The reference technical proposal presents security and product guardrails in explicit, testable form. Donna documentation will do the same. Important r15 guardrails include request admission limits, deterministic routing for pricing/account/private/unsupported boundaries, strict fact-index selection, reply-length guards, inert text rendering, approved-link projection, and no undisclosed transactional capability.

### 5. Quality claims require evidence, not adjectives

The reference documents combine unit/integration checks, live-evidence rules, measurable Definition of Done, and known-risk disclosure. Donna will retain the same evidence discipline and cite the existing r15 verification record rather than describing the product as "production ready" without qualification.

### 6. Now/Later and WILL/WILL NOT reduce stakeholder ambiguity

For non-engineering readers, the reference proposal uses explicit scope boundaries. Donna will adopt the same presentation where useful:

**Donna r15 WILL**
- answer supported public topics from reviewed client facts;
- return app-owned approved links;
- provide deterministic greetings, clarifications and business-boundary responses;
- use a bounded model adapter only for choosing approved fact indices on grounded topics;
- optionally append one preconfigured diagnostic/proactive question after a grounded answer.

**Donna r15 WILL NOT**
- authenticate users or look up private accounts;
- access CRM/customer records;
- persist cross-session conversation memory;
- send email or perform real handoff delivery from the public chat;
- execute autonomous tools or transactions;
- scrape arbitrary host-page content;
- claim that the AWS target architecture is deployed.

### 7. Handoff must expose gaps as well as strengths

The reference SDD ends with known documentation/operational gaps and cross-references. Donna will likewise retain visible gaps, including the current process-local rate/budget reservation limitation and the GitHub production-CD secret-binding gap, instead of hiding them in implementation notes.

## Canonical Donna documentation set

The continuation workstream produces the following canonical set:

1. **Donna Architecture Pack - r15** - one editable Lucidchart master document.
   - Page 1: AS-BUILT - System Context
   - Page 2: AS-BUILT - Runtime & Trust
   - Page 3: AS-BUILT - Component Architecture
   - Page 4: AS-BUILT - Engineering Control Plane
   - Page 5: TARGET - AWS Reference (NOT DEPLOYED)
   - Page 6: AS-BUILT - Runtime Request Sequence
   - Page 7: AS-BUILT - User Journey & Operating Modes
2. **Donna r15 Software Design Document** - formal technical ownership-transfer document.
3. **Donna r15 User Manual** - end-user operation, supported/unsupported behavior, trust expectations and troubleshooting.
4. **Donna r15 Documentation Pack Index** - authoritative links, release identity, document status and handoff checklist.

## Why a seventh Lucid page is justified

A user-journey/operating-modes page is materially different from the component/runtime views. It lets a non-engineering reader understand what happens when a visitor asks a supported question, asks an account/pricing/private question, needs clarification, or reaches an unsupported topic. It also clearly separates the normal website journey from the optional Chrome preview and n8n handoff prototype. That makes the architecture usable from the user manual without mixing product behavior with implementation topology.

## Review rule for all downstream documentation

For every material statement, ask:

1. Is this an r15 source/evidence fact, a limitation, or a target?
2. Can the wording make a reader believe an optional/target capability is deployed?
3. Does the statement assign authority to the LLM that actually belongs to deterministic code/configuration?
4. Does the document hide a known failure/degraded path?
5. Does the document imply persistence, private-data access, or actions that r15 does not have?

A "yes" to questions 2-5 blocks release of the document until corrected.
