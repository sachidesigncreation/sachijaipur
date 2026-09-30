import { prisma } from '@/lib/db';
import SettingsForm from '@/components/admin/SettingsForm';
import StonePriceManager from '@/components/admin/StonePriceManager';

export const metadata = { title: 'Settings — Admin' };

export default async function AdminSettingsPage() {
  const [settings, stonePrices] = await Promise.all([
    prisma.siteSettings.findMany(),
    prisma.stonePrice.findMany({ orderBy: { stoneName: 'asc' } }),
  ]);

  const settingsMap: Record<string, string> = {};
  settings.forEach(s => { settingsMap[s.key] = s.value; });

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <h1 className="font-cormorant text-3xl text-charcoal mb-2">Settings</h1>
        <p className="text-warm text-sm font-dm-sans">Configure pricing, currency, footer contact, color theme and site images.</p>
      </div>

      <SettingsForm initial={settingsMap} />

      <div className="border-t border-black/10 pt-8">
        <StonePriceManager stones={stonePrices} />
      </div>
    </div>
  );
}
