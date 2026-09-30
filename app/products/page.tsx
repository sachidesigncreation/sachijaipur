import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import FloatingQuoteCart from '@/components/layout/FloatingQuoteCart';
import QuoteCartDrawer from '@/components/quote/QuoteCartDrawer';
import ProductsClientPage from '@/components/products/ProductsClientPage';
import { Product } from '@/types';
import { mapDbProductToProduct } from '@/lib/mapDbProduct';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Collections — Sachi Jaipur',
  description: 'Browse our curated wholesale collection of gold, silver and brass jewellery from Jaipur.',
};

export default async function ProductsPage() {
  // Determine access level
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isApproved = false;
  let isGuest = true;

  if (user) {
    const account = await prisma.clientAccount.findUnique({
      where: { email: user.email! },
      select: { status: true },
    });
    isGuest = false;
    isApproved = account?.status === 'APPROVED';
  }

  // Fetch products according to access level
  let dbProducts;
  if (isApproved) {
    dbProducts = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  } else {
    // Guest & pending: only 10 featured products
    dbProducts = await prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  const products: Product[] = dbProducts.map(mapDbProductToProduct);

  return (
    <div className="bg-ivory min-h-screen pt-20">
      <Navbar />
      <ProductsClientPage products={products} isApproved={isApproved} isGuest={isGuest} />
      <Footer />
      <FloatingWhatsApp />
      {isApproved && <FloatingQuoteCart />}
      {isApproved && <QuoteCartDrawer />}
    </div>
  );
}
