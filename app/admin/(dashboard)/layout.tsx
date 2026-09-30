import { redirect } from 'next/navigation';
import { getSessionUser, isSessionAdmin } from '@/lib/session';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) redirect('/admin/login');

  if (!(await isSessionAdmin())) redirect('/admin/login');

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-pearl font-sans">
      <AdminSidebar userEmail={user.email ?? ''} />
      <main className="min-h-0 flex-1 overflow-y-auto p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
