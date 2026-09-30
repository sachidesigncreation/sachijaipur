import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client } from '@/lib/r2/client';
import { R2_CONFIG } from '@/lib/r2/config';

const CONTENT_TYPES: Record<string, string> = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
};

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path } = await props.params;
  const key = path.join('/');
  const ext = key.split('.').pop()?.toLowerCase() ?? '';
  const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';

  try {
    const r2 = getR2Client();
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET || R2_CONFIG.BUCKET_NAME,
      Key: key,
    });

    const response = await r2.send(command);

    if (!response.Body) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const uint8 = await response.Body.transformToByteArray();
    const buffer = Buffer.from(uint8);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: unknown) {
    const error = err as { name?: string; Code?: string };
    if (error.name === 'NoSuchKey' || error.Code === 'NoSuchKey' ||
        error.name === 'NoSuchBucket' || error.Code === 'NoSuchBucket') {
      return new NextResponse('Not Found', { status: 404 });
    }
    console.error('[r2-image] Failed to fetch:', key, err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
