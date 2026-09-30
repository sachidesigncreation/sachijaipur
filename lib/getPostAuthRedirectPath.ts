import { prisma } from '@/lib/db';
import { isAdminUser } from '@/lib/isAdminEmail';

type AuthUserLike = {
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
} | null | undefined;

/**
 * Where to send an already-signed-in user who hits /auth/login or /auth/register.
 * Keeps behaviour aligned with `/api/auth/status`.
 */
export async function getPostAuthRedirectPath(user: AuthUserLike): Promise<string> {
  const email = user?.email;
  if (!email) return '/products';

  const [admin, account] = await Promise.all([
    isAdminUser(user),
    prisma.clientAccount.findUnique({
      where: { email },
      select: { status: true },
    }),
  ]);

  if (admin) return '/admin';

  if (!account) {
    return '/auth/pending';
  }

  if (account.status === 'PENDING') return '/auth/pending';
  if (account.status === 'REJECTED') return '/auth/rejected';

  return '/products';
}
