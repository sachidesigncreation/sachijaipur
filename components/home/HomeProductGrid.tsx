import { prisma } from '@/lib/db';
import { mapDbProductToProduct } from '@/lib/mapDbProduct';
import { products as staticProducts } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default async function HomeProductGrid() {
  const dbRows = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  const fromDb = dbRows.map(mapDbProductToProduct);
  const items = fromDb.length > 0 ? fromDb : staticProducts.slice(0, 12);

  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal className="text-center mb-14 flex flex-col items-center">
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
            Our Products
          </span>
          <h2 className="font-cormorant text-display-md text-charcoal mb-6">
            Shop the Collection
          </h2>
          <div className="h-px w-12 bg-gold" />
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-14">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products" className="btn-primary">
            View Full Catalogue →
          </Link>
        </div>
      </div>
    </section>
  );
}
