import { NextResponse } from 'next/server';
import { getSiteSettingsMap } from '@/lib/siteSettings';
import {
  footerFromMap,
  themeFromMap,
  imagesFromMap,
  contentFromMap,
  COMPANY_DEFAULTS,
  CONTENT_DEFAULTS,
} from '@/lib/siteConfig';
import { normalizeCurrency, DEFAULT_USD_TO_INR } from '@/lib/currency';

/**
 * Public site configuration for client components (contact info, theme,
 * editable images, currency). Only exposes non-sensitive display keys.
 */
export async function GET() {
  const map = await getSiteSettingsMap();
  const fx = parseFloat(map.exchangeRateUSDtoINR ?? '') || DEFAULT_USD_TO_INR;

  return NextResponse.json({
    brand: 'Sachi Jaipur',
    footer: footerFromMap(map),
    company: {
      name: 'Sachi Jaipur',
      address: map.footer_address?.trim() || COMPANY_DEFAULTS.address,
      email: map.footer_email?.trim() || COMPANY_DEFAULTS.email,
      phone: map.footer_phone?.trim() || COMPANY_DEFAULTS.phone,
      whatsapp: map.footer_whatsapp?.trim() || COMPANY_DEFAULTS.whatsapp,
      gst: map.footer_gst?.trim() || COMPANY_DEFAULTS.gst,
      hours1: map.contact_hours_1?.trim() || CONTENT_DEFAULTS.contact_hours_1,
      hours2: map.contact_hours_2?.trim() || CONTENT_DEFAULTS.contact_hours_2,
    },
    theme: themeFromMap(map),
    images: imagesFromMap(map),
    content: contentFromMap(map),
    displayCurrency: normalizeCurrency(map.displayCurrency),
    usdToInrRate: fx,
  });
}
