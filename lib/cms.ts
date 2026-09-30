/**
 * Website-builder content layer (Admin → Pages) — client-safe half.
 *
 * Constants, types and slug helpers only. Server DB access lives in
 * lib/cmsServer.ts so client components can import this file freely.
 */

export const CMS_STATUS = { DRAFT: 'DRAFT', PUBLISHED: 'PUBLISHED' } as const;

/** Slugs owned by built-in routes — the builder refuses these. */
export const RESERVED_SLUGS = new Set([
  'about',
  'account',
  'admin',
  'api',
  'auth',
  'certificates',
  'contact',
  'process',
  'products',
  'privacy',
  'terms',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
]);

export type SectionType = 'hero' | 'text' | 'image_text' | 'gallery' | 'cta' | 'stats';

export const SECTION_TYPES: Array<{ value: SectionType; label: string; hint: string }> = [
  { value: 'hero',       label: 'Hero banner',      hint: 'Full-width banner with background image, heading and CTAs' },
  { value: 'text',       label: 'Text block',       hint: 'Eyebrow, heading and paragraphs' },
  { value: 'image_text', label: 'Image + text',     hint: 'Side-by-side image and copy with optional button' },
  { value: 'gallery',    label: 'Image gallery',    hint: 'Heading plus a grid of images' },
  { value: 'cta',        label: 'Call to action',   hint: 'Centered band with buttons' },
  { value: 'stats',      label: 'Stats row',        hint: 'Numbers with labels, e.g. 150+ craftsmen' },
];

export interface CmsSectionProps {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  images?: string[];
  align?: string;
  bg?: string;
  /** Custom section background (hex). Empty = theme default / preset. */
  bgColor?: string;
  /** Custom text color (hex). Empty = theme default. */
  textColor?: string;
  overlay?: boolean;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items?: Array<{ value: string; label: string }>;
  [key: string]: unknown;
}

export interface CmsSectionRow {
  id: string;
  pageId: string;
  type: string;
  sortOrder: number;
  isVisible: boolean;
  props: CmsSectionProps;
}

export interface CmsPageRow {
  id: string;
  slug: string;
  title: string;
  navLabel: string | null;
  showInNav: boolean;
  navOrder: number;
  status: string;
  metaDescription: string | null;
  updatedAt: Date;
}

export interface CmsPageWithSections extends CmsPageRow {
  sections: CmsSectionRow[];
}

export function toSectionProps(raw: unknown): CmsSectionProps {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as CmsSectionProps;
  }
  return {};
}

/** Normalize a slug: lowercase, spaces→dashes, strip illegal chars. */
export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, 80);
}

export function slugError(slug: string): string | null {
  if (!slug) return 'Slug is required.';
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(slug)) {
    return 'Slug may only contain lowercase letters, numbers, dashes and underscores.';
  }
  if (RESERVED_SLUGS.has(slug)) return `"${slug}" is a built-in page and cannot be used.`;
  return null;
}
