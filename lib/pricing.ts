/**
 * Pricing engine — dual-stone formula:
 *
 *   P = w × m × wastageFactor
 *     + N1 × (s1 + st1)   ← primary gemstone  (product.primaryGemstone / selectedStone)
 *     + N2 × (s2 + st2)   ← secondary gemstone (product.availableStones / selectedSecondaryStone)
 *     + L × w
 *     + platingFactor × w × m
 *
 * w             = weight in grams                   (product.weightGrams)
 * m             = karat-adjusted spot price ₹/g   (live from metal-prices API)
 * wastageFactor = metal wastage multiplier           (SiteSettings: wastageFactor, default 1.07)
 * N1            = primary gemstone count             (client-selected; defaults to product.gemstoneCount)
 * s1, st1       = primary stone cost + satin ₹       (StonePrice lookup)
 * N2            = secondary gemstone count           (client-selected; 0 if no secondary stone)
 * s2, st2       = secondary stone cost + satin ₹     (StonePrice lookup)
 * L             = labour cost ₹/g                    (product.makingChargeC if > 0, else SiteSettings: labourCostPerGram)
 * platingFactor = dimensionless plating cost factor  (SiteSettings: platingCostFactor)
 */

import type { Product, PricingSettings, StonePriceMap } from '@/types';
import type { KitcoSpotPrices } from './kitco';

const KARAT_PURITY: Record<string, number> = {
  '9K':   0.375,
  '10K':  0.4167,
  '14K':  0.5833,
  '18K':  0.75,
  '22K':  0.9167,
  '24K':  1.0,
  '925':  0.925,
  '999':  0.999,
};

export interface PriceBreakdown {
  w:              number;
  m:              number;
  wastageFactor:  number;
  metalCost:      number;
  // Primary stone
  N1:             number;
  s1:             number;
  st1:            number;
  stoneCost1:     number;
  // Secondary stone
  N2:             number;
  s2:             number;
  st2:            number;
  stoneCost2:     number;
  // Combined stone cost (stoneCost1 + stoneCost2) — used by cart/PDF totals
  stoneCost:      number;
  L:              number;
  labourCost:     number;
  platingFactor:  number;
  platingCost:    number;
  P:              number;
  pINR:           number;
  exchangeRate:   number;
}

export function calculateItemPrice(params: {
  product:                  Product;
  karat:                    string;
  selectedStone:            string;
  selectedSecondaryStone?:  string;
  secondaryGemstoneCount?:  number;
  spotPrices:               KitcoSpotPrices;
  stonePrices:              StonePriceMap;
  settings:                 PricingSettings;
}): PriceBreakdown {
  const {
    product, karat, selectedStone,
    selectedSecondaryStone, secondaryGemstoneCount,
    spotPrices, stonePrices, settings,
  } = params;

  const w = product.weightGrams ?? 0;

  // Karat-adjusted spot price
  let baseSpot: number;
  switch (product.baseMetal) {
    case 'gold':   baseSpot = spotPrices.goldUSDPerGram;   break;
    case 'silver': baseSpot = spotPrices.silverUSDPerGram; break;
    case 'brass':  baseSpot = spotPrices.brassUSDPerGram;  break;
    default:       baseSpot = spotPrices.silverUSDPerGram;
  }
  const purity      = KARAT_PURITY[karat] ?? 1;
  const m           = baseSpot * purity;
  const wastageFactor = settings.wastageFactor ?? 1.07;
  const metalCost   = w * m * wastageFactor;

  // Primary stone
  const N1          = product.gemstoneCount ?? 1;
  const key1        = selectedStone && selectedStone !== 'None' ? selectedStone : 'None';
  const entry1      = stonePrices[key1] ?? { priceD: 0, satinCost: 0 };
  const s1          = entry1.priceD;
  const st1         = entry1.satinCost;
  const stoneCost1  = N1 * (s1 + st1);

  // Secondary stone
  const N2          = secondaryGemstoneCount ?? 0;
  const key2        = selectedSecondaryStone && selectedSecondaryStone !== 'None' ? selectedSecondaryStone : 'None';
  const entry2      = stonePrices[key2] ?? { priceD: 0, satinCost: 0 };
  const s2          = entry2.priceD;
  const st2         = entry2.satinCost;
  const stoneCost2  = N2 * (s2 + st2);

  const stoneCost   = stoneCost1 + stoneCost2;

  const L           = product.makingChargeC > 0 ? product.makingChargeC : (settings.labourCostPerGram ?? 0);
  const labourCost  = L * w;

  const platingFactor = settings.platingCostFactor ?? 0;
  const platingCost   = platingFactor * w * m;

  const P    = metalCost + stoneCost + labourCost + platingCost;
  const pINR = P * (settings.exchangeRateUSDtoINR ?? 83.5);

  return {
    w, m, wastageFactor, metalCost,
    N1, s1, st1, stoneCost1,
    N2, s2, st2, stoneCost2,
    stoneCost,
    L, labourCost,
    platingFactor, platingCost,
    P, pINR,
    exchangeRate: settings.exchangeRateUSDtoINR ?? 83.5,
  };
}

export function calculateQuoteTotal(
  items: Array<{
    product:                  Product;
    selectedKarat:            string;
    selectedStone?:           string;
    selectedSecondaryStone?:  string;
    secondaryGemstoneCount?:  number;
    quantity:                 number;
  }>,
  spotPrices:  KitcoSpotPrices,
  stonePrices: StonePriceMap,
  settings:    PricingSettings,
): { totalUSD: number; totalINR: number } {
  let totalUSD = 0;

  for (const item of items) {
    const { P } = calculateItemPrice({
      product:                 item.product,
      karat:                   item.selectedKarat,
      selectedStone:           item.selectedStone ?? 'None',
      selectedSecondaryStone:  item.selectedSecondaryStone,
      secondaryGemstoneCount:  item.secondaryGemstoneCount,
      spotPrices,
      stonePrices,
      settings,
    });
    totalUSD += P * item.quantity;
  }

  const exchangeRate = settings.exchangeRateUSDtoINR ?? 83.5;
  return { totalUSD, totalINR: totalUSD * exchangeRate };
}
