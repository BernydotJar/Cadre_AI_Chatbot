// Run real local checks, retaining sanitized outputs without overwriting evidence.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const label = process.argv[2];
if (!label || !/^[A-Za-z0-9_-]+$/.test(label)) throw new Error('Pass a unique evidence run label using letters, numbers, underscores or hyphens.');
const directory = resolve(root, 'evidence', 'runs', label);
if (existsSync(directory)) throw new Error('Evidence run already exists; use a new label.');
mkdirSync(directory, { recursive: true });
const sanitize = (value) => value.replaceAll(root.replace(/\/$/, ''), '<PROJECT>').replace(/\x1b\[[0-9;]*m/g, '').replace(/sk-or-v1-[a-zA-Z0-9_-]+/g, '<REDACTED>');
const checks = process.argv.includes('--quick') ? ['test', 'typecheck', 'lint'] : ['test', 'typecheck', 'lint', 'build'];
const results = [];
for (const check of checks) {
  const result = spawnSync('npm', ['run', check], { cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024, env: { ...process.env, CHAT_PROVIDER: 'mock', NO_COLOR: '1', NEXT_TELEMETRY_DISABLED: '1' } });
  const exit = result.status ?? 1;
  const output = `Command: npm run ${check}\nMode: mock (no inference)\nExit: ${exit}\n\n${sanitize((result.stdout || '') + (result.stderr || '') + (result.error?.message || ''))}`;
  writeFileSync(resolve(directory, `${check}.txt`), output.replace(/\r/g, '').replace(/[ \t]+$/gm, '').trimEnd() + '\n', { flag: 'wx' });
  results.push({ check, exit });
  console.log(`${check}: ${exit === 0 ? 'PASS' : 'FAIL'} (evidence/runs/${label}/${check}.txt)`);
}
writeFileSync(resolve(directory, 'summary.json'), JSON.stringify({ timestamp: new Date().toISOString(), mode: 'mock', results }, null, 2) + '\n', { flag: 'wx' });
process.exit(results.some(({ exit }) => exit !== 0) ? 1 : 0);
