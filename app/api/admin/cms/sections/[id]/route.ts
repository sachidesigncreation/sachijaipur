import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCmsAdmin } from '../../pages/route';
import { SECTION_TYPES } from '@/lib/cms';

const VALID_TYPES = new Set<string>(SECTION_TYPES.map(t => t.value));

async function requireAdmin() {
  if (!(await isCmsAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

type Ctx = { params: Promise<{ id: string }> };

function notFound(e: unknown) {
  return typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2025';
}

/** Partial section update: { type?, sortOrder?, isVisible?, props? } */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.type !== undefined) {
    if (!VALID_TYPES.has(String(body.type))) return NextResponse.json({ error: 'Invalid section type.' }, { status: 400 });
    data.type = String(body.type);
  }
  if (body.sortOrder !== undefined) {
    if (!Number.isFinite(Number(body.sortOrder))) return NextResponse.json({ error: 'Invalid sort order.' }, { status: 400 });
    data.sortOrder = Number(body.sortOrder);
  }
  if (body.isVisible !== undefined) data.isVisible = body.isVisible === true;
  if (body.props !== undefined) {
    if (!body.props || typeof body.props !== 'object' || Array.isArray(body.props)) {
      return NextResponse.json({ error: 'props must be an object.' }, { status: 400 });
    }
    data.props = body.props;
  }

  try {
    const section = await prisma.cmsSection.update({ where: { id }, data });
    return NextResponse.json(section);
  } catch (e: unknown) {
    if (notFound(e)) return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
    throw e;
  }
}

/** Delete a section. */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    await prisma.cmsSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (notFound(e)) return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
    throw e;
  }
}
