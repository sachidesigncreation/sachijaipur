import { prisma } from '@/lib/db';

/**
 * Resolve a product from `/products/[param]` where `param` may be the Prisma `id` (cuid)
 * or a unique `sku` (useful for stable URLs and legacy links).
 */
export async function getProductByRouteParam(param: string) {
  const key = decodeURIComponent(param);
  return prisma.product.findFirst({
    where: {
      OR: [{ id: key }, { sku: key }],
    },
  });
}
