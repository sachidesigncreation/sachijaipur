import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/isAdminEmail';

async function isAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isAdminUser(user);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await props.params;
  const { priceD, satinCost } = await req.json();
  const stone = await prisma.stonePrice.update({
    where: { id },
    data: {
      ...(priceD   !== undefined && { priceD }),
      ...(satinCost !== undefined && { satinCost }),
    },
  });
  return NextResponse.json(stone);
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await props.params;
  await prisma.stonePrice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
