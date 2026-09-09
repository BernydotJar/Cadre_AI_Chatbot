// Graph adapter — canonical execution-node definitions for Cadre AI Chatbot.
// Source of truth for WHAT each node is remains specs/001-support-chatbot/;
// this module re-expresses those approved definitions (IDs, dependencies,
// boundaries unchanged) in the shape required by graph-harness.project.v1.
// It is process tooling: it must never be imported by application code.

export const PROJECT_ID = "cadre-ai-chatbot";
export const MODE = "MVP";

export const GATE_DEFINITIONS = [
  { id: "verification", required_evidence_kinds: ["test_output"], blocking: true },
  { id: "code-review", required_evidence_kinds: ["review_report"], blocking: true },
  { id: "deploy-check", required_evidence_kinds: ["deploy_check"], blocking: true },
  { id: "release-check", required_evidence_kinds: ["live_eval", "package_check"], blocking: true },
];

// Every node starts at spec_ready. Approval, transitions, and completion are
// recorded ONLY through the pinned graph-harness CLI against the event ledger.
export const NODES = [
  {
    id: "N1-foundation",
    kind: "feature-increment",
    title: "Application foundation (local)",
    status: "spec_ready",
    depends_on: [],
    capability: "engineering",
    gates: { done: ["verification", "code-review"] },
    allowed_paths: [
      "package.json", "package-lock.json", "tsconfig.json", "next.config.ts",
      "eslint.config.mjs", "vitest.config.ts", ".gitignore", ".env.example",
      "app/**", "src/**", "tests/**", "tools/graph-adapter/**", "CLAUDE.md", "README.md",
    ],
    metadata: { alias: "N1", spec: "specs/001-support-chatbot/tasks.md" },
  },
  {
    id: "N2-knowledge-routing",
    kind: "feature-increment",
    title: "Knowledge base and routing",
    status: "spec_ready",
    depends_on: ["N1-foundation"],
    capability: "engineering",
    gates: { done: ["verification", "code-review"] },
    allowed_paths: ["src/config/**", "src/core/**", "tests/**"],
    metadata: { alias: "N2", spec: "specs/001-support-chatbot/tasks.md" },
  },
  {
    id: "N3-chat-api-adapter",
    kind: "feature-increment",
    title: "Chat API and provider adapter",
    status: "spec_ready",
    depends_on: ["N1-foundation", "N2-knowledge-routing"],
    capability: "engineering",
    gates: { done: ["verification", "code-review"] },
    allowed_paths: ["src/provider/**", "src/server/**", "app/api/**", "tests/**", ".env.example"],
    metadata: { alias: "N3", spec: "specs/001-support-chatbot/tasks.md" },
  },
  {
    id: "N4-ui",
    kind: "feature-increment",
    title: "Conversation UI and UX states",
    status: "spec_ready",
    depends_on: ["N3-chat-api-adapter"],
    capability: "engineering",
    gates: { done: ["verification", "code-review"] },
    allowed_paths: ["app/**", "src/ui/**", "e2e/**", "playwright.config.ts"],
    metadata: { alias: "N4", spec: "specs/001-support-chatbot/tasks.md" },
  },
  {
    id: "N5-deploy",
    kind: "feature-increment",
    title: "Early deployment (authorization-gated)",
    status: "spec_ready",
    depends_on: ["N1-foundation"],
    capability: "engineering",
    gates: { done: ["verification", "deploy-check"] },
    allowed_paths: ["docs/deploy.md", "next.config.ts"],
    metadata: {
      alias: "N5",
      spec: "specs/001-support-chatbot/tasks.md",
      authorization: "Deployment target/account decision (U3) required before any deploy work.",
    },
  },
  {
    id: "N6-verify-release",
    kind: "feature-increment",
    title: "Verification, packaging, release readiness",
    status: "spec_ready",
    depends_on: ["N4-ui", "N5-deploy"],
    capability: "engineering",
    gates: { done: ["verification", "code-review", "release-check"] },
    allowed_paths: ["docs/**", "README.md", "evidence/**"],
    metadata: {
      alias: "N6",
      spec: "specs/001-support-chatbot/tasks.md",
      authorization: "Live evaluation requires provider (U1) and spend envelope (U2).",
    },
  },
];

export function buildProject() {
  return {
    schema_version: "graph-harness.project.v1",
    project_id: PROJECT_ID,
    mode: MODE,
    gate_definitions: GATE_DEFINITIONS,
    nodes: NODES,
  };
}
