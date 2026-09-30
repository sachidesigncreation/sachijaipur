import { prisma } from '@/lib/db';

/**
 * Panel access lives in the User table (Admin → Team), editable from
 * Supabase's Table Editor / SQL as well as from the admin UI.
 * role is "owner" or "admin" — both grant full admin-panel access.
 */

export const TEAM_ROLES = ['owner', 'admin'] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

export function isTeamRole(value: unknown): value is TeamRole {
  return value === 'owner' || value === 'admin';
}

/** Role for an email in the User table, or null. Never throws. */
export async function getTeamRole(email: string | undefined | null): Promise<TeamRole | null> {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;
  try {
    const row = await prisma.user.findUnique({
      where: { email: normalized },
      select: { role: true },
    });
    return isTeamRole(row?.role) ? row.role : null;
  } catch {
    return null;
  }
}

type AuthUserLike = {
  email?: string | null;
} | null | undefined;

/** Panel access: a User-table row with role owner|admin. Prefer this for access gates. */
export async function isAdminUser(user: AuthUserLike): Promise<boolean> {
  return (await getTeamRole(user?.email)) !== null;
}
