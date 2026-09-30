/**
 * Display currency — INR (default) or USD.
 *
 * Every money value in this branch is computed natively in INR: the pricing
 * formula in lib/pricing.ts runs on ₹/gram metal rates and ₹ stone costs, so
 * P and pINR come out in rupees. Display currency is therefore a presentation
 * concern only — nothing upstream of the formatter changes.
 *
 * USD display divides the INR amount by exchangeRateUSDtoINR (SiteSettings),
 * which is the same rate /api/metal-prices used to build the ₹ rates in the
 * first place, so the round-trip is exact.
 *
 * Client-safe: no prisma, no server-only imports. The DB-backed counterpart is
 * getCurrencyContext() in lib/currencySettings.ts.
 */

export type Currency = 'INR' | 'USD';

export const DEFAULT_CURRENCY: Currency = 'INR';

/** Used when SiteSettings has no exchangeRateUSDtoINR — matches the API default. */
export const DEFAULT_USD_TO_INR = 84.0;

export const CURRENCY_OPTIONS: Array<{ value: Currency; label: string }> = [
  { value: 'INR', label: '₹  INR — Indian Rupee' },
  { value: 'USD', label: '$  USD — US Dollar' },
];

const SYMBOL: Record<Currency, string> = { INR: '₹',     USD: '$'     };
const LOCALE: Record<Currency, string> = { INR: 'en-IN', USD: 'en-US' };

export interface CurrencyContext {
  currency:     Currency;
  usdToInrRate: number;
}

/** Anything that isn't USD falls back to INR — the site default. */
export function normalizeCurrency(value: unknown): Currency {
  return typeof value === 'string' && value.trim().toUpperCase() === 'USD' ? 'USD' : DEFAULT_CURRENCY;
}

/**
 * Build a display context from a /api/metal-prices payload (or any object
 * carrying the two fields). Missing/invalid values default to INR.
 */
export function currencyContext(
  source?: { displayCurrency?: string | null; usdToInrRate?: number | null } | null,
): CurrencyContext {
  const rate = source?.usdToInrRate;
  return {
    currency:     normalizeCurrency(source?.displayCurrency),
    usdToInrRate: typeof rate === 'number' && Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_USD_TO_INR,
  };
}

/** Convert a natively-INR amount into the display currency. */
export function convertFromINR(amountINR: number, ctx: CurrencyContext): number {
  return ctx.currency === 'USD' ? amountINR / ctx.usdToInrRate : amountINR;
}

export function currencySymbol(ctx: CurrencyContext): string {
  return SYMBOL[ctx.currency];
}

/**
 * Format a natively-INR amount for display, e.g. "₹1,24,500" / "$1,482".
 * Whole units by default — jewellery prices don't need paise/cents.
 */
export function formatMoney(amountINR: number, ctx: CurrencyContext, decimals = 0): string {
  const value = convertFromINR(amountINR, ctx);
  return SYMBOL[ctx.currency] + value.toLocaleString(LOCALE[ctx.currency], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Per-gram metal rates. In USD these land in the single/double digits for
 * silver and brass, so whole units would round them to nothing — keep 2 dp.
 */
export function formatRate(amountINRPerGram: number, ctx: CurrencyContext): string {
  return formatMoney(amountINRPerGram, ctx, ctx.currency === 'USD' ? 2 : 0);
}

/**
 * ASCII-safe variant for jsPDF: the standard PDF fonts use WinAnsi encoding,
 * which has no ₹ glyph, so the symbol drops out of the generated quote.
 * Renders "INR 1,24,500" / "USD 1,482" instead.
 */
export function formatMoneyAscii(amountINR: number, ctx: CurrencyContext, decimals = 0): string {
  const value = convertFromINR(amountINR, ctx);
  return `${ctx.currency} ` + value.toLocaleString(LOCALE[ctx.currency], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
