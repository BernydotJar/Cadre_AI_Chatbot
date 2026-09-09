// Thin CLI adapter, not a copy of the pinned Graph Harness runtime.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, relative, isAbsolute } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const pin = '6a5f201e2bc640ac46cc0b4b6a3d11b788555664';
const runtime = process.env.GRAPH_HARNESS_RUNTIME;
const args = process.argv.slice(2);
const helpOnly = args.includes('--help') || args.includes('-h');
if (!runtime || !args.length) {
  console.error('Set GRAPH_HARNESS_RUNTIME to the external pinned checkout; pass a CLI command (status, validate, ready, ...).');
  process.exit(2);
}
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: runtime, encoding: 'utf8' }).trim();
if (revision !== pin) throw new Error('Graph Harness revision does not match the documented pin.');
if (execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: runtime, encoding: 'utf8' }).trim()) {
  throw new Error('Graph Harness checkout has tracked modifications.');
}
const eventsPath = resolve(root, 'graph-harness.events.jsonl');
const events = existsSync(eventsPath) ? readFileSync(eventsPath, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];
if (!helpOnly && !['validate', 'status', 'ready'].includes(args[0]) && !args.includes('--expected-last-event-id') && events.length) {
  args.push('--expected-last-event-id', events.at(-1).event_id);
}
if (!helpOnly && args[0] === 'record-evidence') {
  const index = args.indexOf('--artifact');
  if (index < 0 || !args[index + 1]) throw new Error('An existing evidence artifact is required.');
  const artifact = resolve(root, args[index + 1]);
  const localPath = relative(root, artifact);
  if (localPath.startsWith('..') || isAbsolute(localPath) || !existsSync(artifact)) throw new Error('Artifact must exist inside the project.');
  const sha256 = createHash('sha256').update(readFileSync(artifact)).digest('hex');
  const supplied = args.indexOf('--sha256');
  if (supplied >= 0 && args[supplied + 1] !== sha256) throw new Error('Evidence hash mismatch.');
  if (supplied < 0) args.push('--sha256', sha256);
  args[index + 1] = localPath;
}
const result = spawnSync(process.env.GRAPH_PYTHON || 'python3', ['-m', 'graph_harness', '--project', resolve(root, 'graph-harness.project.json'), '--events', eventsPath, ...args], { cwd: runtime, stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
