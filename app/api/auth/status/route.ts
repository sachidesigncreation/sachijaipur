import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser, isSessionAdmin } from '@/lib/session';

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ status: 'UNAUTHENTICATED' }, { status: 401 });
  }

  // Team members (owner|admin) always report ADMIN, even with a client row.
  // Role and account lookups run in parallel.
  const [admin, account] = await Promise.all([
    isSessionAdmin(),
    prisma.clientAccount.findUnique({
      where: { email: user.email! },
      select: { status: true, name: true, company: true },
    }),
  ]);

  if (admin) {
    return NextResponse.json({ status: 'ADMIN' });
  }

  if (!account) {
    return NextResponse.json({ status: 'PENDING' });
  }

  return NextResponse.json({ status: account.status, name: account.name, company: account.company });
}
