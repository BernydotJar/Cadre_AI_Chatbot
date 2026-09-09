import { readFile, mkdir, writeFile, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const extension = path.join(root, "extension");
const output = path.join(extension, "dist");
const config = JSON.parse(await readFile(path.join(extension, "config.json"), "utf8"));
if (Object.keys(config).sort().join() !== "apiEndpoint,name,siteOrigins,version"
  || config.name !== "Cadre AI Assistant — Integration Preview" || !/^\d+\.\d+\.\d+$/u.test(config.version)
  || JSON.stringify(config.siteOrigins) !== JSON.stringify(["https://cadre.ai", "https://www.cadre.ai"])) throw new Error("Unexpected extension configuration");
const endpoint = new URL(config.apiEndpoint);
if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password || endpoint.port
  || !/^[a-z0-9-]+\.vercel\.app$/u.test(endpoint.hostname) || endpoint.pathname !== "/api/chat"
  || endpoint.search || endpoint.hash) throw new Error("Endpoint must be a fixed HTTPS Vercel chat URL");

// Read literal client data using the compiler AST, never execute the config or
// import server/provider modules. Refuse future executable configuration shapes.
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map((property) => {
    if (!ts.isPropertyAssignment(property) || (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name))) throw new Error("Only literal configuration properties are supported");
    return [property.name.text, literal(property.initializer)];
  }));
  throw new Error("Non-literal client config requires explicit build review");
}
const configSource = ts.createSourceFile("cadre.ts", await readFile(path.join(root, "src/config/cadre.ts"), "utf8"), ts.ScriptTarget.Latest, true);
let client;
for (const statement of configSource.statements) if (ts.isVariableStatement(statement)) {
  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name) && declaration.name.text === "cadreConfig" && declaration.initializer) client = literal(declaration.initializer);
  }
}
if (!client || !Array.isArray(client.knowledge) || client.knowledge.length !== 6) throw new Error("Expected six approved topics");
const links = [...new Map([client.contact, ...client.knowledge.flatMap((entry) => entry.approvedLinks)].map((link) => [link.url, link])).values()];
if (links.some((link) => typeof link.label !== "string" || new URL(link.url).origin !== "https://cadre.ai")) throw new Error("Unexpected approved link");
const presentation = { botName: client.botName, topics: client.knowledge.map(({ label, topic }) => ({ label, topic })), links };

await mkdir(path.join(output, "shared"), { recursive: true });
const sources = [
  ["extension/src/shared/contracts.ts", "shared/contracts.js"],
  ["extension/src/shared/bridge.ts", "shared/bridge.js"],
  ["src/core/limits.ts", "shared/limits.js"],
  ["src/ui/conversation.ts", "shared/conversation.js"],
  ["extension/src/service-worker.ts", "service-worker.js"],
  ["extension/src/panel/panel.ts", "panel.js"],
];
for (const [sourcePath, destination] of sources) {
  let source = await readFile(path.join(root, sourcePath), "utf8");
  const replacements = sourcePath.endsWith("panel.ts")
    ? { "../../../src/core/limits": "./shared/limits.js", "../../../src/ui/conversation": "./shared/conversation.js", "../generated-config": "./config.js", "../shared/contracts": "./shared/contracts.js" }
    : { "../../../src/core/limits": "./limits.js", "../../../src/ui/conversation": "./conversation.js", "@/core/limits": "./limits.js", "./generated-config": "./config.js", "./shared/contracts": "./shared/contracts.js", "./shared/bridge": "./shared/bridge.js", "./contracts": "./contracts.js" };
  for (const [from, to] of Object.entries(replacements)) source = source.replaceAll(`"${from}"`, `"${to}"`);
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022, strict: true }, reportDiagnostics: true });
  if (compiled.diagnostics?.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)) throw new Error(`Transpile failed: ${sourcePath}`);
  await writeFile(path.join(output, destination), compiled.outputText);
}
const contentSource = await readFile(path.join(extension, "src/content-script.ts"), "utf8");
const content = ts.transpileModule(contentSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replace(/export \{\};?\s*$/u, "");
await writeFile(path.join(output, "content-script.js"), `(() => {\nconst PREVIEW_SITE_ORIGINS = ${JSON.stringify(config.siteOrigins)};\n${content}\n})();\n`);
await writeFile(path.join(output, "config.js"), `export const API_ENDPOINT = ${JSON.stringify(config.apiEndpoint)};\nexport const SITE_ORIGINS = ${JSON.stringify(config.siteOrigins)};\nexport const PRESENTATION = ${JSON.stringify(presentation)};\n`);
for (const [source, destination] of [["panel.html", "panel.html"], ["panel.css", "panel.css"]]) await copyFile(path.join(extension, "src/panel", source), path.join(output, destination));
const matches = config.siteOrigins.map((origin) => `${origin}/*`);
const manifest = {
  manifest_version: 3, name: config.name, version: config.version,
  description: "Independent local integration preview for the grounded Cadre AI assistant.",
  minimum_chrome_version: "114",
  host_permissions: [`${endpoint.origin}/*`],
  background: { service_worker: "service-worker.js", type: "module" },
  content_scripts: [{ matches, js: ["content-script.js"], run_at: "document_idle", world: "ISOLATED", all_frames: false, match_about_blank: false }],
  web_accessible_resources: [{ resources: ["panel.html"], matches }],
  content_security_policy: { extension_pages: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src ${endpoint.origin}; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors https://cadre.ai https://www.cadre.ai` },
};
await writeFile(path.join(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Extension generated: ${path.relative(root, output)} (11 files; no provider config or credentials read)`);
