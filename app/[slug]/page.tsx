import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import FloatingQuoteCart from '@/components/layout/FloatingQuoteCart';
import QuoteCartDrawer from '@/components/quote/QuoteCartDrawer';
import CmsSections from '@/components/cms/CmsSections';
import { getPublishedPage } from '@/lib/cmsServer';
import { RESERVED_SLUGS } from '@/lib/cms';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};
  const page = await getPublishedPage(slug);
  if (!page) return {};
  return {
    title: `${page.title} — Sachi Jaipur`,
    description: page.metaDescription || `${page.title} — Sachi Jaipur.`,
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  return (
    <div className="bg-ivory min-h-screen pt-20">
      <Navbar />
      <main>
        <CmsSections sections={page.sections} />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingQuoteCart />
      <QuoteCartDrawer />
    </div>
  );
}
