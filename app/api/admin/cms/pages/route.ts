import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/isAdminEmail';
import { normalizeSlug, slugError, CMS_STATUS } from '@/lib/cms';

export async function isCmsAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isAdminUser(user);
}

async function requireAdmin() {
  if (!(await isCmsAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

/** List all pages (newest first) with section counts. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const pages = await prisma.cmsPage.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { sections: true } } },
  });
  return NextResponse.json(pages);
}

/** Create a page. Body: { title, slug?, navLabel?, showInNav?, navOrder?, status?, metaDescription? } */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const title = String(body.title ?? '').trim();
  if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

  const slug = normalizeSlug(String(body.slug ?? title));
  const err = slugError(slug);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const status = body.status === CMS_STATUS.PUBLISHED ? CMS_STATUS.PUBLISHED : CMS_STATUS.DRAFT;

  try {
    const page = await prisma.cmsPage.create({
      data: {
        title,
        slug,
        navLabel: String(body.navLabel ?? '').trim() || null,
        showInNav: body.showInNav === true,
        navOrder: Number.isFinite(Number(body.navOrder)) ? Number(body.navOrder) : 0,
        status,
        metaDescription: String(body.metaDescription ?? '').trim() || null,
      },
    });
    return NextResponse.json(page, { status: 201 });
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: `A page with slug "${slug}" already exists.` }, { status: 409 });
    }
    throw e;
  }
}
