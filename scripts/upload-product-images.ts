/**
 * Upload product images to Cloudflare R2 (sachi_jewellers/products/)
 *
 * Usage:
 *   1. Place source images in scripts/source-images/products/
 *      - File names should match product SKUs (e.g. SJIH16437.jpg)
 *   2. Run: npx tsx scripts/upload-product-images.ts
 *
 * The script will:
 *   - Convert every image to webp (quality 80, max 1200×900)
 *   - Upload to sachi_jewellers/products/<sku>.webp in the oswar-assets bucket
 *   - Print a success/failure summary
 */

import '../lib/env';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';
import path from 'path';

import sharp from 'sharp';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client } from '../lib/r2/client';
import { R2_CONFIG, r2Key } from '../lib/r2/config';

const SOURCE_DIR = resolve(process.cwd(), 'scripts', 'source-images', 'products');

function sanitizeFilename(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\.(png|jpg|jpeg|webp|gif)$/i, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '') + '.webp'
  );
}

async function uploadImage(filePath: string): Promise<{ key: string; success: boolean; error?: string }> {
  const filename = sanitizeFilename(path.basename(filePath));
  const key = r2Key(`products/${filename}`);

  try {
    const buffer = await sharp(filePath)
      .webp({ quality: 80, effort: 6 })
      .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    const r2 = getR2Client();
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET || R2_CONFIG.BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return { key, success: true };
  } catch (err) {
    return { key, success: false, error: String(err) };
  }
}

async function main() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    console.error('Create the folder and add product images before running this script.');
    process.exit(1);
  }

  const files = readdirSync(SOURCE_DIR).filter(f =>
    /\.(png|jpg|jpeg|webp|gif)$/i.test(f)
  );

  if (files.length === 0) {
    console.log('No images found in', SOURCE_DIR);
    process.exit(0);
  }

  console.log(`\nUploading ${files.length} product image(s) to R2...\n`);

  const results = await Promise.allSettled(
    files.map(f => uploadImage(resolve(SOURCE_DIR, f)))
  );

  let success = 0;
  let failure = 0;

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { key, success: ok, error } = result.value;
      if (ok) {
        console.log(`  ✓ ${key}`);
        success++;
      } else {
        console.error(`  ✗ ${key} — ${error}`);
        failure++;
      }
    } else {
      console.error('  ✗ Unexpected error:', result.reason);
      failure++;
    }
  }

  console.log(`\nDone: ${success} uploaded, ${failure} failed.\n`);
  if (failure > 0) process.exit(1);
}

main();
