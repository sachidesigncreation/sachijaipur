import { NextResponse } from 'next/server';
import { getNavPages } from '@/lib/cmsServer';

/** Public navbar/footer links: published pages flagged showInNav. Cached for a minute. */
export async function GET() {
  const pages = await getNavPages();
  return NextResponse.json(
    { pages },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  );
}
