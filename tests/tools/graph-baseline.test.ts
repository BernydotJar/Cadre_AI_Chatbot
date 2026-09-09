import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";

const repoRoot = resolve(__dirname, "..", "..");
const projectPath = resolve(repoRoot, "graph-harness.project.json");
const eventsPath = resolve(repoRoot, "graph-harness.events.jsonl");
const featureListPath = resolve(repoRoot, "feature_list.json");

const nodeStatuses = [
  "pending",
  "spec_ready",
  "approved",
  "ready",
  "running",
  "review",
  "done",
  "blocked",
  "repair_required",
  "superseded",
] as const;

const projectSchema = z.object({
  schema_version: z.literal("graph-harness.project.v1"),
  project_id: z.string().min(1),
  mode: z.enum(["MVP", "SHIP"]),
  gate_definitions: z
    .array(
      z.object({
        id: z.string().min(1),
        required_evidence_kinds: z.array(z.string().min(1)),
        blocking: z.boolean(),
      }),
    )
    .min(1),
  nodes: z
    .array(
      z.object({
        id: z.string().min(1),
        kind: z.string().min(1),
        title: z.string().min(1),
        status: z.enum(nodeStatuses),
        depends_on: z.array(z.string().min(1)),
        capability: z.string().min(1),
        gates: z.record(z.string(), z.array(z.string().min(1))),
        allowed_paths: z.array(z.string().min(1)),
        metadata: z.record(z.string(), z.unknown()),
      }),
    )
    .min(1),
});

function loadProject() {
  return projectSchema.parse(
    JSON.parse(readFileSync(projectPath, "utf8")),
  );
}

describe("graph baseline (frozen execution definition)", () => {
  it("conforms to the graph-harness.project.v1 shape", () => {
    expect(() => loadProject()).not.toThrow();
  });

  it("initializes every node at spec_ready — no fabricated progress in the baseline", () => {
    const project = loadProject();
    for (const node of project.nodes) {
      expect(node.status).toBe("spec_ready");
    }
  });

  it("matches the canonical node inventory in feature_list.json", () => {
    const project = loadProject();
    const featureList = JSON.parse(readFileSync(featureListPath, "utf8"));
    const canonicalIds = featureList.features[0].nodes.map(
      (node: { id: string }) => node.id,
    );
    expect(project.nodes.map((node) => node.id)).toEqual(canonicalIds);
  });

  it("references only defined gates and known dependencies, acyclically", () => {
    const project = loadProject();
    const gateIds = new Set(project.gate_definitions.map((gate) => gate.id));
    const nodeIds = new Set(project.nodes.map((node) => node.id));
    const dependsOn = new Map(
      project.nodes.map((node) => [node.id, node.depends_on]),
    );

    for (const node of project.nodes) {
      for (const gates of Object.values(node.gates)) {
        for (const gateId of gates) {
          expect(gateIds.has(gateId)).toBe(true);
        }
      }
      for (const dependency of node.depends_on) {
        expect(nodeIds.has(dependency)).toBe(true);
        expect(dependency).not.toBe(node.id);
      }
    }

    const visited = new Set<string>();
    const visiting = new Set<string>();
    const visit = (id: string) => {
      expect(visiting.has(id)).toBe(false);
      if (visited.has(id)) return;
      visiting.add(id);
      for (const dependency of dependsOn.get(id) ?? []) visit(dependency);
      visiting.delete(id);
      visited.add(id);
    };
    for (const id of nodeIds) visit(id);
  });

  it("refuses to regenerate the baseline once the event ledger exists", () => {
    if (!existsSync(eventsPath)) {
      // Before bootstrap the generator may run; the freeze only applies afterward.
      return;
    }
    expect(readFileSync(eventsPath, "utf8").trim().length).toBeGreaterThan(0);
    let exitCode = 0;
    try {
      execFileSync("node", ["tools/graph-adapter/generate.mjs"], {
        cwd: repoRoot,
        stdio: "pipe",
      });
    } catch (error) {
      exitCode = (error as { status?: number }).status ?? -1;
    }
    expect(exitCode).toBe(2);
  });
});
