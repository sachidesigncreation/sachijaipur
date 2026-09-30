import { prisma } from '@/lib/db';

/** Read the whole SiteSettings table into a plain map. Never throws. */
export async function getSiteSettingsMap(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSettings.findMany();
    const map: Record<string, string> = {};
    rows.forEach(r => { map[r.key] = r.value; });
    return map;
  } catch {
    return {};
  }
}
