/**
 * Compatibility bridge: MetalPrices shape (from /api/metal-prices) → pricing engine.
 *
 * The /api/metal-prices endpoint returns INR/gram values, pricing settings
 * (wastageFactor, labourCostPerGram, platingCostFactor, exchangeRateUSDtoINR),
 * and a stonePrices map so a single fetch drives all calculations.
 */

import { MetalPrices, QuoteItem, PricingSettings, StonePriceMap } from '@/types';
import { calculateItemPrice as calcPrice } from './pricing';
import type { KitcoSpotPrices } from './kitco';

function metalPricesToKitcoSpot(prices: MetalPrices): KitcoSpotPrices {
  const raw = prices.raw;
  return {
    goldUSDPerGram:   raw?.goldUSDPerGram   ?? (prices.gold['24K']   ?? 75),
    silverUSDPerGram: raw?.silverUSDPerGram ?? (prices.silver['999'] ?? 0.9),
    brassUSDPerGram:  raw?.brassUSDPerGram  ?? 0.08,
    source:           'from-metal-prices-api',
    fetchedAt:        prices.updatedAt ?? new Date().toISOString(),
  };
}

function getSettings(prices: MetalPrices): PricingSettings {
  return prices.settings ?? {
    wastageFactor:        1.07,
    labourCostPerGram:    0,
    platingCostFactor:    0,
    exchangeRateUSDtoINR: 83.5,
  };
}

function getStonePrices(prices: MetalPrices): StonePriceMap {
  return prices.stonePrices ?? {};
}

/**
 * Calculate USD price for a single quote item (quantity respected).
 */
export function calculateItemPrice(item: QuoteItem, prices: MetalPrices): number {
  if (!prices) return 0;

  const spotPrices  = metalPricesToKitcoSpot(prices);
  const settings    = getSettings(prices);
  const stonePrices = getStonePrices(prices);

  const { P } = calcPrice({
    product:                 item.product,
    karat:                   item.selectedKarat,
    selectedStone:           item.selectedStone ?? 'None',
    selectedSecondaryStone:  item.selectedSecondaryStone,
    secondaryGemstoneCount:  item.secondaryGemstoneCount,
    spotPrices,
    stonePrices,
    settings,
  });

  return P * item.quantity;
}

/**
 * Calculate total USD price for all items in the cart.
 */
export function calculateQuoteTotal(items: QuoteItem[], prices: MetalPrices): number {
  if (!prices) return 0;
  return items.reduce((sum, item) => sum + calculateItemPrice(item, prices), 0);
}

/**
 * Get full price breakdown for a single piece (qty=1) — used in cart drawer and PDF.
 */
export function getItemBreakdown(item: QuoteItem, prices: MetalPrices) {
  const spotPrices  = metalPricesToKitcoSpot(prices);
  const settings    = getSettings(prices);
  const stonePrices = getStonePrices(prices);

  return calcPrice({
    product:                 item.product,
    karat:                   item.selectedKarat,
    selectedStone:           item.selectedStone ?? 'None',
    selectedSecondaryStone:  item.selectedSecondaryStone,
    secondaryGemstoneCount:  item.secondaryGemstoneCount,
    spotPrices,
    stonePrices,
    settings,
  });
}

export function getMetalPricePerGram(metal: string, karat: string, prices: MetalPrices): number {
  if (metal === 'gold')   return prices.gold[karat]   ?? prices.gold['18K']   ?? 0;
  if (metal === 'silver') return prices.silver[karat] ?? prices.silver['925'] ?? 0;
  return 0;
}
