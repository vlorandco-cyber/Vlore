// Fails when the built site still contains [[PLACEHOLDER]] text (unconfirmed legal facts).
// Runs in the deploy workflow after the build, so unresolved drafts are never published.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist';
const found = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(html|txt|xml|js|json)$/.test(name)) {
      const text = readFileSync(path, 'utf8').replace(/<[^>]+>/g, '');
      for (const m of text.matchAll(/\[\[([^\]]+)\]\]/g)) found.push(`${relative(root, path)}: [[${m[1]}]]`);
    }
  }
})(root);

if (found.length) {
  console.error(`✗ ${found.length} unresolved placeholder(s); fill in src/lib/legal.ts and the CONFIRM items before publishing:`);
  for (const f of [...new Set(found)]) console.error('  ' + f);
  process.exit(1);
}
console.log('✓ No unresolved placeholders.');
