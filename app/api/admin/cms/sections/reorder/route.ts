import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCmsAdmin } from '../../pages/route';

/** Reorder a page's sections. Body: { pageId, orderedIds: string[] } */
export async function POST(req: NextRequest) {
  if (!(await isCmsAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: { pageId?: unknown; orderedIds?: unknown } = await req.json();
  const pageId = String(body.pageId ?? '');
  const orderedIds: string[] = Array.isArray(body.orderedIds) ? body.orderedIds.map((v: unknown) => String(v)) : [];
  if (!pageId || orderedIds.length === 0) {
    return NextResponse.json({ error: 'pageId and orderedIds are required.' }, { status: 400 });
  }

  const existing = await prisma.cmsSection.findMany({
    where: { pageId },
    select: { id: true },
  });
  const owned = new Set(existing.map(s => s.id));
  if (!orderedIds.every(id => owned.has(id)) || orderedIds.length !== existing.length) {
    return NextResponse.json({ error: 'orderedIds must contain exactly this page’s sections.' }, { status: 400 });
  }

  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.cmsSection.update({ where: { id }, data: { sortOrder: i } })
    )
  );
  return NextResponse.json({ success: true });
}
