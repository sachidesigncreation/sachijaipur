import { prisma } from '@/lib/db';
import { mapDbProductToProduct } from '@/lib/mapDbProduct';
import { featuredProducts as staticFeatured } from '@/data/products';
import BestsellersCarouselClient from './BestsellersCarouselClient';

export default async function BestsellersCarousel() {
  const dbRows = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  const fromDb = dbRows.map(mapDbProductToProduct);
  const products = fromDb.length > 0 ? fromDb : staticFeatured.slice(0, 8);

  return <BestsellersCarouselClient products={products} />;
}
