import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { evaluatePremiumRelease } from "../../tools/release/check-premium-gate.mjs";

const dirs: string[] = [];

function fixture(nodes: string[], events: object[]) {
  const dir = mkdtempSync(join(tmpdir(), "cadre-release-gate-"));
  dirs.push(dir);
  const project = join(dir, "project.json");
  const ledger = join(dir, "events.jsonl");
  writeFileSync(project, JSON.stringify({ nodes: nodes.map((id) => ({ id })) }));
  writeFileSync(ledger, events.map((event) => JSON.stringify(event)).join("\n") + "\n");
  return { project, ledger };
}

afterEach(() => {
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe("premium production release gate", () => {
  it("passes for source revisions that predate the premium graph", () => {
    const missing = join(tmpdir(), `missing-${Date.now()}.json`);
    expect(evaluatePremiumRelease(missing, missing)).toEqual({
      ok: true,
      reason: "no premium graph is present in this source revision",
    });
  });

  it("fails closed while any premium node is incomplete", () => {
    const { project, ledger } = fixture(["PX2", "PX3"], [
      { event_type: "node.transitioned", node_id: "PX2", payload: { to: "done" } },
      { event_type: "node.transitioned", node_id: "PX3", payload: { to: "review" } },
    ]);
    const result = evaluatePremiumRelease(project, ledger);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("PX3");
  });

  it("fails closed when the latest recorded gate is not PASS", () => {
    const { project, ledger } = fixture(["PX2"], [
      { event_type: "gate.evaluated", node_id: "PX2", payload: { gate_id: "design-review", result: "BLOCKED" } },
      { event_type: "node.transitioned", node_id: "PX2", payload: { to: "done" } },
    ]);
    const result = evaluatePremiumRelease(project, ledger);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("design-review=BLOCKED");
  });

  it("fails closed when a previously DONE node is invalidated after deployment evidence", () => {
    const { project, ledger } = fixture(["PX5"], [
      { event_type: "gate.evaluated", node_id: "PX5", payload: { gate_id: "integration-proof", result: "PASS" } },
      { event_type: "node.transitioned", node_id: "PX5", payload: { to: "done" } },
      { event_type: "failure.recorded", node_id: "PX5", payload: { gate_id: "integration-proof", reason: "public browser failure" } },
      { event_type: "node.invalidated", node_id: "PX5", payload: { reason: "public browser failure" } },
    ]);
    const result = evaluatePremiumRelease(project, ledger);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("incomplete nodes: PX5");
    expect(result.reason).toContain("integration-proof=FAIL");
  });

  it("passes again only after the invalidated node is repaired, re-gated, and DONE", () => {
    const { project, ledger } = fixture(["PX5"], [
      { event_type: "gate.evaluated", node_id: "PX5", payload: { gate_id: "integration-proof", result: "PASS" } },
      { event_type: "node.transitioned", node_id: "PX5", payload: { to: "done" } },
      { event_type: "failure.recorded", node_id: "PX5", payload: { gate_id: "integration-proof", reason: "public browser failure" } },
      { event_type: "node.invalidated", node_id: "PX5", payload: { reason: "public browser failure" } },
      { event_type: "node.transitioned", node_id: "PX5", payload: { to: "running" } },
      { event_type: "gate.evaluated", node_id: "PX5", payload: { gate_id: "integration-proof", result: "PASS" } },
      { event_type: "node.transitioned", node_id: "PX5", payload: { to: "done" } },
    ]);
    expect(evaluatePremiumRelease(project, ledger).ok).toBe(true);
  });

  it("passes only after every premium node is DONE and active gates pass", () => {
    const { project, ledger } = fixture(["PX2", "PX3"], [
      { event_type: "gate.evaluated", node_id: "PX2", payload: { gate_id: "design-review", result: "PASS" } },
      { event_type: "node.transitioned", node_id: "PX2", payload: { to: "done" } },
      { event_type: "gate.evaluated", node_id: "PX3", payload: { gate_id: "verification", result: "PASS" } },
      { event_type: "node.transitioned", node_id: "PX3", payload: { to: "done" } },
    ]);
    expect(evaluatePremiumRelease(project, ledger).ok).toBe(true);
  });
});
