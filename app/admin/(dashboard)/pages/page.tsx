import { prisma } from '@/lib/db';
import Link from 'next/link';
import CmsPageDeleteButton from '@/components/admin/cms/CmsPageDeleteButton';
import { BUILT_IN_PAGES } from '@/lib/builtInPages';

export const metadata = { title: 'Pages — Admin' };

export default async function AdminPagesPage() {
  let pages: Array<{
    id: string; slug: string; title: string; status: string;
    showInNav: boolean; navOrder: number; updatedAt: Date;
    _count: { sections: number };
  }> = [];
  try {
    pages = await prisma.cmsPage.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { sections: true } } },
    });
  } catch {
    pages = [];
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-cormorant text-3xl text-charcoal">Pages</h1>
          <p className="text-warm text-sm font-dm-sans mt-1">
            {BUILT_IN_PAGES.length} built-in · {pages.length} custom page{pages.length === 1 ? '' : 's'} · tick “Show in navbar” to add a custom page to the menu
          </p>
        </div>
        <Link href="/admin/pages/new" className="btn-primary text-sm">+ New Page</Link>
      </div>

      {/* Built-in pages */}
      <h2 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-4">Website Pages</h2>
      <div className="bg-ivory border border-black/10 overflow-hidden rounded mb-12">
        <table className="w-full text-sm font-dm-sans">
          <thead className="bg-charcoal text-ivory">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Title</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden md:table-cell">URL</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden sm:table-cell">Editable Content</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-widest font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {BUILT_IN_PAGES.map(p => (
              <tr key={p.url} className="hover:bg-pearl/50 transition-colors">
                <td className="px-4 py-3 text-charcoal font-medium">{p.title}</td>
                <td className="px-4 py-3 text-warm hidden md:table-cell font-mono text-xs">{p.url}</td>
                <td className="px-4 py-3 text-warm hidden sm:table-cell">{p.description}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-warm uppercase tracking-widest hover:text-charcoal transition-colors mr-4"
                  >
                    View
                  </a>
                  <Link
                    href={`/admin/pages/built-in/${p.slug}`}
                    className="text-xs text-gold uppercase tracking-widest hover:text-gold-deep transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom builder pages */}
      <h2 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-4">
        Custom Pages <span className="text-warm normal-case tracking-normal">· rendered at <span className="font-mono">/{'{slug}'}</span></span>
      </h2>
      <div className="bg-ivory border border-black/10 overflow-hidden rounded">
        <table className="w-full text-sm font-dm-sans">
          <thead className="bg-charcoal text-ivory">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Title</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden md:table-cell">URL</th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-widest font-medium hidden sm:table-cell">Sections</th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-widest font-medium">Status</th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-widest font-medium hidden lg:table-cell">Navbar</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-widest font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {pages.map(p => (
              <tr key={p.id} className="hover:bg-pearl/50 transition-colors">
                <td className="px-4 py-3 text-charcoal font-medium">{p.title}</td>
                <td className="px-4 py-3 text-warm hidden md:table-cell font-mono text-xs">/{p.slug}</td>
                <td className="px-4 py-3 text-warm text-center hidden sm:table-cell">{p._count.sections}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 text-[11px] uppercase tracking-widest rounded ${p.status === 'PUBLISHED' ? 'bg-gold/20 text-gold-deep' : 'bg-black/10 text-warm'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center hidden lg:table-cell text-warm">
                  {p.showInNav ? `Yes · #${p.navOrder}` : '—'}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {p.status === 'PUBLISHED' && (
                    <a
                      href={`/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-warm uppercase tracking-widest hover:text-charcoal transition-colors mr-4"
                    >
                      View
                    </a>
                  )}
                  <Link
                    href={`/admin/pages/${p.id}`}
                    className="text-xs text-gold uppercase tracking-widest hover:text-gold-deep transition-colors mr-4"
                  >
                    Edit
                  </Link>
                  <CmsPageDeleteButton id={p.id} title={p.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages.length === 0 && (
          <div className="text-center py-16 text-warm font-dm-sans text-sm">
            No custom pages yet.{' '}
            <Link href="/admin/pages/new" className="text-gold underline">Create your first page</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
