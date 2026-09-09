# Specification index and approval status

The three original specification files are retained byte-for-byte as the scope that was approved. Their draft status headers are historical, not a new request for approval. The first graph events record the owner's approval; execution state comes from replay, not those headings.

- [Requirements](requirements.md): scenarios S1-S6 and acceptance criteria AC1-AC10.
- [Design](design.md): architecture, bounds and frozen evaluation categories.
- [Tasks](tasks.md): N1-N6 dependencies and file boundaries.
- [Current authorization amendment](../../progress/authorization-2026-09-08.md): small local commits, bounded OpenRouter inference and confirmed Vercel deployment authority; no final closure or submission yet.
- [Provider implementation decision](../../progress/provider-decision.md): model, constrained answers and budget controls.

Implementation refinement: the knowledge set groups verified facts into six scenario-oriented topic entries, rather than manufacturing 20-40 near-duplicate entries to meet the design's initial corpus-size estimate. Scenario coverage and provenance are the acceptance targets. This does not claim broad natural-language coverage or production multi-client reuse.

Process-tooling scope includes the thin pinned-runtime command adapter and sanitized local verification runner under `tools/graph-adapter/`. They do not replace the upstream runtime or introduce runtime dependencies into the deployed application.
