import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server';
import { isAdminUser, isTeamRole } from '@/lib/isAdminEmail';

async function currentUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function findAuthUserByEmail(admin: Awaited<ReturnType<typeof createSupabaseAdminClient>>, email: string) {
  const target = email.toLowerCase();
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw new Error(error.message);
    const found = data.users.find(u => u.email?.toLowerCase() === target);
    if (found) return found;
    if (data.users.length < 100) break;
  }
  return null;
}

/** List team members (owners first). */
export async function GET() {
  const self = await currentUser();
  if (!(await isAdminUser(self))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await prisma.user.findMany({ orderBy: [{ role: 'asc' }, { createdAt: 'asc' }] });
  const selfEmail = self?.email?.toLowerCase() ?? null;
  return NextResponse.json({
    users: rows.map(r => ({ ...r, isSelf: r.email.toLowerCase() === selfEmail })),
  });
}

/**
 * Add / update a team member. Body: { name, email, role, password? }.
 * Creates the auth login too when one doesn't exist (password required then).
 */
export async function POST(req: NextRequest) {
  const self = await currentUser();
  if (!(await isAdminUser(self))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const role = body.role;
  const password = String(body.password ?? '');

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  if (!isTeamRole(role)) return NextResponse.json({ error: 'Role must be owner or admin.' }, { status: 400 });

  const admin = await createSupabaseAdminClient();
  const existingLogin = await findAuthUserByEmail(admin, email);

  if (!existingLogin) {
    if (password.length < 8) {
      return NextResponse.json({ error: 'No login exists for this email — a password (min 8) is required to create one.' }, { status: 400 });
    }
    const { error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (createError) return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  const row = await prisma.user.upsert({
    where: { email },
    create: { email, name, role },
    update: { name, role },
  });

  return NextResponse.json(
    { success: true, createdLogin: !existingLogin, user: row },
    { status: existingLogin ? 200 : 201 },
  );
}
