import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/isAdminEmail';
import { getR2Client } from '@/lib/r2/client';
import { R2_CONFIG, r2Key } from '@/lib/r2/config';
import { parse } from 'csv-parse/sync';
import sharp from 'sharp';

async function isAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isAdminUser(user);
}

function splitTrim(val: string) {
  if (!val?.trim()) return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

function normalizeCategory(raw: string) {
  const v = raw.trim().toLowerCase().replace(/s$/, '');
  const map: Record<string, string> = {
    ring: 'rings', earring: 'earrings', pendant: 'pendants',
    bracelet: 'bracelets', bangle: 'bangles', necklace: 'necklaces',
  };
  return map[v] ?? (raw.toLowerCase().endsWith('s') ? raw.toLowerCase() : `${raw.toLowerCase()}s`);
}

function normalizeMetal(raw: string) {
  const v = raw.trim().toLowerCase();
  if (v.startsWith('gold')) return 'gold';
  if (v.startsWith('silver') || v.includes('925')) return 'silver';
  if (v.startsWith('brass')) return 'brass';
  return 'silver';
}

/** Extract Google Drive file ID from any drive.google.com URL */
function extractGdriveId(url: string): string | null {
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

/**
 * Download an image from a URL (including Google Drive links),
 * compress to WebP with sharp, upload to R2, return the R2 key.
 * Returns null if the image cannot be downloaded or is not an image.
 */
async function downloadAndUploadImage(
  rawUrl: string,
  productKey: string,
  imgIdx: number,
): Promise<string | null> {
  const url = rawUrl.trim();
  if (!url) return null;

  // Determine the actual fetch URL
  let fetchUrl: string;
  const gdriveId = extractGdriveId(url);
  if (gdriveId) {
    // Use the usercontent CDN endpoint – more reliable than /uc?export=download for public files
    fetchUrl = `https://drive.usercontent.google.com/download?id=${gdriveId}&export=download&authuser=0`;
  } else if (url.startsWith('http://') || url.startsWith('https://')) {
    fetchUrl = url;
  } else {
    // bare filename — cannot auto-download
    return null;
  }

  try {
    const res = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SachiImporter/1.0)' },
      signal: AbortSignal.timeout(45_000),
      redirect: 'follow',
    });

    if (!res.ok) return null;

    const ct = res.headers.get('content-type') ?? '';
    // Reject HTML responses (Google Drive "confirm" pages, 404 pages, etc.)
    if (ct.includes('text/html')) return null;

    const rawBuf = Buffer.from(await res.arrayBuffer());
    if (rawBuf.length < 500) return null; // too small → error page

    const webpBuf = await sharp(rawBuf)
      .webp({ quality: 82, effort: 4 })
      .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    const safeKey = productKey.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 40);
    const filename = `${safeKey}-${imgIdx + 1}.webp`;
    const key = r2Key(`products/${filename}`);

    await getR2Client().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET || R2_CONFIG.BUCKET_NAME,
        Key: key,
        Body: webpBuf,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return key;
  } catch {
    return null;
  }
}

// Streaming NDJSON event helpers
function makeEncoder() {
  const enc = new TextEncoder();
  return (data: object) => enc.encode(JSON.stringify(data) + '\n');
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { csv } = await req.json();
  if (!csv) return NextResponse.json({ error: 'No CSV provided' }, { status: 400 });

  let rows: Record<string, string>[];
  try {
    rows = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
      relax_quotes: true,
      bom: true,
    }) as Record<string, string>[];
  } catch (err) {
    return NextResponse.json({ error: `CSV parse error: ${err}` }, { status: 400 });
  }

  const encode = makeEncoder();

  const stream = new ReadableStream({
    async start(ctrl) {
      const emit = (data: object) => ctrl.enqueue(encode(data));

      let inserted = 0, updated = 0, errors = 0, imagesUploaded = 0, imagesFailed = 0;
      const dataRows = rows.filter(r => r['Name']?.trim());

      emit({ type: 'start', total: dataRows.length });

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const name = row['Name'].trim();
        const sku  = row['SKU']?.trim() || null;
        const effectiveSku = sku ?? `SJ-AUTO-${name.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}`;

        emit({ type: 'progress', index: i + 1, total: dataRows.length, name, sku: effectiveSku });

        // ── Image processing ────────────────────────────────────────────────
        const rawImageCol = row['ImageURLs (Comma separated Drive/Dropbox links)']?.trim() ?? '';
        const imageUrls = rawImageCol.split(',').map(s => s.trim()).filter(Boolean);
        const uploadedKeys: string[] = [];

        if (imageUrls.length) {
          emit({ type: 'images_start', sku: effectiveSku, count: imageUrls.length });
          for (let j = 0; j < imageUrls.length; j++) {
            const key = await downloadAndUploadImage(imageUrls[j], effectiveSku, j);
            if (key) {
              uploadedKeys.push(key);
              imagesUploaded++;
            } else {
              imagesFailed++;
            }
          }
          emit({ type: 'images_done', sku: effectiveSku, uploaded: uploadedKeys.length, failed: imageUrls.length - uploadedKeys.length });
        }

        // ── DB upsert ────────────────────────────────────────────────────────
        const data = {
          name,
          category:          normalizeCategory(row['Category (rings/earrings/pendants/bracelets/bangles/necklaces)'] || 'rings'),
          description:       row['Description']?.trim() || '',
          baseMetal:         normalizeMetal(row['BaseMetal (gold/silver/brass)'] || ''),
          purityOptions:     splitTrim(row['PurityOptions (Comma separated, e.g. 14K, 18K or 925)'] || ''),
          metalColorOptions: (row['MetalColorOptions (Dropdown choices, e.g. Yellow Gold, White Gold)'] || '')
                               .split(/[\n,]/).map((s: string) => s.trim()).filter(Boolean),
          availableStones:   splitTrim(row['AvailableStones (Dropdown choices, e.g. Diamond, Ruby, None)'] || ''),
          primaryGemstone:   row['PrimaryGemstone']?.trim() || null,
          featured:          row['Featured (TRUE/FALSE)']?.trim().toUpperCase() === 'TRUE',
          weightGrams:       row['Net Weight']?.trim() ? parseFloat(row['Net Weight']) : null,
        };

        try {
          const existing = await prisma.product.findUnique({ where: { sku: effectiveSku } });
          if (existing) {
            await prisma.product.update({
              where: { sku: effectiveSku },
              data: {
                ...data,
                // Only overwrite images if we actually uploaded some
                ...(uploadedKeys.length > 0 ? { images: uploadedKeys } : {}),
              },
            });
            updated++;
            emit({ type: 'saved', sku: effectiveSku, action: 'updated' });
          } else {
            await prisma.product.create({
              data: { ...data, sku: effectiveSku, images: uploadedKeys, makingChargeC: 0 },
            });
            inserted++;
            emit({ type: 'saved', sku: effectiveSku, action: 'inserted' });
          }
        } catch (err) {
          errors++;
          emit({ type: 'row_error', sku: effectiveSku, message: String(err) });
        }
      }

      emit({ type: 'complete', inserted, updated, errors, imagesUploaded, imagesFailed });
      ctrl.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Accel-Buffering': 'no',
      'Cache-Control': 'no-store',
    },
  });
}
