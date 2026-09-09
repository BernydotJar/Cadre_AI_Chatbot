// Read-only audit of a fresh, dependency-free delivery clone. No matched text is printed.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, lstatSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(process.argv[2] ?? '.');
const snapshot = process.argv[3];
if (!/^[a-f0-9]{40}$/.test(snapshot ?? '')) throw Error('Provide the full expected source commit.');
const git = (...args) => execFileSync('rtk', ['proxy', 'git', '-C', root, ...args], { maxBuffer: 32 * 1024 * 1024 });
const text = (...args) => git(...args).toString('utf8').trim();
const findings = [];
const flag = (rule, target) => findings.push({ rule, target });
const patterns = [
  ['provider-token', /sk-or-v1-[A-Za-z0-9_-]{40,}/],
  ['bearer-token', /Bearer [A-Za-z0-9._~-]{24,}/i],
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['credential-url', /https?:\/\/[^\s/@]+:[^\s/@]+@/],
];
const inertCredentialUrlFixture = 'https://user:pass@cadre.ai/';
const scan = (bytes, target) => {
  // This exact literal is an intentional hostile-URL parser test committed in
  // extension tests/evidence. Remove only that inert fixture before credential
  // scanning; all other userinfo URLs remain findings.
  const value = bytes.toString('utf8').replaceAll(inertCredentialUrlFixture, '');
  for (const [rule, pattern] of patterns) if (pattern.test(value)) flag(rule, target);
};
const forbidden = name => name.split('/').some(part => [
  '.codex', '.vercel', 'node_modules', '.next', 'dist', 'build', 'coverage', 'test-results',
  'playwright-report', '.local-evidence', '.terraform',
].includes(part) || (part.startsWith('.env') && part !== '.env.example'))
  || /(?:^|\/)(?:test\.md|\.DS_Store)$|\.(?:pdf|zip|pem|key|tfstate)$/i.test(name);

if (text('rev-parse', 'HEAD') !== snapshot) flag('snapshot-mismatch', 'HEAD');
if (text('status', '--porcelain')) flag('dirty-clone', 'worktree');
if (text('rev-parse', '--is-shallow-repository') !== 'false') flag('shallow-clone', '.git');
if (text('remote', 'get-url', 'origin') !== 'https://github.com/BernydotJar/Cadre_AI_Chatbot.git') flag('unexpected-origin', '.git/config');
for (const line of text('for-each-ref', '--format=%(refname) %(objectname)').split('\n').filter(Boolean)) {
  const [ref, oid] = line.split(' ');
  if (!['refs/heads/main', 'refs/remotes/origin/main', 'refs/remotes/origin/HEAD'].includes(ref) || oid !== snapshot) flag('unexpected-ref', ref);
}
const reachable = new Set(text('rev-list', '--objects', snapshot).split('\n').map(line => line.split(' ')[0]));
const objects = text('cat-file', '--batch-all-objects', '--batch-check=%(objectname) %(objecttype) %(objectsize)').split('\n').filter(Boolean);
const physical = new Set();
for (const line of objects) {
  const [oid, type, size] = line.split(' ');
  physical.add(oid);
  if (!reachable.has(oid)) flag('unexpected-physical-object', oid);
  if (Number(size) > 16 * 1024 * 1024) { flag('oversized-object', oid); continue; }
  scan(git('cat-file', type, oid), oid);
}
for (const oid of reachable) if (!physical.has(oid)) flag('missing-object', oid);
const commits = text('rev-list', snapshot).split('\n');
const historicalPaths = new Set();
for (const commit of commits) {
  for (const entry of git('ls-tree', '-r', '-z', commit).toString('utf8').split('\0').filter(Boolean)) {
    const separator = entry.indexOf('\t');
    if (separator < 0) throw Error('Malformed historical tree entry.');
    const meta = entry.slice(0, separator), name = entry.slice(separator + 1);
    historicalPaths.add(name);
    if (forbidden(name)) flag('forbidden-historical-path', `${commit}:${name}`);
    if (meta.startsWith('120000 ') || meta.startsWith('160000 ')) flag('symlink-or-submodule', `${commit}:${name}`);
  }
}
let files = 0;
function walk(directory) {
  for (const name of readdirSync(directory)) {
    const file = join(directory, name), rel = relative(root, file), stat = lstatSync(file);
    if (stat.isSymbolicLink()) { flag('symlink', rel); continue; }
    if (rel === '.git/objects/info/alternates' || rel === '.git/shallow' || rel.endsWith('.promisor') || rel.startsWith('.git/hooks/')) flag('external-object-or-hook', rel);
    if (stat.isDirectory()) { walk(file); continue; }
    if (!stat.isFile()) { flag('non-regular-file', rel); continue; }
    files++;
    if (!rel.startsWith('.git/') && forbidden(rel)) flag('forbidden-file', rel);
    // Skip only canonical object containers inspected decompressed via cat-file.
    // An arbitrary file under objects/ is not necessarily an indexed Git object.
    const objectContainer = /^\.git\/objects\/[a-f0-9]{2}\/[a-f0-9]{38}$/u.test(rel)
      || /^\.git\/objects\/pack\/pack-[a-f0-9]{40}\.(?:pack|idx)$/u.test(rel);
    if (rel.startsWith('.git/objects/') && !objectContainer && rel !== '.git/objects/info/packs') {
      flag('unexpected-object-store-file', rel);
    }
    if (!objectContainer) scan(readFileSync(file), rel);
  }
}
walk(root);
const config = text('config', '--local', '--list');
if (/promisor|partialclone|alternates|hookspath|credential|insteadof/i.test(config)) flag('unexpected-git-config', '.git/config');
git('fsck', '--full', '--strict');
const manifest = git('ls-tree', '-r', snapshot);
console.log(JSON.stringify({ timestamp: new Date().toISOString(), snapshot, result: findings.length ? 'FAIL' : 'PASS',
  commits: commits.length, physicalObjects: physical.size, reachableObjects: reachable.size,
  historicalPaths: historicalPaths.size, regularFiles: files,
  trackedManifestSha256: createHash('sha256').update(manifest).digest('hex'), findings,
  limitation: 'Pattern-based scan is not universal secret detection. Run before installing dependencies in the extracted clone.' }, null, 2));
process.exitCode = findings.length ? 1 : 0;
