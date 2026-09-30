import { prisma } from '@/lib/db';
import { CMS_STATUS, toSectionProps, type CmsPageWithSections } from '@/lib/cms';

/**
 * Server-only CMS reads (Admin → Pages website builder).
 * Fault-tolerant: any DB failure yields null/[] so public pages never break.
 */

/** Published page + visible sections for public rendering. Returns null when missing. */
export async function getPublishedPage(slug: string): Promise<CmsPageWithSections | null> {
  try {
    const page = await prisma.cmsPage.findUnique({
      where: { slug },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!page || page.status !== CMS_STATUS.PUBLISHED) return null;
    return {
      ...page,
      sections: page.sections
        .filter(s => s.isVisible)
        .map(s => ({ ...s, props: toSectionProps(s.props) })),
    };
  } catch {
    return null;
  }
}

/** Published pages flagged for the navbar, ordered. Never throws. */
export async function getNavPages(): Promise<Array<{ slug: string; label: string }>> {
  try {
    const pages = await prisma.cmsPage.findMany({
      where: { status: CMS_STATUS.PUBLISHED, showInNav: true },
      orderBy: [{ navOrder: 'asc' }, { title: 'asc' }],
      select: { slug: true, title: true, navLabel: true },
    });
    return pages.map(p => ({ slug: p.slug, label: p.navLabel?.trim() || p.title }));
  } catch {
    return [];
  }
}
