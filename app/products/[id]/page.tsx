import { notFound } from 'next/navigation';
import { getProductByRouteParam } from '@/lib/getProductByRouteParam';
import { prisma } from '@/lib/db';
import { mapDbProductToProduct } from '@/lib/mapDbProduct';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import FloatingQuoteCart from '@/components/layout/FloatingQuoteCart';
import QuoteCartDrawer from '@/components/quote/QuoteCartDrawer';
import ProductGallery from './ProductGallery';
import ProductActions from './ProductActions';
import ProductDetailGuestLock from './ProductDetailGuestLock';
import { normalizeR2Image } from '@/lib/r2/config';
import type { Metadata } from 'next';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const p = await getProductByRouteParam(id);
  if (!p) return {};
  const img = normalizeR2Image(p.images?.[0]);
  return {
    title:       `${p.name} — Sachi Jaipur`,
    description: p.description.slice(0, 160),
    openGraph: {
      title:       `${p.name} — Sachi Jaipur`,
      description: p.description.slice(0, 160),
      images:      img ? [{ url: img, width: 1200, height: 900 }] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const dbProduct = await getProductByRouteParam(id);
  if (!dbProduct) notFound();

  const product: Product = mapDbProductToProduct(dbProduct);

  // Check access
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isApproved = false;
  if (user) {
    const account = await prisma.clientAccount.findUnique({
      where: { email: user.email! },
      select: { status: true },
    });
    isApproved = account?.status === 'APPROVED';
  }

  const resolvedImages = product.images.map(k => normalizeR2Image(k) ?? k);

  return (
    <div className="bg-ivory min-h-screen pt-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="mb-8">
          <Link href="/products" className="text-charcoal-light hover:text-gold transition-colors font-dm-sans text-xs uppercase tracking-widest">
            ← Back to Collections
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <ProductGallery images={resolvedImages} productName={product.name} />

          <div className="flex flex-col justify-center">
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
              {product.category}
            </span>
            <h1 className="font-cormorant text-display-md text-charcoal mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="h-px w-16 bg-gold mb-10" />

            <div className="font-dm-sans text-charcoal-light text-body mb-8 space-y-4">
              <p>{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12 py-8 border-y border-gold/10">
              {product.sku && (
                <div>
                  <span className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-1">SKU</span>
                  <span className="font-dm-sans text-charcoal font-medium">{product.sku}</span>
                </div>
              )}
              <div>
                <span className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-1">Metal</span>
                <span className="font-dm-sans text-charcoal font-medium uppercase">{product.baseMetal}</span>
              </div>
              {product.primaryGemstone && (
                <div>
                  <span className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-1">Gemstone</span>
                  <span className="font-dm-sans text-charcoal font-medium">{product.primaryGemstone}</span>
                </div>
              )}
              {product.weightGrams && product.weightGrams > 0 && (
                <div>
                  <span className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-1">Weight</span>
                  <span className="font-dm-sans text-charcoal font-medium">{product.weightGrams}g</span>
                </div>
              )}
            </div>

            {isApproved ? (
              <ProductActions product={product} />
            ) : (
              <ProductDetailGuestLock />
            )}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
      {isApproved && <FloatingQuoteCart />}
      {isApproved && <QuoteCartDrawer />}
    </div>
  );
}
