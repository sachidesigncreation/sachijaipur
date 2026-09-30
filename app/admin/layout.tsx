import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Sachi Jaipur' };

/**
 * Root admin shell — no auth here so `/admin/login` can render without a redirect loop.
 * Protected routes live under `app/admin/(dashboard)/` with their own layout.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
