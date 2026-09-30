import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser, isTeamRole } from '@/lib/isAdminEmail';

type Ctx = { params: Promise<{ id: string }> };

async function guard(ctx: Ctx) {
  const supabase = await createSupabaseServerClient();
  const { data: { user: self } } = await supabase.auth.getUser();
  if (!(await isAdminUser(self))) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const { id } = await ctx.params;
  const row = await prisma.user.findUnique({ where: { id } });
  if (!row) return { error: NextResponse.json({ error: 'User not found.' }, { status: 404 }) };
  return { self, row };
}

/** Change a member's role. Body: { role: 'owner' | 'admin' }. */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const g = await guard(ctx);
  if (g.error) return g.error;

  const body = await req.json();
  if (!isTeamRole(body.role)) return NextResponse.json({ error: 'Role must be owner or admin.' }, { status: 400 });

  if (g.row.role === 'owner' && body.role !== 'owner') {
    const owners = await prisma.user.count({ where: { role: 'owner' } });
    if (owners <= 1) {
      return NextResponse.json({ error: 'Assign another owner first — the panel needs at least one.' }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({ where: { id: g.row.id }, data: { role: body.role } });
  return NextResponse.json({ success: true, user: updated });
}

/** Remove a member's panel access (row only; their login is kept). */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const g = await guard(ctx);
  if (g.error) return g.error;

  if (g.row.email.toLowerCase() === (g.self?.email ?? '').toLowerCase()) {
    return NextResponse.json({ error: 'You cannot remove your own access.' }, { status: 400 });
  }
  if (g.row.role === 'owner') {
    const owners = await prisma.user.count({ where: { role: 'owner' } });
    if (owners <= 1) {
      return NextResponse.json({ error: 'Assign another owner first — the panel needs at least one.' }, { status: 400 });
    }
  }

  await prisma.user.delete({ where: { id: g.row.id } });
  return NextResponse.json({ success: true });
}
