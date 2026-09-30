import { FOOTER_DEFAULTS, IMAGE_DEFAULTS, CONTENT_DEFAULTS } from '@/lib/siteConfig';
import type { SettingsGroup } from '@/components/admin/SiteSettingsEditor';

/**
 * Built-in website pages and exactly which content each one owns.
 * Admin → Pages → Edit opens /admin/pages/built-in/[slug], which renders
 * these groups inline — no bouncing to other admin sections.
 */

export type BuiltInKind = 'settings' | 'products' | 'certificates';

export interface BuiltInPageConfig {
  slug: string;
  title: string;
  url: string;
  description: string;
  kind: BuiltInKind;
  groups: SettingsGroup[];
}

const heroSlide = (n: number, imageKey: string): SettingsGroup => ({
  section: `Hero — Slide ${n}`,
  fields: [
    { key: `hero_${n}_label`, label: 'Label', type: 'text', fallback: CONTENT_DEFAULTS[`hero_${n}_label`] },
    { key: `hero_${n}_heading`, label: 'Heading', type: 'textarea', fallback: CONTENT_DEFAULTS[`hero_${n}_heading`] },
    { key: `hero_${n}_subtext`, label: 'Subtext', type: 'textarea', fallback: CONTENT_DEFAULTS[`hero_${n}_subtext`] },
    { key: imageKey, label: 'Background image', type: 'image', fallback: IMAGE_DEFAULTS[imageKey] },
  ],
});

const spotlight = (name: 'gold' | 'silver' | 'brass', label: string): SettingsGroup => ({
  section: `${label} Spotlight`,
  fields: [
    { key: `spotlight_${name}_label`, label: 'Label', type: 'text', fallback: CONTENT_DEFAULTS[`spotlight_${name}_label`] },
    { key: `spotlight_${name}_title`, label: 'Title', type: 'text', fallback: CONTENT_DEFAULTS[`spotlight_${name}_title`] },
    { key: `spotlight_${name}_desc`, label: 'Text', type: 'textarea', fallback: CONTENT_DEFAULTS[`spotlight_${name}_desc`] },
    { key: `spotlight_${name}`, label: 'Image', type: 'image', fallback: IMAGE_DEFAULTS[`spotlight_${name}`] },
  ],
});

export const BUILT_IN_PAGES: BuiltInPageConfig[] = [
  {
    slug: 'home',
    title: 'Home',
    url: '/',
    description: 'Hero slideshow, collection grid, spotlights, brand story and about image.',
    kind: 'settings',
    groups: [
      heroSlide(1, 'hero_1'),
      heroSlide(2, 'hero_2'),
      heroSlide(3, 'hero_3'),
      heroSlide(4, 'hero_4'),
      {
        section: 'Collection Grid Images',
        fields: [
          { key: 'collection_gold', label: 'Gold', type: 'image', fallback: IMAGE_DEFAULTS.collection_gold },
          { key: 'collection_silver', label: 'Silver', type: 'image', fallback: IMAGE_DEFAULTS.collection_silver },
          { key: 'collection_brass', label: 'Brass', type: 'image', fallback: IMAGE_DEFAULTS.collection_brass },
          { key: 'collection_gemstone', label: 'Gemstone', type: 'image', fallback: IMAGE_DEFAULTS.collection_gemstone },
        ],
      },
      spotlight('gold', 'Gold'),
      spotlight('silver', 'Silver'),
      spotlight('brass', 'Brass'),
      {
        section: 'Brand Story',
        fields: [
          { key: 'brand_eyebrow', label: 'Eyebrow', type: 'text', fallback: CONTENT_DEFAULTS.brand_eyebrow },
          { key: 'brand_heading', label: 'Heading', type: 'text', fallback: CONTENT_DEFAULTS.brand_heading },
          { key: 'brand_para1', label: 'Paragraph 1', type: 'textarea', fallback: CONTENT_DEFAULTS.brand_para1 },
          { key: 'brand_para2', label: 'Paragraph 2', type: 'textarea', fallback: CONTENT_DEFAULTS.brand_para2 },
          { key: 'brand_para3', label: 'Paragraph 3', type: 'textarea', fallback: CONTENT_DEFAULTS.brand_para3 },
        ],
      },
      {
        section: 'Home About Image',
        fields: [
          { key: 'home_about', label: 'About image', type: 'image', fallback: IMAGE_DEFAULTS.home_about },
        ],
      },
    ],
  },
  {
    slug: 'about',
    title: 'About Us',
    url: '/about',
    description: 'Intro, paragraphs and page images.',
    kind: 'settings',
    groups: [
      {
        section: 'Copy',
        fields: [
          { key: 'about_intro', label: 'Intro', type: 'textarea', fallback: CONTENT_DEFAULTS.about_intro },
          { key: 'about_p1', label: 'Paragraph 1', type: 'textarea', fallback: CONTENT_DEFAULTS.about_p1 },
          { key: 'about_p2', label: 'Paragraph 2', type: 'textarea', fallback: CONTENT_DEFAULTS.about_p2 },
        ],
      },
      {
        section: 'Images',
        fields: [
          { key: 'about_cover', label: 'Cover', type: 'image', fallback: IMAGE_DEFAULTS.about_cover },
          { key: 'about_img1', label: 'Image 1', type: 'image', fallback: IMAGE_DEFAULTS.about_img1 },
          { key: 'about_img2', label: 'Image 2', type: 'image', fallback: IMAGE_DEFAULTS.about_img2 },
        ],
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    url: '/contact',
    description: 'Address, contact details, GST and business hours (also shown in the footer).',
    kind: 'settings',
    groups: [
      {
        section: 'Address & Contact',
        note: 'Also shown in the footer on every page, the quote PDF and emails.',
        fields: [
          { key: 'footer_address', label: 'Address', type: 'textarea', fallback: FOOTER_DEFAULTS.footer_address, note: 'One line per row.' },
          { key: 'footer_email', label: 'Contact Email', type: 'text', fallback: FOOTER_DEFAULTS.footer_email },
          { key: 'footer_phone', label: 'Contact Phone', type: 'text', fallback: FOOTER_DEFAULTS.footer_phone },
          { key: 'footer_whatsapp', label: 'WhatsApp Number', type: 'text', fallback: FOOTER_DEFAULTS.footer_whatsapp, note: 'Digits only with country code, e.g. 918946931404.' },
          { key: 'footer_gst', label: 'GST Number', type: 'text', fallback: FOOTER_DEFAULTS.footer_gst },
          { key: 'contact_hours_1', label: 'Hours Line 1', type: 'text', fallback: CONTENT_DEFAULTS.contact_hours_1 },
          { key: 'contact_hours_2', label: 'Hours Line 2', type: 'text', fallback: CONTENT_DEFAULTS.contact_hours_2 },
        ],
      },
    ],
  },
  {
    slug: 'process',
    title: 'Our Process',
    url: '/process',
    description: 'The 12 manufacturing step images.',
    kind: 'settings',
    groups: [
      {
        section: 'Step Images',
        fields: [
          { key: 'process_1', label: '1 · Concept & Design', type: 'image', fallback: IMAGE_DEFAULTS.process_1 },
          { key: 'process_2', label: '2 · 3D Modeling', type: 'image', fallback: IMAGE_DEFAULTS.process_2 },
          { key: 'process_3', label: '3 · Mold Making', type: 'image', fallback: IMAGE_DEFAULTS.process_3 },
          { key: 'process_4', label: '4 · Wax Injection', type: 'image', fallback: IMAGE_DEFAULTS.process_4 },
          { key: 'process_5', label: '5 · Casting', type: 'image', fallback: IMAGE_DEFAULTS.process_5 },
          { key: 'process_6', label: '6 · Cutting & Filing', type: 'image', fallback: IMAGE_DEFAULTS.process_6 },
          { key: 'process_7', label: '7 · Pre-Polishing', type: 'image', fallback: IMAGE_DEFAULTS.process_7 },
          { key: 'process_8', label: '8 · Stone Setting', type: 'image', fallback: IMAGE_DEFAULTS.process_8 },
          { key: 'process_9', label: '9 · Final Polishing', type: 'image', fallback: IMAGE_DEFAULTS.process_9 },
          { key: 'process_10', label: '10 · Plating', type: 'image', fallback: IMAGE_DEFAULTS.process_10 },
          { key: 'process_11', label: '11 · Quality Control', type: 'image', fallback: IMAGE_DEFAULTS.process_11 },
          { key: 'process_12', label: '12 · Packaging & Dispatch', type: 'image', fallback: IMAGE_DEFAULTS.process_12 },
        ],
      },
    ],
  },
  {
    slug: 'collections',
    title: 'Collections',
    url: '/products',
    description: 'The product catalogue shown on the Collections page.',
    kind: 'products',
    groups: [],
  },
  {
    slug: 'certificates',
    title: 'Certificates',
    url: '/certificates',
    description: 'The quality certifications shown on the Certificates page.',
    kind: 'certificates',
    groups: [],
  },
];

export function getBuiltInPage(slug: string): BuiltInPageConfig | null {
  return BUILT_IN_PAGES.find(p => p.slug === slug) ?? null;
}
