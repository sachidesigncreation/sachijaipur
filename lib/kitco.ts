/**
 * Live precious-metal spot prices — always in USD per gram.
 *
 * Primary:   GoldPricez API (https://goldpricez.com) — free tier, API key required.
 *            Returns Indian-market INR/gram (import duty, GST, local premiums
 *            included); converted here to USD/gram at the live Frankfurter rate
 *            so every downstream consumer sees consistent USD/gram units.
 *            Set GOLDPRICEZ_API_KEY in .env to enable.
 *
 * Fallback:  MetalMetric (COMEX/LBMA, free, no key) for USD prices.
 *
 * Last resort: static dummy USD prices so the app never breaks.
 *
 * ALL returned values are USD per gram. /api/metal-prices multiplies by
 * exchangeRateUSDtoINR to get the INR/gram values the pricing formula runs on.
 */

const TROY_OZ_TO_GRAM       = 31.1034768;
const BRASS_USD_PER_GRAM    = 0.008;  // ~$8/kg industrial proxy (70% Cu fraction)
const FALLBACK_FX           = 84;

export interface KitcoSpotPrices {
  goldUSDPerGram:   number; // USD/gram
  silverUSDPerGram: number; // USD/gram
  brassUSDPerGram:  number; // USD/gram
  source:           string;
  fetchedAt:        string;
}

// ─── Primary: GoldPricez (true Indian market INR prices) ────────────────────

interface GoldPricezResponse {
  gram_in_inr?:         number | string;
  silver_gram_in_inr?:  number | string;
  [key: string]: unknown;
}

async function fetchGoldPricez(): Promise<{ goldINRPerGram: number; silverINRPerGram: number } | null> {
  const apiKey = process.env.GOLDPRICEZ_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      'https://goldpricez.com/api/rates/currency/inr/measure/gram/metal/all',
      {
        next: { revalidate: 300 },
        headers: { Accept: 'application/json', 'X-API-KEY': apiKey },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as GoldPricezResponse;

    const goldINRPerGram   = parseFloat(String(data.gram_in_inr        ?? ''));
    const silverINRPerGram = parseFloat(String(data.silver_gram_in_inr ?? ''));

    if (
      !Number.isFinite(goldINRPerGram)   || goldINRPerGram   < 2000 || goldINRPerGram   > 1_000_000 ||
      !Number.isFinite(silverINRPerGram) || silverINRPerGram < 20   || silverINRPerGram > 50_000
    ) {
      return null;
    }

    return { goldINRPerGram, silverINRPerGram };
  } catch {
    return null;
  }
}

// ─── Fallback A: MetalMetric USD prices ─────────────────────────────────────

interface MetalMetricResponse {
  prices: {
    gold:   { price_per_oz: number };
    silver: { price_per_oz: number };
  };
}

async function fetchMetalMetricUSD(): Promise<{ goldUSDPerOz: number; silverUSDPerOz: number } | null> {
  try {
    const res = await fetch('https://metalmetric.com/api/gpt?action=spot_prices&metal=all', {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as MetalMetricResponse;

    const goldUSDPerOz   = data?.prices?.gold?.price_per_oz;
    const silverUSDPerOz = data?.prices?.silver?.price_per_oz;

    if (
      typeof goldUSDPerOz   !== 'number' || goldUSDPerOz   < 500  ||
      typeof silverUSDPerOz !== 'number' || silverUSDPerOz < 5
    ) return null;

    return { goldUSDPerOz, silverUSDPerOz };
  } catch {
    return null;
  }
}

// ─── Fallback B: Frankfurter live USD→INR rate ───────────────────────────────

async function fetchUSDtoINR(): Promise<number | null> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR', {
      next: { revalidate: 3600 }, // exchange rate changes slowly
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: { INR?: number } };
    const rate = data?.rates?.INR;
    if (typeof rate !== 'number' || rate < 50 || rate > 200) return null;
    return rate;
  } catch {
    return null;
  }
}

// ─── Last resort: static dummy USD prices ───────────────────────────────────

function dummyPrices(): KitcoSpotPrices {
  return {
    goldUSDPerGram:   155,   // ≈ $155/g COMEX + India premium proxy
    silverUSDPerGram: 2.1,   // ≈ $2.10/g proxy
    brassUSDPerGram:  BRASS_USD_PER_GRAM,
    source:           'dummy-fallback',
    fetchedAt:        new Date().toISOString(),
  };
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function fetchKitcoPrices(): Promise<KitcoSpotPrices> {
  const fetchedAt = new Date().toISOString();

  // Live FX first — needed to normalize GoldPricez INR into USD/gram.
  const fxRate = (await fetchUSDtoINR()) ?? FALLBACK_FX;

  // 1. Try GoldPricez — true Indian-market INR prices (import duty + GST included)
  const gp = await fetchGoldPricez();
  if (gp) {
    return {
      goldUSDPerGram:   gp.goldINRPerGram   / fxRate,
      silverUSDPerGram: gp.silverINRPerGram / fxRate,
      brassUSDPerGram:  BRASS_USD_PER_GRAM,
      source:           'goldpricez-india-usd',
      fetchedAt,
    };
  }

  if (process.env.GOLDPRICEZ_API_KEY) {
    console.warn('[metal-spot] GoldPricez returned invalid data, trying MetalMetric fallback…');
  } else {
    console.warn('[metal-spot] GOLDPRICEZ_API_KEY not set — using MetalMetric fallback (international spot, ~10–15% below Indian market)');
  }

  // 2. MetalMetric USD/oz → USD/gram (no FX conversion here; the
  //    /api/metal-prices route applies the admin exchange rate exactly once)
  const mm = await fetchMetalMetricUSD();

  if (mm) {
    return {
      goldUSDPerGram:   mm.goldUSDPerOz   / TROY_OZ_TO_GRAM,
      silverUSDPerGram: mm.silverUSDPerOz / TROY_OZ_TO_GRAM,
      brassUSDPerGram:  BRASS_USD_PER_GRAM,
      source:           'metalmetric-comex-usd',
      fetchedAt,
    };
  }

  console.warn('[metal-spot] All live sources failed; using dummy USD prices');
  return dummyPrices();
}
