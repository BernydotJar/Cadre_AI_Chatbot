# Chatbot productization authorization

On 2026-09-09 the owner explicitly requested that the completed Cadre chatbot be productized and modularized so the same chatbot engine and infrastructure can be reused by attaching an English-language persona/profile. The first production profile is named **Donna**. The owner asked for a slightly more proactive assistant: useful beyond information retrieval, but bounded to only one justified step forward.

## Authorized increment

- Separate reusable client knowledge/boundaries from persona behavior and UI/experience copy.
- Introduce validated, named product profiles that compose a client configuration, persona profile, and experience profile.
- Make the active profile allowlisted/configurable, with the Cadre + Donna profile as the safe default.
- Implement Donna as an original project-owned persona: concise, perceptive, calm, confident, lightly witty, and never an impersonation of a copyrighted character.
- Permit at most one deterministic, client-approved proactive next step after a grounded answer. No autonomous action, arbitrary advice, new facts, invented urgency, pricing, guarantees, or private/account behavior.
- Prove reuse with a second configuration/profile fixture and regression tests showing that persona changes do not alter facts, links, routing, provider authority, or safety boundaries.
- Refactor the web shell/metadata so Cadre-specific experience copy lives in configuration rather than generic UI logic.

## Boundaries

The existing bounded provider contract remains intact: the live model selects approved fact ordering only and does not gain authority to generate new factual content or arbitrary calls to action. Existing client knowledge provenance, link allowlisting, deterministic policy boundaries, no-account-access behavior, and provider fail-closed rules remain unchanged.

This increment authorizes source, tests, documentation, local verification, and deployment to the already-authorized existing Vercel project after gates pass. It does not authorize a replacement project, new paid services, arbitrary external actions, real email delivery, recruiting submission, Chrome Web Store publication, or bypassing the dedicated audited Git publication control.
