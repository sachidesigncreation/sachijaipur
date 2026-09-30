import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/session';
import TeamManager, { type TeamRow } from '@/components/admin/TeamManager';

export const metadata = { title: 'Team — Admin' };

export default async function AdminTeamPage() {
  const self = await getSessionUser();
  const selfEmail = self?.email?.toLowerCase() ?? null;

  let rows: TeamRow[] = [];
  try {
    const members = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
    rows = members
      .map(m => ({
        id: m.id,
        email: m.email,
        name: m.name,
        role: m.role,
        isSelf: m.email.toLowerCase() === selfEmail,
      }))
      .sort((a, b) => (a.role === b.role ? 0 : a.role === 'owner' ? -1 : 1));
  } catch {
    rows = [];
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-cormorant text-3xl text-charcoal mb-2">Team</h1>
      <p className="text-warm text-sm font-dm-sans mb-8">
        Who can open the admin panel. Owners and admins have the same full access — owner is simply the higher label.
        These rows live in the <span className="font-mono">User</span> table, so roles can also be edited directly in Supabase.
      </p>
      <TeamManager initial={rows} />
    </div>
  );
}
