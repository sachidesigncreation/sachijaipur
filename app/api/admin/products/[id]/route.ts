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
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      sku:               body.sku || null,
      name:              body.name,
      category:          body.category,
      description:       body.description,
      baseMetal:         body.baseMetal,
      purityOptions:     body.purityOptions ?? [],
      metalColorOptions: body.metalColorOptions ?? [],
      availableStones:   body.availableStones ?? [],
      primaryGemstone:   body.primaryGemstone || null,
      images:            body.images ?? [],
      featured:          body.featured ?? false,
      weightGrams:       body.weightGrams ?? null,
      makingChargeC:     body.makingChargeC ?? 0,
      gemstoneCount:     body.gemstoneCount ?? 1,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await props.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
