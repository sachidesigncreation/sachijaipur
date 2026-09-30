import ScrollReveal from '../ui/ScrollReveal';
import ProductCard from '../products/ProductCard';
import { featuredProducts as staticFeatured } from '@/data/products';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { mapDbProductToProduct } from '@/lib/mapDbProduct';

export default async function FeaturedProducts() {
  const dbRows = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const fromDb = dbRows.map(mapDbProductToProduct);
  const items = fromDb.length > 0 ? fromDb : staticFeatured;

  return (
    <section id="products" className="bg-ivory py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal className="text-center mb-16 flex flex-col items-center">
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
            Our Collections
          </span>
          <h2 className="font-cormorant text-display-md text-charcoal mb-6">
            Handpicked From Our Catalogue
          </h2>
          <div className="h-px w-16 bg-gold animate-scaleX-reveal" />
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products" className="btn-secondary">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
