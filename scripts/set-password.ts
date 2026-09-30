/**
 * Set (or create) a Supabase Auth user's password from your own machine.
 *
 * Usage:
 *   npx tsx scripts/set-password.ts <email>
 *   npm run set-password -- <email>
 *
 * This is the break-glass path for when nobody can sign in — it needs no email
 * delivery and no existing session. Its only credential is SUPABASE_SERVICE_ROLE_KEY
 * from your local .env, which is why it is a local script and deliberately NOT an
 * HTTP route: the service-role key bypasses RLS entirely, so exposing this over the
 * network would hand anyone who reached it every account on the project.
 *
 * The password is read from a hidden prompt, never from argv — command-line
 * arguments land in shell history and are visible to `ps` for other users.
 */

import '../lib/env';
import { createClient, type User } from '@supabase/supabase-js';
import { createInterface } from 'node:readline';
import { getTeamRole } from '../lib/isAdminEmail';

const MIN_PASSWORD_LENGTH = 8;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(message: string): never {
  console.error(`\n  ✖ ${message}\n`);
  process.exit(1);
}

function ask(query: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    // Settle on 'close' only. rl.close() emits 'close' synchronously, so a
    // resolve() placed after it in the question callback would never win the
    // race — capture the answer first and let the single handler return it.
    // '' therefore means Ctrl-D / EOF, not "typed nothing then Enter".
    let answer = '';
    rl.on('close', () => resolve(answer.trim()));
    rl.question(query, value => { answer = value; rl.close(); });
  });
}

/** Prompt without echoing keystrokes, so the password never appears on screen. */
function askHidden(query: string): Promise<string> {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const patched = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
    const original = patched._writeToOutput.bind(rl);
    let hide = false;
    let answer = '';

    patched._writeToOutput = (str: string) => {
      // While hidden, suppress every echo. readline redraws the whole line
      // (prompt included) on each keystroke, so testing for the prompt here
      // would leak the password back onto the screen.
      if (!hide) original(str);
    };

    // Single settle point — see ask() above for why resolving inside the
    // question callback loses the race against rl.close().
    rl.on('close', () => { hide = false; process.stdout.write('\n'); resolve(answer); });
    rl.question(query, value => { answer = value; rl.close(); });
    hide = true;
  });
}

/** listUsers() is paginated and there is no lookup-by-email, so page through. */
async function findUserByEmail(
  admin: ReturnType<typeof createClient>['auth']['admin'],
  email: string,
): Promise<User | null> {
  const target = email.toLowerCase();
  const perPage = 200;

  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.listUsers({ page, perPage });
    if (error) fail(`Could not list users: ${error.message}`);

    const match = data.users.find(u => u.email?.toLowerCase() === target);
    if (match) return match;
    if (data.users.length < perPage) return null;
  }
  return null;
}

async function main() {
  const email = process.argv[2]?.trim();

  if (!email) {
    fail('Usage: npx tsx scripts/set-password.ts <email>');
  }
  if (!SUPABASE_URL || !SERVICE_KEY) {
    fail('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const admin = supabase.auth.admin;

  console.log(`\n  Project : ${SUPABASE_URL}`);
  console.log(`  Account : ${email}`);
  const role = await getTeamRole(email);
  console.log(`  Admin   : ${role ? `yes — role "${role}" in the User table` : 'NO — no User-table row, this user cannot reach /admin'}`);

  const existing = await findUserByEmail(admin, email);

  if (existing) {
    console.log(`  Status  : existing user (id ${existing.id}, created ${new Date(existing.created_at).toLocaleDateString()})`);
  } else {
    console.log('  Status  : no such user in Supabase Auth');
    const create = await ask('\n  Create this user? [y/N] ');
    if (create.toLowerCase() !== 'y') {
      console.log('\n  Aborted — nothing changed.\n');
      process.exit(0);
    }
  }

  const password = await askHidden(`\n  New password (min ${MIN_PASSWORD_LENGTH} chars, input hidden): `);
  if (!password) {
    fail('No password entered. Nothing changed.');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    fail(`Password must be at least ${MIN_PASSWORD_LENGTH} characters. Nothing changed.`);
  }

  const confirm = await askHidden('  Confirm password: ');
  if (password !== confirm) {
    fail('Passwords do not match. Nothing changed.');
  }

  if (existing) {
    const { error } = await admin.updateUserById(existing.id, { password });
    if (error) fail(`Could not update password: ${error.message}`);
    console.log(`\n  ✔ Password updated for ${email}\n`);
  } else {
    // email_confirm skips the verification mail — the whole point of this script.
    const { error } = await admin.createUser({ email, password, email_confirm: true });
    if (error) fail(`Could not create user: ${error.message}`);
    console.log(`\n  ✔ User created with that password: ${email}\n`);
  }

  if (!(await getTeamRole(email))) {
    console.log(`  Note: ${email} has no User-table row, so it can sign in but not reach /admin. Add one from Admin → Team.\n`);
  }
}

main().catch(err => fail(err instanceof Error ? err.message : String(err)));
