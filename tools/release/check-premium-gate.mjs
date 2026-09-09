import { existsSync, readFileSync } from "node:fs";

const projectPath = process.argv[2] ?? "progress/premium-graph.project.json";
const eventsPath = process.argv[3] ?? "progress/premium-graph.events.jsonl";

export function evaluatePremiumRelease(projectFile, eventsFile) {
  if (!existsSync(projectFile)) {
    return { ok: true, reason: "no premium graph is present in this source revision" };
  }

  if (!existsSync(eventsFile)) {
    return { ok: false, reason: "premium graph exists but its event ledger is missing" };
  }

  const project = JSON.parse(readFileSync(projectFile, "utf8"));
  const nodeIds = (project.nodes ?? []).map((node) => node.id);
  if (nodeIds.length === 0) {
    return { ok: false, reason: "premium graph declares no nodes" };
  }

  const statuses = new Map();
  const latestBlockingGate = new Map();
  const lines = readFileSync(eventsFile, "utf8").split(/\r?\n/u).filter(Boolean);

  for (const line of lines) {
    const event = JSON.parse(line);
    if (!nodeIds.includes(event.node_id)) continue;

    if (event.event_type === "node.transitioned") {
      statuses.set(event.node_id, event.payload?.to);
    }

    if (event.event_type === "node.invalidated") {
      statuses.set(event.node_id, "repair_required");
    }

    if (event.event_type === "gate.evaluated") {
      latestBlockingGate.set(`${event.node_id}:${event.payload?.gate_id}`, event.payload?.result);
    }

    if (event.event_type === "failure.recorded" && event.payload?.gate_id) {
      latestBlockingGate.set(`${event.node_id}:${event.payload.gate_id}`, "FAIL");
    }
  }

  const incomplete = nodeIds.filter((id) => statuses.get(id) !== "done");
  const nonPassingGates = [...latestBlockingGate.entries()]
    .filter(([, result]) => result !== "PASS")
    .map(([gate, result]) => `${gate}=${result}`);

  if (incomplete.length > 0 || nonPassingGates.length > 0) {
    const parts = [];
    if (incomplete.length > 0) parts.push(`incomplete nodes: ${incomplete.join(", ")}`);
    if (nonPassingGates.length > 0) parts.push(`non-PASS gates: ${nonPassingGates.join(", ")}`);
    return { ok: false, reason: parts.join("; ") };
  }

  return { ok: true, reason: `all ${nodeIds.length} premium nodes are DONE with no active non-PASS gate` };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = evaluatePremiumRelease(projectPath, eventsPath);
  const prefix = result.ok ? "Premium release gate: PASS" : "Premium release gate: BLOCKED";
  console.log(`${prefix} — ${result.reason}`);
  if (!result.ok) process.exitCode = 1;
}
