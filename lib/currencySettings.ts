/**
 * Server-side read of the display-currency settings.
 *
 * The display currency is controlled solely from Admin → Settings.
 * Server components (e.g. MetalTicker) need the currency even when the
 * /api/metal-prices round-trip fails, so they read SiteSettings directly
 * rather than depending on the API payload.
 */

import { prisma } from '@/lib/db';
import { currencyContext, DEFAULT_USD_TO_INR, type CurrencyContext } from '@/lib/currency';

export async function getCurrencyContext(): Promise<CurrencyContext> {
  try {
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: ['displayCurrency', 'exchangeRateUSDtoINR'] } },
    });

    const map: Record<string, string> = {};
    rows.forEach(r => { map[r.key] = r.value; });

    return currencyContext({
      displayCurrency: map.displayCurrency,
      usdToInrRate:    parseFloat(map.exchangeRateUSDtoINR ?? '') || DEFAULT_USD_TO_INR,
    });
  } catch {
    // DB unreachable — fall back to the site default rather than breaking render.
    return currencyContext(null);
  }
}
