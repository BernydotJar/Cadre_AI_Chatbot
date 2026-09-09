// Generates graph-harness.project.json (graph-harness.project.v1) from the
// canonical node definitions. Regeneration is REFUSED while the event ledger
// is non-empty, and refused when the project file already exists unless
// --force is passed. This guard is tooling discipline, not tamper-proofing:
// the audit trail's integrity relies on the ledger's hash chain and on not
// hand-editing generated files.
//
// Usage: node tools/graph-adapter/generate.mjs [--force]
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildProject } from "./nodes.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const projectPath = resolve(repoRoot, "graph-harness.project.json");
const eventsPath = resolve(repoRoot, "graph-harness.events.jsonl");
const force = process.argv.includes("--force");

if (existsSync(eventsPath) && readFileSync(eventsPath, "utf8").trim().length > 0) {
  console.error(
    "refusing to regenerate: the event ledger is non-empty, so the initial baseline is in use. " +
      "Change node scope only through the documented graph lifecycle.",
  );
  process.exit(2);
}

if (existsSync(projectPath) && !force) {
  console.error(
    "refusing to overwrite existing graph-harness.project.json without --force.",
  );
  process.exit(2);
}

const project = buildProject();
writeFileSync(projectPath, JSON.stringify(project, null, 2) + "\n", "utf8");
console.log(`wrote ${projectPath} (${project.nodes.length} nodes, mode ${project.mode})`);
