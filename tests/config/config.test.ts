import { describe, expect, it } from "vitest";
import { cadre } from "@/config/cadre";
import { acme } from "@/config/fixtures/acme";
import { validateClientConfig } from "@/config/types";
import { respond } from "@/core/policy";

describe("client config invariants", () => {
  it("Cadre config validates with unique topics and on-domain links", () => {
    expect(() => validateClientConfig(cadre)).not.toThrow();
    const links = [
      cadre.contact,
      ...cadre.knowledge.flatMap((entry) => entry.approvedLinks),
      ...(cadre.publicHighlights ?? []).flatMap((highlight) => highlight.link ? [highlight.link] : []),
    ];
    for (const link of links) {
      expect(new URL(link.url).hostname).toBe("cadre.ai");
    }
  });

  it("every knowledge entry declares provenance", () => {
    for (const entry of cadre.knowledge) {
      expect(entry.source.origin.length).toBeGreaterThan(0);
    }
  });

  it("both client configurations provide the required clarification labels", () => {
    for (const config of [cadre, acme]) {
      expect(() => validateClientConfig(config)).not.toThrow();
      for (const entry of config.knowledge) expect(entry.label.trim()).not.toBe("");
      const missingLabel = structuredClone(config);
      missingLabel.knowledge[0]!.label = "";
      expect(() => validateClientConfig(missingLabel)).toThrow();
    }
  });

  it("rejects an approved link on a foreign domain", () => {
    const bad = structuredClone(cadre);
    bad.knowledge[0]!.approvedLinks.push({
      label: "Evil",
      url: "https://evil.example/steal",
    });
    expect(() => validateClientConfig(bad)).toThrow(/official domain/);
  });


  it("keeps verified public highlights client-owned and on the official domain", () => {
    expect(cadre.publicHighlights?.map((item) => item.id)).toContain("track-ai-results");
    expect(cadre.publicHighlights?.find((item) => item.id === "track-ai-results")?.body)
      .toContain("tools, agents, training, and results");
    const bad = structuredClone(cadre);
    bad.publicHighlights![0]!.link = { label: "Foreign", url: "https://evil.example/results" };
    expect(() => validateClientConfig(bad)).toThrow(/official domain/);
  });

  it("requires every pricing trigger to remain inside the decline boundary", () => {
    const bad = structuredClone(cadre);
    bad.boundaries.pricingTopics.push("not-a-decline-trigger");
    expect(() => validateClientConfig(bad)).toThrow(/must also exist in declineTopics/);
  });

  it("rejects duplicate topics", () => {
    const bad = structuredClone(cadre);
    bad.knowledge.push({ ...bad.knowledge[0]!, id: "copy" });
    expect(() => validateClientConfig(bad)).toThrow(/duplicate topic/);
  });
});

describe("reuse hypothesis — the same core serves a second configuration", () => {
  it("answers a fixture-client question purely from its config", () => {
    const reply = respond(
      [{ role: "user", content: "Do you offer ski repair services?" }],
      acme,
    );
    expect(reply.kind).toBe("grounded");
    expect(reply.text).toContain("gear repair");
    for (const link of reply.links) {
      expect(link.url.startsWith("https://acme-outdoors.example")).toBe(true);
    }
    expect(JSON.stringify(reply)).not.toContain("cadre.ai");
  });

  it("applies the fixture client's own boundaries", () => {
    const reply = respond(
      [{ role: "user", content: "What's the status of my order?" }],
      acme,
    );
    expect(reply.kind).toBe("redirect");
    expect(reply.links).toEqual([acme.contact]);
    expect(reply.text).toContain("won't ask for account details");
  });

  it.each(["store services", "the first one", "returns and exchanges", "the second one"])(
    "resolves fixture-client clarifications with the same core: %s",
    (selection) => {
      const question = { role: "user" as const, content: "repair return" };
      const first = respond([question], acme);
      expect(first.kind).toBe("clarify");
      const reply = respond([
        question,
        { role: "assistant", content: first.text },
        { role: "user", content: selection },
      ], acme);
      expect(reply.kind).toBe("grounded");
      const expected = selection === "store services" || selection === "the first one"
        ? "gear repair" : "within 60 days";
      expect(reply.text).toContain(expected);
      expect(JSON.stringify(reply)).not.toMatch(/Cadre|cadre\.ai/);
    },
  );
});
