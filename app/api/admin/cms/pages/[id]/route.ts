import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCmsAdmin } from '../route';
import { normalizeSlug, slugError, CMS_STATUS } from '@/lib/cms';

async function requireAdmin() {
  if (!(await isCmsAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

type Ctx = { params: Promise<{ id: string }> };

/** Partial page update. */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) return NextResponse.json({ error: 'Title cannot be empty.' }, { status: 400 });
    data.title = title;
  }
  if (body.slug !== undefined) {
    const slug = normalizeSlug(String(body.slug));
    const err = slugError(slug);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    data.slug = slug;
  }
  if (body.navLabel !== undefined) data.navLabel = String(body.navLabel).trim() || null;
  if (body.showInNav !== undefined) data.showInNav = body.showInNav === true;
  if (body.navOrder !== undefined) data.navOrder = Number.isFinite(Number(body.navOrder)) ? Number(body.navOrder) : 0;
  if (body.status !== undefined) {
    if (body.status !== CMS_STATUS.DRAFT && body.status !== CMS_STATUS.PUBLISHED) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.metaDescription !== undefined) data.metaDescription = String(body.metaDescription).trim() || null;

  try {
    const page = await prisma.cmsPage.update({ where: { id }, data });
    return NextResponse.json(page);
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e) {
      const code = (e as { code: string }).code;
      if (code === 'P2002') return NextResponse.json({ error: 'That slug is already in use.' }, { status: 409 });
      if (code === 'P2025') return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    }
    throw e;
  }
}

/** Delete a page and all its sections. */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    await prisma.cmsPage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    }
    throw e;
  }
}
