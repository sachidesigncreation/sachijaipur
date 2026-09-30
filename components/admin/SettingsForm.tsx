'use client';

import { DEFAULT_CURRENCY } from '@/lib/currency';
import { FOOTER_DEFAULTS, THEME_DEFAULTS, IMAGE_DEFAULTS } from '@/lib/siteConfig';
import SiteSettingsEditor, { type SettingsGroup } from '@/components/admin/SiteSettingsEditor';

const FIELDS: SettingsGroup[] = [
  {
    section: 'Pricing Formula',
    note: 'P = w × m × wastageFactor  +  N × (s + st)  +  L × w  +  platingFactor × w × m  (all values in ₹)',
    fields: [
      { key: 'wastageFactor',     label: 'Wastage Factor',             type: 'number', placeholder: '1.07', note: 'Metal wastage multiplier applied to metal cost. Industry standard is 1.07 (7% wastage).' },
      { key: 'labourCostPerGram', label: 'Labour Cost L (₹/g)',        type: 'number', placeholder: '500',  note: 'Global labour cost per gram in INR. Overridden per product if "Per-Product Labour Override" is set > 0.' },
      { key: 'platingCostFactor', label: 'Plating Cost Factor P',      type: 'number', placeholder: '0.05', note: 'Dimensionless factor: P × weight × metal-rate. E.g. 0.05 = 5% of metal value added as plating cost.' },
    ],
  },
  {
    section: 'Display',
    fields: [
      {
        key: 'displayCurrency',
        label: 'Display Currency',
        type: 'currency',
        fallback: DEFAULT_CURRENCY,
        note: 'Site-wide currency for visitors — metal ticker, product estimates, quotation cart and quote PDF. Prices are stored and calculated in ₹; USD is converted at the exchange rate below.',
      },
      {
        key: 'exchangeRateUSDtoINR',
        label: 'Exchange Rate (1 USD = ₹)',
        type: 'number',
        placeholder: '84',
        note: 'Used to build ₹ metal rates from the IBJA/MCX feed, and to convert ₹ back to USD when Display Currency is USD.',
      },
      { key: 'showPricingToClients', label: 'Show Pricing to Approved Clients', type: 'toggle', note: 'If off, pricing is hidden from the catalogue for all logged-in clients.' },
    ],
  },
  {
    section: 'Footer & Contact — Sachi Jaipur',
    note: 'Shown in the footer on every page, on the Contact page, in the quote PDF and in emails. Address supports multiple lines.',
    fields: [
      { key: 'footer_brand',    label: 'Footer Brand Name', type: 'text', fallback: FOOTER_DEFAULTS.footer_brand, note: 'Bottom-bar copyright name. Header always shows Sachi Jaipur.' },
      { key: 'footer_tagline',  label: 'Footer Tagline',    type: 'textarea', fallback: FOOTER_DEFAULTS.footer_tagline },
      { key: 'footer_address',  label: 'Footer Address',    type: 'textarea', fallback: FOOTER_DEFAULTS.footer_address, note: 'One line per row. No SEZ wording.' },
      { key: 'footer_email',    label: 'Contact Email',     type: 'text', fallback: FOOTER_DEFAULTS.footer_email, placeholder: 'contact@sachijewellery.com' },
      { key: 'footer_phone',    label: 'Contact Phone',     type: 'text', fallback: FOOTER_DEFAULTS.footer_phone, placeholder: '+91 89469 31404' },
      { key: 'footer_whatsapp', label: 'WhatsApp Number',   type: 'text', fallback: FOOTER_DEFAULTS.footer_whatsapp, placeholder: '918946931404', note: 'Digits only with country code, e.g. 918946931404. Used for the WhatsApp button and footer link.' },
      { key: 'footer_gst',      label: 'GST Number',        type: 'text', fallback: FOOTER_DEFAULTS.footer_gst, placeholder: '08ACSFS4747G1ZI' },
    ],
  },
  {
    section: 'Color Theme',
    note: 'Brand colors applied site-wide. Changes take effect immediately after saving (page refresh).',
    fields: [
      { key: 'theme_gold',           label: 'Gold (primary)',   type: 'color', fallback: THEME_DEFAULTS.theme_gold },
      { key: 'theme_gold_deep',      label: 'Gold Deep (hover)', type: 'color', fallback: THEME_DEFAULTS.theme_gold_deep },
      { key: 'theme_gold_light',     label: 'Gold Light',       type: 'color', fallback: THEME_DEFAULTS.theme_gold_light },
      { key: 'theme_ivory',          label: 'Ivory (page bg)',  type: 'color', fallback: THEME_DEFAULTS.theme_ivory },
      { key: 'theme_pearl',          label: 'Pearl (alt bg)',   type: 'color', fallback: THEME_DEFAULTS.theme_pearl },
      { key: 'theme_charcoal',       label: 'Charcoal (text)',  type: 'color', fallback: THEME_DEFAULTS.theme_charcoal },
      { key: 'theme_charcoal_light', label: 'Charcoal Light',   type: 'color', fallback: THEME_DEFAULTS.theme_charcoal_light },
      { key: 'theme_warm',           label: 'Warm (muted text)', type: 'color', fallback: THEME_DEFAULTS.theme_warm },
      { key: 'theme_jet',            label: 'Jet (dark bg)',    type: 'color', fallback: THEME_DEFAULTS.theme_jet },
    ],
  },
  {
    section: 'Site Images',
    note: 'Every homepage / about image. Paste an https URL or /public path, or upload — uploads store an R2 key.',
    fields: [
      { key: 'hero_1', label: 'Hero Slide 1', type: 'image', fallback: IMAGE_DEFAULTS.hero_1 },
      { key: 'hero_2', label: 'Hero Slide 2', type: 'image', fallback: IMAGE_DEFAULTS.hero_2 },
      { key: 'hero_3', label: 'Hero Slide 3', type: 'image', fallback: IMAGE_DEFAULTS.hero_3 },
      { key: 'hero_4', label: 'Hero Slide 4', type: 'image', fallback: IMAGE_DEFAULTS.hero_4 },
      { key: 'spotlight_gold',   label: 'Gold Spotlight',   type: 'image', fallback: IMAGE_DEFAULTS.spotlight_gold },
      { key: 'spotlight_silver', label: 'Silver Spotlight', type: 'image', fallback: IMAGE_DEFAULTS.spotlight_silver },
      { key: 'spotlight_brass',  label: 'Brass Spotlight',  type: 'image', fallback: IMAGE_DEFAULTS.spotlight_brass },
      { key: 'collection_gold',     label: 'Collection — Gold',     type: 'image', fallback: IMAGE_DEFAULTS.collection_gold },
      { key: 'collection_silver',   label: 'Collection — Silver',   type: 'image', fallback: IMAGE_DEFAULTS.collection_silver },
      { key: 'collection_brass',    label: 'Collection — Brass',    type: 'image', fallback: IMAGE_DEFAULTS.collection_brass },
      { key: 'collection_gemstone', label: 'Collection — Gemstone', type: 'image', fallback: IMAGE_DEFAULTS.collection_gemstone },
      { key: 'home_about',  label: 'Home — About Image', type: 'image', fallback: IMAGE_DEFAULTS.home_about },
      { key: 'about_cover', label: 'About — Cover',      type: 'image', fallback: IMAGE_DEFAULTS.about_cover },
      { key: 'about_img1',  label: 'About — Image 1',    type: 'image', fallback: IMAGE_DEFAULTS.about_img1 },
      { key: 'about_img2',  label: 'About — Image 2',    type: 'image', fallback: IMAGE_DEFAULTS.about_img2 },
      { key: 'bento_1', label: 'Workshop Grid — 1', type: 'image', fallback: IMAGE_DEFAULTS.bento_1 },
      { key: 'bento_2', label: 'Workshop Grid — 2', type: 'image', fallback: IMAGE_DEFAULTS.bento_2 },
      { key: 'bento_3', label: 'Workshop Grid — 3', type: 'image', fallback: IMAGE_DEFAULTS.bento_3 },
      { key: 'bento_4', label: 'Workshop Grid — 4', type: 'image', fallback: IMAGE_DEFAULTS.bento_4 },
      { key: 'bento_6', label: 'Workshop Grid — 5', type: 'image', fallback: IMAGE_DEFAULTS.bento_6 },
      { key: 'process_1', label: 'Process — 1 Concept & Design', type: 'image', fallback: IMAGE_DEFAULTS.process_1 },
      { key: 'process_2', label: 'Process — 2 3D Modeling', type: 'image', fallback: IMAGE_DEFAULTS.process_2 },
      { key: 'process_3', label: 'Process — 3 Mold Making', type: 'image', fallback: IMAGE_DEFAULTS.process_3 },
      { key: 'process_4', label: 'Process — 4 Wax Injection', type: 'image', fallback: IMAGE_DEFAULTS.process_4 },
      { key: 'process_5', label: 'Process — 5 Casting', type: 'image', fallback: IMAGE_DEFAULTS.process_5 },
      { key: 'process_6', label: 'Process — 6 Cutting & Filing', type: 'image', fallback: IMAGE_DEFAULTS.process_6 },
      { key: 'process_7', label: 'Process — 7 Pre-Polishing', type: 'image', fallback: IMAGE_DEFAULTS.process_7 },
      { key: 'process_8', label: 'Process — 8 Stone Setting', type: 'image', fallback: IMAGE_DEFAULTS.process_8 },
      { key: 'process_9', label: 'Process — 9 Final Polishing', type: 'image', fallback: IMAGE_DEFAULTS.process_9 },
      { key: 'process_10', label: 'Process — 10 Plating', type: 'image', fallback: IMAGE_DEFAULTS.process_10 },
      { key: 'process_11', label: 'Process — 11 Quality Control', type: 'image', fallback: IMAGE_DEFAULTS.process_11 },
      { key: 'process_12', label: 'Process — 12 Packaging & Dispatch', type: 'image', fallback: IMAGE_DEFAULTS.process_12 },
    ],
  },
];

/** Full-site settings — Admin → Settings. Per-page editors reuse subsets of these keys. */
export default function SettingsForm({ initial }: { initial: Record<string, string> }) {
  return <SiteSettingsEditor groups={FIELDS} initial={initial} saveLabel="Save Settings" />;
}
