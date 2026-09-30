export const R2_CONFIG = {
  BUCKET_NAME: process.env.R2_BUCKET || 'oswar-assets',
  CDN_URL: process.env.NEXT_PUBLIC_R2_CDN_URL || '',
  PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '',
  // All Sachi assets are prefixed with this folder in the shared bucket
  PREFIX: 'sachi_jewellers',
};

export function getR2AssetUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (R2_CONFIG.CDN_URL) return `${R2_CONFIG.CDN_URL}/${cleanPath}`;
  if (R2_CONFIG.PUBLIC_URL) return `${R2_CONFIG.PUBLIC_URL}/${cleanPath}`;
  return `/api/r2-image/${cleanPath}`;
}

/**
 * Returns an R2 key with the project prefix.
 * e.g. r2Key("products/my-product.webp") → "sachi_jewellers/products/my-product.webp"
 */
export function r2Key(relativePath: string): string {
  const clean = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${R2_CONFIG.PREFIX}/${clean}`;
}

/**
 * Normalizes a stored image value to a usable URL.
 * Stored values may be:
 *   - a full R2 key  → passed through getR2AssetUrl()
 *   - a full URL     → used as-is
 *   - null/empty     → returns null
 */
export function normalizeR2Image(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith('http') || imagePath.startsWith('/api/r2-image/')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return getR2AssetUrl(cleanPath);
}
