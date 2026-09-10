import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cadre } from "../../src/config/cadre";

const directory = path.resolve("extension/dist");
const config = JSON.parse(readFileSync("extension/config.json", "utf8"));
const manifest = JSON.parse(readFileSync(path.join(directory, "manifest.json"), "utf8"));
const files = readdirSync(directory, { recursive: true, withFileTypes: true }).filter((file) => file.isFile()).map((file) => path.join(file.parentPath, file.name));

describe("generated extension manifest and public output", () => {
  it("declares only fixed API host access and the two exact content-script sites", () => {
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBe("Donna — Cadre AI Local Preview");
    expect(manifest.permissions).toBeUndefined();
    expect(manifest.externally_connectable).toBeUndefined();
    expect(manifest.host_permissions).toEqual([`${new URL(config.apiEndpoint).origin}/*`]);
    expect(manifest.content_scripts).toEqual([{ matches: ["https://cadre.ai/*", "https://www.cadre.ai/*"], js: ["content-script.js"], run_at: "document_idle", world: "ISOLATED", all_frames: false, match_about_blank: false }]);
  });
  it("exposes only the panel document to exact Cadre sites, not its message bridge", () => {
    expect(manifest.web_accessible_resources).toEqual([{ resources: ["panel.html"], matches: ["https://cadre.ai/*", "https://www.cadre.ai/*"] }]);
    expect(manifest.content_security_policy.extension_pages).toContain(`connect-src ${new URL(config.apiEndpoint).origin};`);
    expect(manifest.content_security_policy.extension_pages).toContain("script-src 'self';");
    expect(manifest.content_security_policy.extension_pages).not.toMatch(/unsafe-eval|unsafe-inline/);
  });
  it("keeps executable files local and excludes secrets/provider config/storage APIs", () => {
    expect(files).toHaveLength(15);
    expect(manifest.icons).toEqual({ "16": "icons/icon16.png", "32": "icons/icon32.png", "48": "icons/icon48.png", "128": "icons/icon128.png" });
    const textFiles = files.filter((file) => /\.(?:js|html|css|json)$/u.test(file));
    for (const file of textFiles) {
      const text = readFileSync(file, "utf8");
      expect(text, path.relative(directory, file)).not.toMatch(/sk-or-v1-[a-f0-9]{32,}|OPENROUTER_API_KEY|process\.env|chrome\.storage|localStorage|sessionStorage|document\.cookie|eval\s*\(|innerHTML\s*=/iu);
      expect(text, path.relative(directory, file)).not.toMatch(/from\s+["'](?:https?:|.*(?:provider|server)\/)/u);
    }
    expect(readFileSync(path.join(directory, "panel.html"), "utf8")).not.toMatch(/<script[^>]+src=["']https?:/iu);
  });
  it("generates display topics and exact links from the canonical Cadre config", () => {
    const generated = readFileSync(path.join(directory, "config.js"), "utf8");
    const presentation = JSON.parse(generated.match(/export const PRESENTATION = (.*);/u)![1]!);
    expect(presentation.topics).toEqual(cadre.knowledge.map(({ topic, label }) => ({ topic, label })));
    expect(presentation.links).toEqual([...new Map([cadre.contact, ...cadre.knowledge.flatMap((topic) => topic.approvedLinks)].map((link) => [link.url, link])).values()]);
    expect(presentation).not.toHaveProperty("facts");
    expect(presentation).not.toHaveProperty("boundaries");
  });
  it("includes the delegated AI Maturity Index portal link while restricting activation to exact Cadre sites", () => {
    const generated = readFileSync(path.join(directory, "config.js"), "utf8");
    const presentation = JSON.parse(generated.match(/export const PRESENTATION = (.*);/u)![1]!);
    const portalLink = [cadre.contact, ...cadre.knowledge.flatMap((topic) => topic.approvedLinks)].find((link) => link.url === "https://portal.gocadre.ai/ai-maturity-index");
    expect(portalLink).toBeDefined();
    expect(presentation.links).toContainEqual(portalLink);
    expect(manifest.content_scripts).toEqual([{ matches: ["https://cadre.ai/*", "https://www.cadre.ai/*"], js: ["content-script.js"], run_at: "document_idle", world: "ISOLATED", all_frames: false, match_about_blank: false }]);
  });
  it("copies core limits and safe conversation utilities rather than a second chatbot policy", () => {
    const code = readFileSync(path.join(directory, "shared/conversation.js"), "utf8");
    expect(code).toContain('from "./limits.js"');
    expect(code).toContain("buildRequestHistory");
    expect(code).toContain("approvedTextParts");
    expect(code).toContain("readReply");
    expect(readFileSync(path.join(directory, "shared/limits.js"), "utf8")).toContain("maxMessages: 20");
  });
});
