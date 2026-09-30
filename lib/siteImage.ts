import { getR2AssetUrl } from '@/lib/r2/config';

/**
 * Resolve a SiteSettings image value to a usable <Image> src.
 *
 * Stored values may be:
 *   - https URL (unsplash / external) → used as-is
 *   - /public path ("/HomePageImage.webp", "/BentoGrid/1.png") → used as-is
 *   - R2 key ("sachi_jewellers/site/abc.webp") → resolved via getR2AssetUrl()
 */
export function resolveSiteImage(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') return fallback;
  const v = raw.trim();
  if (v.startsWith('http') || v.startsWith('/api/')) return v;
  if (v.startsWith('/')) return v;
  return getR2AssetUrl(v);
}
