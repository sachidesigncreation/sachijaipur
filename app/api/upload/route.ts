import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client } from '@/lib/r2/client';
import { R2_CONFIG, r2Key, getR2AssetUrl } from '@/lib/r2/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/isAdminEmail';
import sharp from 'sharp';

function sanitizeFilename(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\.(png|jpg|jpeg|webp|gif)$/i, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '') + '.webp'
  );
}

export async function POST(request: NextRequest) {
  // Auth guard — must be logged-in admin
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!(await isAdminUser(user))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'products';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Compress to WebP
    const webpBuffer = await sharp(inputBuffer)
      .webp({ quality: 80, effort: 6 })
      .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    const filename  = sanitizeFilename(file.name);
    const key       = r2Key(`${folder}/${filename}`);

    const r2 = getR2Client();
    await r2.send(
      new PutObjectCommand({
        Bucket:       process.env.R2_BUCKET || R2_CONFIG.BUCKET_NAME,
        Key:          key,
        Body:         webpBuffer,
        ContentType:  'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    const url = getR2AssetUrl(key);

    return NextResponse.json({ key, url });
  } catch (err) {
    console.error('[upload] Error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
