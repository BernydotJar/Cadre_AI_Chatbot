// Load only trusted repository TypeScript for offline/evaluation commands.
// Not a request-time loader and never accepts a user-supplied source path.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname, relative } from 'node:path';
import ts from 'typescript';
const root = process.cwd();
const require = createRequire(resolve(root, 'package.json'));
const modules = new Map();
export function loadTs(file) {
  const absolute = resolve(root, file);
  if (!relative(resolve(root, 'src'), absolute).startsWith('..') && absolute.endsWith('.ts')) {
    if (modules.has(absolute)) return modules.get(absolute).exports;
    const loaded = { exports: {} };
    modules.set(absolute, loaded);
    const compiled = ts.transpileModule(readFileSync(absolute, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    new Function('require', 'module', 'exports', compiled)(name => name.startsWith('.')
      ? loadTs(resolve(dirname(absolute), `${name}.ts`)) : name.startsWith('@/')
        ? loadTs(resolve(root, 'src', `${name.slice(2)}.ts`)) : require(name), loaded, loaded.exports);
    return loaded.exports;
  }
  throw Error('Evaluation loader is restricted to local src TypeScript.');
}
