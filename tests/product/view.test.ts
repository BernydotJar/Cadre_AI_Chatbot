import { describe, expect, it } from "vitest";
import { cadreDonna } from "@/product/profiles/cadre-donna";
import { acmeScout } from "@/product/fixtures/acme-scout";
import { chatExperience } from "@/product/view";

describe("profile-driven chat experience projection", () => {
  it("projects Donna presentation without exposing facts or persona operating rules", () => {
    const view = chatExperience(cadreDonna);
    expect(view.clientName).toBe("Cadre AI");
    expect(view.experience.assistantLabel).toBe("Donna");
    expect(view.experience.avatar.style).toBe("signal-orb");
    expect(view.experience.avatar.monogram).toBe("D");
    expect(view.experience.copy.composerPlaceholder).toBe("What are you trying to figure out?");
    expect(view.experience.ambientMedia).toEqual({
      posterSrc: "/media/donna-ambient-poster.webp",
      videoSrc: "/media/donna-ambient-loop.mp4",
      durationSeconds: 8,
    });
    expect(view.topics).toHaveLength(cadreDonna.client.knowledge.length);
    expect(view.experience.quickPrompts).toHaveLength(4);
    expect(view.publicHighlights.some((highlight) => highlight.id === "track-ai-results")).toBe(true);
    expect(Object.keys(view)).not.toContain("knowledge");
    expect(Object.keys(view)).not.toContain("persona");
  });

  it("renders a second product projection with no Cadre presentation leakage", () => {
    const view = chatExperience(acmeScout);
    const serialized = JSON.stringify(view);
    expect(view.clientName).toBe("Acme Outdoors");
    expect(view.experience.assistantLabel).toBe("Scout");
    expect(view.experience.avatar.monogram).toBe("S");
    expect(view.topics.map((topic) => topic.label)).toEqual(["store services", "returns and exchanges"]);
    expect(view.experience.ambientMedia).toBeUndefined();
    expect(serialized).not.toMatch(/Cadre|Donna|cadre\.ai/i);
  });
});
