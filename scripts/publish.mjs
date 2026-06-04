// Publish every @ric/* package to npm in dependency order (leaves first), so a
// dependent never publishes before its deps exist.
//
//   npm run publish:all                 # publish all (skips already-published)
//   npm run publish:all -- --dry-run    # show what would publish, change nothing
//   npm run publish:all -- --otp=123456 # pass a 2FA one-time code to each publish
//
// 2FA: npm requires a second factor for writes. A single OTP is consumed per
// publish and expires, so for this 9-package loop the robust path is a token
// that BYPASSES 2FA — a granular access token (Read+Write, scope @ric, "bypass
// two-factor authentication" enabled) or a classic Automation token — set as
// //registry.npmjs.org/:_authToken in ~/.npmrc. See PUBLISHING.md.
//
// Re-running is safe: already-published versions are skipped, so if an --otp
// run dies mid-way you can re-run with a fresh code and it resumes.

import { execFileSync } from 'node:child_process';

// Leaves → roots. ui depends on everything, so it goes last.
const ORDER = ['ui-tokens', 'emoji', 'icons', 'map-ui', 'ui-core', 'places', 'meetups', 'chat', 'ui'];

const dryRun = process.argv.includes('--dry-run');
const otp = process.argv.find((a) => a.startsWith('--otp='))?.slice('--otp='.length);

const ALREADY = /cannot publish over|previously published|EPUBLISHCONFLICT|cannot modify pre-existing/i;
const TWO_FACTOR = /one-time pass|two-factor|2fa|OTP|E40[13]|forbidden/i;

for (const pkg of ORDER) {
  const cwd = new URL(`../packages/${pkg}/`, import.meta.url).pathname;
  const args = ['publish', '--access', 'public'];
  if (dryRun) args.push('--dry-run');
  if (otp) args.push(`--otp=${otp}`);
  console.log(`\n▶ @ric/${pkg}  ${dryRun ? '(dry-run)' : ''}`);
  try {
    execFileSync('npm', args, { cwd, stdio: 'inherit' });
  } catch (err) {
    const msg = String(err.stderr || err.message || '');
    if (ALREADY.test(msg)) {
      console.log('  (already published — skipping)');
      continue;
    }
    console.error(`  ✗ failed to publish @ric/${pkg}`);
    if (TWO_FACTOR.test(msg)) {
      console.error('\n  This looks like a 2FA / auth block. Fastest fix:');
      console.error('   • Create an npm token that bypasses 2FA (granular Read+Write for @ric, or an');
      console.error('     Automation token) at npmjs.com → Access Tokens, then add to ~/.npmrc:');
      console.error('       //registry.npmjs.org/:_authToken=<token>');
      console.error('   • Or pass a fresh code:  npm run publish:all -- --otp=<6 digits>');
      console.error('   • Or set your npm account 2FA to "Authorization only".');
      console.error('   If the error says you lack permission for @ric, the scope/org isn\'t yours —');
      console.error('   create the free org "ric" or rename the scope (see PUBLISHING.md).');
    }
    process.exit(1);
  }
}

console.log(dryRun ? '\nDry run complete.' : '\nAll packages published.');
