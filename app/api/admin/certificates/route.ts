import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/isAdminEmail';

async function isAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isAdminUser(user);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const cert = await prisma.certificate.create({
    data: { id: body.id, name: body.name, issuingBody: body.issuingBody, imageKey: body.imageKey, validity: body.validity || null },
  });
  return NextResponse.json(cert, { status: 201 });
}
