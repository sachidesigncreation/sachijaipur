import type { Product } from '@/types';
import type { Product as ProductRow } from '@prisma/client';

export function mapDbProductToProduct(p: ProductRow): Product {
  return {
    id:                p.id,
    sku:               p.sku,
    name:              p.name,
    category:          p.category,
    description:       p.description,
    baseMetal:         p.baseMetal,
    purityOptions:     p.purityOptions,
    metalColorOptions: p.metalColorOptions,
    availableStones:   p.availableStones,
    primaryGemstone:   p.primaryGemstone,
    images:            p.images,
    featured:          p.featured,
    weightGrams:       p.weightGrams,
    makingChargeC:     p.makingChargeC,
    gemstoneCount:     p.gemstoneCount,
  };
}
