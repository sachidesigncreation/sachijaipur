import { NextResponse } from 'next/server';
import { fetchIndiaMetalPrices } from '@/lib/indiaMetals';
import { prisma } from '@/lib/db';
import { normalizeCurrency } from '@/lib/currency';

const DEFAULT_SETTINGS = {
  wastageFactor:        1.07,
  labourCostPerGram:    0,    // ₹/gram
  platingCostFactor:    0,
  exchangeRateUSDtoINR: 84.0, // fallback; admin can override in SiteSettings
};

export async function GET() {
  const [prices, dbSettings, dbStones] = await Promise.all([
    fetchIndiaMetalPrices(),
    prisma.siteSettings.findMany(),
    prisma.stonePrice.findMany(),
  ]);

  // Build settings map from DB, falling back to defaults
  const settingsMap: Record<string, string> = {};
  dbSettings.forEach(s => { settingsMap[s.key] = s.value; });

  const fx = parseFloat(settingsMap.exchangeRateUSDtoINR ?? '') || DEFAULT_SETTINGS.exchangeRateUSDtoINR;

  // Settings exposed to the client-side pricing formula.
  // exchangeRateUSDtoINR is set to 1 because all metal prices below are
  // already converted to ₹/gram — the formula output is natively in INR.
  const settings = {
    wastageFactor:        parseFloat(settingsMap.wastageFactor     ?? '') || DEFAULT_SETTINGS.wastageFactor,
    labourCostPerGram:    parseFloat(settingsMap.labourCostPerGram ?? '') || DEFAULT_SETTINGS.labourCostPerGram,
    platingCostFactor:    parseFloat(settingsMap.platingCostFactor ?? '') || DEFAULT_SETTINGS.platingCostFactor,
    exchangeRateUSDtoINR: 1, // prices are already in INR; no second conversion needed
  };

  // Stone prices — stored in DB as INR per piece (as labeled in Admin →
  // Settings → Stone & Satin Costs); passed through untouched since the
  // formula runs in ₹.
  const stonePrices: Record<string, { priceD: number; satinCost: number }> = {};
  dbStones.forEach(stone => {
    stonePrices[stone.stoneName] = {
      priceD:    stone.priceD,
      satinCost: stone.satinCost,
    };
  });

  // Convert USD/gram → ₹/gram using live or configured exchange rate
  const goldINR   = prices.goldUSDPerGram   * fx;
  const silverINR = prices.silverUSDPerGram * fx;
  const brassINR  = prices.brassUSDPerGram  * fx;

  const body = {
    gold: {
      '24K': goldINR * 1.0,
      '22K': goldINR * 0.9167,
      '18K': goldINR * 0.75,
      '14K': goldINR * 0.5833,
      '10K': goldINR * 0.4167,
      '9K':  goldINR * 0.375,
    },
    silver: {
      '999': silverINR * 0.999,
      '925': silverINR * 0.925,
    },
    brass: {
      standard: brassINR,
    },
    // raw field reuses USD key names but values are in ₹/gram.
    // exchangeRateUSDtoINR=1 above ensures the formula uses them as-is.
    raw: {
      goldUSDPerGram:   goldINR,
      silverUSDPerGram: silverINR,
      brassUSDPerGram:  brassINR,
    },
    settings,
    stonePrices,
    // Display currency is admin-controlled (Admin → Settings → Display).
    // Every money value above is in ₹; USD display divides by usdToInrRate.
    displayCurrency: normalizeCurrency(settingsMap.displayCurrency),
    usdToInrRate:    fx,
    source:    prices.source,
    updatedAt: prices.fetchedAt,
  };

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
