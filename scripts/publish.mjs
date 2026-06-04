// Publish every @ric/* package to npm in dependency order (leaves first), so a
// dependent never publishes before its deps exist. Requires `npm login` first.
//
//   npm run publish:all              # publish all (skips already-published versions)
//   npm run publish:all -- --dry-run # show what would publish, change nothing
//
// Bump versions across packages with Changesets (already scaffolded) before
// publishing a new release.

import { execFileSync } from 'node:child_process';

// Leaves → roots. ui depends on everything, so it goes last.
const ORDER = [
  'ui-tokens',
  'emoji',
  'icons',
  'map-ui',
  'ui-core',
  'places',
  'meetups',
  'chat',
  'ui',
];

const dryRun = process.argv.includes('--dry-run');

for (const pkg of ORDER) {
  const cwd = new URL(`../packages/${pkg}/`, import.meta.url).pathname;
  const args = ['publish', '--access', 'public'];
  if (dryRun) args.push('--dry-run');
  console.log(`\n▶ @ric/${pkg}  ${dryRun ? '(dry-run)' : ''}`);
  try {
    execFileSync('npm', args, { cwd, stdio: 'inherit' });
  } catch (err) {
    // A version already on the registry is fine — keep going.
    const msg = String(err.stderr || err.message || '');
    if (/cannot publish over|previously published|EPUBLISHCONFLICT/i.test(msg)) {
      console.log(`  (already published — skipping)`);
      continue;
    }
    console.error(`  ✗ failed to publish @ric/${pkg}`);
    process.exit(1);
  }
}

console.log(dryRun ? '\nDry run complete.' : '\nAll packages published.');
