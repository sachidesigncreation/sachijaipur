import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getBuiltInPage } from '@/lib/builtInPages';
import SiteSettingsEditor from '@/components/admin/SiteSettingsEditor';
import BuiltInProductsManager from '@/components/admin/BuiltInProductsManager';
import CertificateAdminCard from '@/components/admin/CertificateAdminCard';
import AddCertificateForm from '@/components/admin/AddCertificateForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = getBuiltInPage(slug);
  return { title: page ? `Edit ${page.title} — Admin` : 'Edit Page — Admin' };
}

export default async function BuiltInPageEditor(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = getBuiltInPage(slug);
  if (!page) notFound();

  const settingsMap: Record<string, string> = {};
  let products: Array<{
    id: string; sku: string | null; name: string; category: string;
    description: string; baseMetal: string; purityOptions: string[];
    metalColorOptions: string[]; availableStones: string[];
    primaryGemstone: string | null; images: string[]; featured: boolean;
    weightGrams: number | null; makingChargeC: number; gemstoneCount: number;
  }> = [];
  let certs: Array<{
    id: string; name: string; issuingBody: string; imageKey: string;
    validity: string | null; sortOrder: number;
  }> = [];

  try {
    if (page.kind === 'settings') {
      const rows = await prisma.siteSettings.findMany();
      rows.forEach(r => { settingsMap[r.key] = r.value; });
    } else if (page.kind === 'products') {
      products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    } else {
      certs = await prisma.certificate.findMany({ orderBy: { sortOrder: 'asc' } });
    }
  } catch {
    // render with empty state rather than breaking
  }

  return (
    <div className="max-w-4xl">
      <Link href="/admin/pages" className="text-xs text-warm uppercase tracking-widest hover:text-charcoal">← All pages</Link>
      <div className="flex justify-between items-start gap-4 mt-2 mb-2">
        <h1 className="font-cormorant text-3xl text-charcoal">{page.title}</h1>
        <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold uppercase tracking-widest hover:text-gold-deep shrink-0 mt-2">
          View live →
        </a>
      </div>
      <p className="text-warm text-sm font-dm-sans mb-8">{page.description}</p>

      {page.kind === 'settings' && (
        <SiteSettingsEditor groups={page.groups} initial={settingsMap} saveLabel="Save Page" />
      )}

      {page.kind === 'products' && (
        <BuiltInProductsManager initialProducts={products} />
      )}

      {page.kind === 'certificates' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {certs.map(cert => (
              <CertificateAdminCard key={cert.id} cert={cert} />
            ))}
          </div>
          {certs.length === 0 && (
            <p className="text-warm text-sm font-dm-sans mb-8">No certificates yet — add the first one below.</p>
          )}
          <div className="border-t border-black/10 pt-8">
            <h2 className="font-dm-sans text-sm uppercase tracking-widest text-charcoal mb-6">Add Certificate</h2>
            <AddCertificateForm />
          </div>
        </div>
      )}
    </div>
  );
}
