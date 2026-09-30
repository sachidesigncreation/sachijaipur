/**
 * Central site configuration — Sachi Jaipur.
 *
 * Brand is "Sachi Jaipur" everywhere (no "Sachi Jewellery Co.", no SEZ-II,
 * no "export" wording in visible copy).
 *
 * Editable via Admin → Settings and stored in the SiteSettings key-value
 * table. Every getter falls back to the defaults below so the site renders
 * even when keys have never been saved.
 */

export const BRAND_NAME = 'Sachi Jaipur';

export const COMPANY_DEFAULTS = {
  name: BRAND_NAME,
  // No SEZ-II — plain Sitapura address.
  address: 'Sitapura Industrial Area, Jaipur, Rajasthan 302022, India',
  email: 'contact@sachijewellery.com',
  phone: '+91 89469 31404',
  whatsapp: '918946931404',
  gst: '08ACSFS4747G1ZI',
} as const;

/** Footer keys (all editable in Admin → Settings). */
export const FOOTER_DEFAULTS: Record<string, string> = {
  footer_brand: BRAND_NAME,
  footer_tagline: 'A legacy of craftsmanship from the heart of Jaipur. Trusted worldwide.',
  footer_address: COMPANY_DEFAULTS.address,
  footer_email: COMPANY_DEFAULTS.email,
  footer_phone: COMPANY_DEFAULTS.phone,
  footer_whatsapp: COMPANY_DEFAULTS.whatsapp,
  footer_gst: COMPANY_DEFAULTS.gst,
};

/** Theme keys (all editable in Admin → Settings as color pickers). Must stay
 *  in sync with the defaults in app/globals.css @theme. */
export const THEME_DEFAULTS: Record<string, string> = {
  theme_gold: '#c9922a',
  theme_gold_deep: '#a67318',
  theme_gold_light: '#f5e6c8',
  theme_ivory: '#fdfaf4',
  theme_pearl: '#f9f6ef',
  theme_charcoal: '#2c2a27',
  theme_charcoal_light: '#4a4743',
  theme_warm: '#7a7670',
  theme_jet: '#111010',
};

/** Full-bleed / section images (all editable in Admin → Settings).
 *  Values may be a /public path, an https URL, or an R2 key. */
export const IMAGE_DEFAULTS: Record<string, string> = {
  hero_1: '/HomePageImage.webp',
  hero_2: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
  hero_3: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80',
  hero_4: '/HomePageAbout.webp',
  spotlight_gold: '/HomePageImage.webp',
  spotlight_silver: '/HomePageAbout.webp',
  spotlight_brass: '/BentoGrid/4.png',
  collection_gold: '/BentoGrid/1.png',
  collection_silver: '/BentoGrid/2.png',
  collection_brass: '/BentoGrid/3.png',
  collection_gemstone: '/BentoGrid/4.png',
  home_about: '/HomePageAbout.webp',
  about_cover: '/HomePageImage.webp',
  about_img1: '/BentoGrid/1.png',
  about_img2: '/BentoGrid/3.png',
  bento_1: '/BentoGrid/1.png',
  bento_2: '/BentoGrid/2.png',
  bento_3: '/BentoGrid/3.png',
  bento_4: '/BentoGrid/4.png',
  bento_6: '/BentoGrid/6.png',
  process_1: '/Processes/1.%20Concept%20%26%20Design.webp',
  process_2: '/Processes/2.3d%20Modeling%20.webp',
  process_3: '/Processes/3.%20mold%20Making.webp',
  process_4: '/Processes/4.%20Wax%20Injection.webp',
  process_5: '/Processes/5.%20Casting%20.webp',
  process_6: '/Processes/6.%20Cuttin%20and%20Filling.webp',
  process_7: '/Processes/7.%20Pre%20Polishing.webp',
  process_8: '/Processes/8.%20Stone%20Setting.webp',
  process_9: '/Processes/9.%20Final%20Polishing.webp',
  process_10: '/Processes/10.%20Plating.webp',
  process_11: '/Processes/11.%20Quality%20Control.webp',
  process_12: '/Processes/12.%20packaging%20.webp',
};

/** Page copy — every headline, subtext and paragraph on the built-in pages.
 *  All editable in Admin → Settings → Page Content. */
export const CONTENT_DEFAULTS: Record<string, string> = {
  hero_1_label: 'Gold Collections',
  hero_1_heading: 'Crafted in Jaipur.\nTrusted Worldwide.',
  hero_1_subtext: 'Fine gold jewellery manufacturing and wholesale.',
  hero_2_label: 'Silver Collections',
  hero_2_heading: 'Sterling\nCraftsmanship.',
  hero_2_subtext: '925 Sterling Silver jewellery with precision stone setting.',
  hero_3_label: 'Gemstone Collections',
  hero_3_heading: 'Colour\nat Its Finest.',
  hero_3_subtext: 'Expertly sourced colour gemstones set in gold, silver & brass.',
  hero_4_label: 'OEM / ODM Manufacturing',
  hero_4_heading: 'Your Vision,\nOur Craftsmanship.',
  hero_4_subtext: '150 skilled craftsmen. End-to-end production from your design.',
  spotlight_gold_label: 'Gold Collections',
  spotlight_gold_title: 'Where Purity Meets Artistry',
  spotlight_gold_desc: 'Our gold jewellery range spans 9K through 22K — rings, earrings, pendants, bangles, and necklaces crafted for global retail buyers. Each piece is produced to a consistent standard with in-house CAD, precision casting, and hand-finishing by our master craftsmen.',
  spotlight_silver_label: 'Silver Collections',
  spotlight_silver_title: '925 Sterling Silver, Perfected',
  spotlight_silver_desc: 'From minimalist stackable bands to bold gemstone statement pieces, our 925 sterling silver catalogue is built for versatility. We cater to boutique buyers and large-scale wholesale orders alike, with hallmarked purity and consistent finishing on every batch.',
  spotlight_brass_label: 'Brass Collections',
  spotlight_brass_title: 'Bold, Fashion-Forward Brass',
  spotlight_brass_desc: 'Our brass jewellery collection bridges traditional craftsmanship with contemporary fashion trends. Gold-plated, lacquered, or left natural — brass is an ideal canvas for larger statement pieces with vibrant colour gemstone inlays, perfect for trend-driven buyers.',
  brand_eyebrow: 'Our Heritage',
  brand_heading: 'The Art of Fine Jewellery Manufacturing',
  brand_para1: 'Jaipur has long been the heartbeat of India\u2019s fine jewellery tradition — a city where craftsmanship is passed down through generations and every piece carries the weight of centuries of artisanal mastery. Sachi Jaipur was built upon this legacy, combining timeless techniques with modern manufacturing standards that meet the demands of global markets.',
  brand_para2: 'We specialise in large-scale production of gold, silver, and brass jewellery with colour gemstone settings — serving international wholesalers, private-label brands, and boutique retailers across eight global markets. Our in-house CAD design team, precision casting facilities, and 150 skilled craftsmen work under one roof to deliver consistency at every tier of volume.',
  brand_para3: 'Operating from the Sitapura Industrial Area in Jaipur, we are positioned to offer fully compliant services with competitive lead times. Whether you need OEM manufacturing from your design files or a custom ODM collection built from scratch, Sachi is your end-to-end fine jewellery partner.',
  about_intro: 'Sachi Jaipur is a fine jewellery manufacturing company based in Jaipur, the heart of India\u2019s jewellery hub. Located in the Sitapura Industrial Area, Rajasthan, we have established a strong reputation as a global leader in the sustainable mass production and wholesale of both precious and semi-precious jewellery.',
  about_p1: 'Our journey is defined by innovation, trust, and timeless craftsmanship. With a dedicated team of passionate jewellery designers trained at prestigious design institutions, we bring creativity and originality to every collection. Our skilled CAD designers and master craftsmen ensure that each piece reflects precision, elegance, and international quality standards.',
  about_p2: 'At Sachi Jaipur, we pride ourselves on blending traditional artistry with cutting-edge technology. This synergy allows us to consistently deliver exquisite designs that cater to diverse global markets, from classic pieces to contemporary trends. With sustainability at the core of our practices, we aim to not only create jewellery but also foster long-lasting relationships with our partners worldwide.',
  contact_hours_1: 'Monday - Saturday: 10:00 AM - 7:00 PM (IST)',
  contact_hours_2: 'Sunday: Closed',
};

export const ALL_SITE_DEFAULTS: Record<string, string> = {
  ...FOOTER_DEFAULTS,
  ...THEME_DEFAULTS,
  ...IMAGE_DEFAULTS,
  ...CONTENT_DEFAULTS,
};

export function getSetting(
  map: Record<string, string>,
  key: string,
  fallback: string,
): string {
  const v = map[key];
  return typeof v === 'string' && v.trim() !== '' ? v : fallback;
}

export function footerFromMap(map: Record<string, string>) {
  return {
    brand: getSetting(map, 'footer_brand', FOOTER_DEFAULTS.footer_brand),
    tagline: getSetting(map, 'footer_tagline', FOOTER_DEFAULTS.footer_tagline),
    address: getSetting(map, 'footer_address', FOOTER_DEFAULTS.footer_address),
    email: getSetting(map, 'footer_email', FOOTER_DEFAULTS.footer_email),
    phone: getSetting(map, 'footer_phone', FOOTER_DEFAULTS.footer_phone),
    whatsapp: getSetting(map, 'footer_whatsapp', FOOTER_DEFAULTS.footer_whatsapp),
    gst: getSetting(map, 'footer_gst', FOOTER_DEFAULTS.footer_gst),
  };
}

export function themeFromMap(map: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [k, fallback] of Object.entries(THEME_DEFAULTS)) {
    out[k] = getSetting(map, k, fallback);
  }
  return out;
}

export function imagesFromMap(map: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [k, fallback] of Object.entries(IMAGE_DEFAULTS)) {
    out[k] = getSetting(map, k, fallback);
  }
  return out;
}

export function contentFromMap(map: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [k, fallback] of Object.entries(CONTENT_DEFAULTS)) {
    out[k] = getSetting(map, k, fallback);
  }
  return out;
}

/** Keep only safe hex colors (#rgb / #rrggbb / #rrggbbaa); otherwise the fallback. */
export function sanitizeHex(value: unknown, fallback: string): string {
  if (typeof value === 'string' && /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim())) {
    return value.trim();
  }
  return fallback;
}
