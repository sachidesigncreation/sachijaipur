import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCmsAdmin } from '../pages/route';
import { SECTION_TYPES, type SectionType } from '@/lib/cms';

const VALID_TYPES = new Set<string>(SECTION_TYPES.map(t => t.value));

/** Create a section. Body: { pageId, type, props?, isVisible? } — appended at the end. */
export async function POST(req: NextRequest) {
  if (!(await isCmsAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const pageId = String(body.pageId ?? '');
  const type = String(body.type ?? '') as SectionType;
  if (!pageId) return NextResponse.json({ error: 'pageId is required.' }, { status: 400 });
  if (!VALID_TYPES.has(type)) return NextResponse.json({ error: 'Invalid section type.' }, { status: 400 });

  const page = await prisma.cmsPage.findUnique({ where: { id: pageId }, select: { id: true } });
  if (!page) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });

  const props = body.props && typeof body.props === 'object' && !Array.isArray(body.props) ? body.props : {};

  const max = await prisma.cmsSection.aggregate({
    where: { pageId },
    _max: { sortOrder: true },
  });

  const section = await prisma.cmsSection.create({
    data: {
      pageId,
      type,
      props,
      isVisible: body.isVisible !== false,
      sortOrder: (max._max.sortOrder ?? -1) + 1,
    },
  });
  return NextResponse.json(section, { status: 201 });
}
