import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import CmsPageSettingsForm from '@/components/admin/cms/CmsPageSettingsForm';
import CmsSectionManager, { type EditableSection } from '@/components/admin/cms/CmsSectionManager';
import CmsPageDeleteButton from '@/components/admin/cms/CmsPageDeleteButton';

export const metadata = { title: 'Edit Page — Admin' };

export default async function EditCmsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  let page = null;
  try {
    page = await prisma.cmsPage.findUnique({
      where: { id },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch {
    page = null;
  }
  if (!page) notFound();

  const initialSections: EditableSection[] = page.sections.map(s => ({
    id: s.id,
    type: s.type,
    sortOrder: s.sortOrder,
    isVisible: s.isVisible,
    props: (s.props && typeof s.props === 'object' && !Array.isArray(s.props) ? s.props : {}) as EditableSection['props'],
  }));

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <Link href="/admin/pages" className="text-xs text-warm uppercase tracking-widest hover:text-charcoal">← All pages</Link>
          <h1 className="font-cormorant text-3xl text-charcoal mt-2">{page.title}</h1>
          <p className="text-warm text-sm font-dm-sans mt-1 font-mono">/{page.slug} · {page.sections.length} section{page.sections.length === 1 ? '' : 's'}</p>
        </div>
        <CmsPageDeleteButton id={page.id} title={page.title} />
      </div>

      <div className="mb-12">
        <h2 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-4">Page Settings</h2>
        <CmsPageSettingsForm
          initial={{
            id: page.id,
            title: page.title,
            slug: page.slug,
            navLabel: page.navLabel ?? '',
            showInNav: page.showInNav,
            navOrder: String(page.navOrder),
            status: page.status,
            metaDescription: page.metaDescription ?? '',
          }}
        />
      </div>

      <div className="border-t border-black/10 pt-8">
        <h2 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-1">Sections</h2>
        <p className="text-warm text-xs font-dm-sans mb-6">Top-to-bottom page order. Hidden sections don’t render. Only published pages are visible on the site.</p>
        <CmsSectionManager pageId={page.id} initialSections={initialSections} />
      </div>
    </div>
  );
}
