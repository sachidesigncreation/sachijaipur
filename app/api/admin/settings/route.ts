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

  const body: Record<string, string> = await req.json();

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where:  { key },
        create: { key, value },
        update: { value },
      })
    )
  );

  return NextResponse.json({ success: true });
}
