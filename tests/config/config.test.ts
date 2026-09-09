import { describe, expect, it } from "vitest";
import { cadre } from "@/config/cadre";
import { acme } from "@/config/fixtures/acme";
import { validateClientConfig } from "@/config/types";
import { respond } from "@/core/policy";

describe("client config invariants", () => {
  it("Cadre config validates with unique topics and on-domain links", () => {
    expect(() => validateClientConfig(cadre)).not.toThrow();
    const links = [cadre.contact, ...cadre.knowledge.flatMap((entry) => entry.approvedLinks)];
    for (const link of links) {
      expect(new URL(link.url).hostname).toBe("cadre.ai");
    }
  });

  it("every knowledge entry declares provenance", () => {
    for (const entry of cadre.knowledge) {
      expect(entry.source.origin.length).toBeGreaterThan(0);
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
});
