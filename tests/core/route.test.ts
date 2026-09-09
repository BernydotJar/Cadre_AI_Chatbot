import { describe, expect, it } from "vitest";
import { cadre } from "@/config/cadre";
import { containsPhrase, normalize, routeMessage } from "@/core/route";

describe("normalize", () => {
  it("lowercases, strips punctuation, and removes diacritics", () => {
    expect(normalize("¿Cuánto CUESTA?!")).toBe("cuanto cuesta");
    expect(normalize("  Hello,   world!  ")).toBe("hello world");
  });
});

describe("containsPhrase", () => {
  it("matches whole words only", () => {
    expect(containsPhrase(normalize("the costume party"), "cost")).toBe(false);
    expect(containsPhrase(normalize("what does it cost"), "cost")).toBe(true);
  });

  it("matches multi-word phrases", () => {
    expect(containsPhrase(normalize("we work with banks"), "work with")).toBe(true);
    expect(containsPhrase(normalize("network with banks"), "work with")).toBe(false);
  });
});

describe("routeMessage over the Cadre knowledge set", () => {
  const cases: Array<[string, string]> = [
    ["What does Cadre AI do?", "overview"],
    ["Do you work with real estate firms?", "industries"],
    ["How do I book a call with an AI strategist?", "strategist-call"],
    ["How do I access the client portal to track my AI tools and agents?", "portal"],
    ["What is the AI Maturity Index and how do I get scored?", "maturity-index"],
    ["How does Cadre approach LLM selection and data security?", "models-security"],
  ];

  for (const [message, topic] of cases) {
    it(`routes "${message}" to ${topic}`, () => {
      const result = routeMessage(message, cadre);
      expect(result.kind).toBe("match");
      if (result.kind === "match") {
        expect(result.entry.topic).toBe(topic);
      }
    });
  }

  it("returns unknown for unrelated text", () => {
    expect(routeMessage("zzz qqq unrelated gibberish", cadre).kind).toBe("unknown");
    expect(routeMessage("please write me a poem about turtles", cadre).kind).toBe("unknown");
  });

  it("returns unknown for empty/whitespace text", () => {
    expect(routeMessage("   ", cadre).kind).toBe("unknown");
  });

  it("reports a tie between topics as ambiguous", () => {
    const result = routeMessage("industry services", cadre);
    expect(result.kind).toBe("ambiguous");
    if (result.kind === "ambiguous") {
      expect(result.candidates.length).toBeGreaterThan(1);
    }
  });
});
