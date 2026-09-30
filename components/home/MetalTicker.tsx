import TickerClient from './TickerClient';
import { getCurrencyContext } from '@/lib/currencySettings';
import { formatRate } from '@/lib/currency';

async function getMetalPrices() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/metal-prices`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    // Fallback: approximate Indian market rates (IBJA/MCX) — April 2026 reference
    return {
      gold:   { '24K': 9450, '22K': 8662, '18K': 7088, '14K': 5512, '10K': 3937, '9K': 3544 },
      silver: { '999': 96, '925': 89 },
      updatedAt: null,
      fallback: true,
    };
  }
}

export default async function MetalTicker() {
  // Currency is read straight from SiteSettings so the ticker still renders in
  // the right currency when the metal-prices fetch above falls back.
  const [prices, currency] = await Promise.all([
    getMetalPrices(),
    getCurrencyContext(),
  ]);

  const fmt = (inrPerGram: number) => formatRate(inrPerGram, currency);

  const items = [
    `Gold 24K  ${fmt(prices.gold['24K'])}/g`,
    `Gold 22K  ${fmt(prices.gold['22K'])}/g`,
    `Gold 18K  ${fmt(prices.gold['18K'])}/g`,
    `Gold 14K  ${fmt(prices.gold['14K'])}/g`,
    `Gold 10K  ${fmt(prices.gold['10K'])}/g`,
    `Silver 999  ${fmt(prices.silver['999'])}/g`,
    `Silver 925  ${fmt(prices.silver['925'])}/g`,
    `Live Indian Market Rates`,
  ];

  return <TickerClient items={items} updatedAt={prices.updatedAt} />;
}
