import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTeamRole, type TeamRole } from '@/lib/isAdminEmail';

/**
 * Per-request session reads. React `cache()` dedupes these across every
 * server component in the same render (e.g. dashboard layout + page both
 * needing the user), so the Auth-server round trip and the role lookup each
 * happen at most once per request.
 */

/** Verified auth user (via the Auth server), or null. */
export const getSessionUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

/** Team role (owner|admin) for the session, or null. */
export const getSessionRole = cache(async (): Promise<TeamRole | null> => {
  const user = await getSessionUser();
  return getTeamRole(user?.email);
});

/** Whether the session may access the admin panel. */
export const isSessionAdmin = cache(async (): Promise<boolean> => {
  return (await getSessionRole()) !== null;
});
