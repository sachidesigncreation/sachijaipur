/**
 * Indian market spot prices — website-in branch only.
 *
 * Primary:   Metals.Dev API (https://metals.dev)
 *   • ibja_gold   — IBJA Gold benchmark (RBI-approved, India standard)
 *   • mcx_silver  — MCX Silver (Indian commodity exchange, live)
 *   • lme_copper  — LME Copper (proxy for brass base cost)
 *   • currency=USD&unit=g → USD per gram, already reflecting Indian
 *     market premium (import duty ≈15% + MCX basis vs. COMEX)
 *   Plans: Free 100 req/month | Copper $1.79/month 2,000 req/month
 *   Sign up: https://metals.dev  (no card for free tier)
 *   Set env:  METALS_DEV_API_KEY=your_key_here
 *
 * Fallback:  MetalMetric (COMEX/LBMA, same as .com branch)
 *            — less accurate for India but never breaks the app
 *
 * Brass:     Not exchange-traded. Proxy = LME Copper × 0.70
 *            (brass is ~70 % copper by weight).
 */

import type { KitcoSpotPrices } from './kitco';
import { fetchKitcoPrices } from './kitco';

const TROY_OZ_TO_GRAM = 31.1034768;

interface MetalsDevResponse {
  status: string;
  currency: string;
  unit: string;
  metals: Record<string, number>;
}

// Sanity ranges for USD/gram values
const GOLD_MIN_G   = 15;    // ~$467/toz
const GOLD_MAX_G   = 500;   // absurd ceiling
const SILVER_MIN_G = 0.2;   // ~$6/toz
const SILVER_MAX_G = 10;
const COPPER_MIN_G = 0.003; // ~$3,000/MT
const COPPER_MAX_G = 0.05;  // ~$50,000/MT

async function fetchMetalsDev(): Promise<KitcoSpotPrices | null> {
  const apiKey = process.env.METALS_DEV_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') return null;

  try {
    const res = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=g`,
      {
        next: { revalidate: 300 },
        headers: { Accept: 'application/json' },
      }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as MetalsDevResponse;
    if (data?.status !== 'success') return null;

    const m = data.metals ?? {};

    // Gold: prefer ibja_gold → mcx_gold_am → mcx_gold → spot gold
    const goldRaw =
      m.ibja_gold     ??
      m.mcx_gold_am   ??
      m.mcx_gold      ??
      m.gold;

    // Silver: prefer mcx_silver_am → mcx_silver → spot silver
    const silverRaw =
      m.mcx_silver_am ??
      m.mcx_silver    ??
      m.silver;

    // Brass proxy: LME copper → spot copper; multiply by 0.70 (brass Cu fraction)
    const copperRaw = m.lme_copper ?? m.copper;

    // Validate ranges
    if (
      typeof goldRaw   !== 'number' || !Number.isFinite(goldRaw)   || goldRaw   < GOLD_MIN_G   || goldRaw   > GOLD_MAX_G   ||
      typeof silverRaw !== 'number' || !Number.isFinite(silverRaw) || silverRaw < SILVER_MIN_G || silverRaw > SILVER_MAX_G
    ) {
      console.warn('[india-metals] Metals.Dev returned out-of-range values', { goldRaw, silverRaw });
      return null;
    }

    const brassUSDPerGram =
      typeof copperRaw === 'number' &&
      Number.isFinite(copperRaw) &&
      copperRaw >= COPPER_MIN_G &&
      copperRaw <= COPPER_MAX_G
        ? copperRaw * 0.70
        : 0.007; // static USD/g fallback for brass

    return {
      goldUSDPerGram:   goldRaw,
      silverUSDPerGram: silverRaw,
      brassUSDPerGram,
      source:           'metals.dev-ibja-mcx',
      fetchedAt:        new Date().toISOString(),
    };
  } catch (err) {
    console.warn('[india-metals] Metals.Dev fetch error:', err);
    return null;
  }
}

/**
 * Fetch Indian market spot prices.
 * Returns prices in USD/gram sourced from IBJA/MCX — which already embed
 * the Indian import duty premium. Multiply by exchangeRateUSDtoINR (from
 * SiteSettings) to get accurate INR/gram values.
 */
export async function fetchIndiaMetalPrices(): Promise<KitcoSpotPrices> {
  // 1. Try Metals.Dev (IBJA/MCX — true Indian market rates)
  const md = await fetchMetalsDev();
  if (md) {
    return md;
  }

  // 2. Fallback to MetalMetric/Binance/CoinGecko (COMEX prices)
  //    Less accurate for India (misses import duty) but keeps the app running.
  console.warn('[india-metals] Metals.Dev unavailable; falling back to COMEX prices via MetalMetric');
  return fetchKitcoPrices();
}
