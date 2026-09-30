import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import AccountSignOut from '@/components/auth/AccountSignOut';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'My Account — Sachi Jaipur' };

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const account = await prisma.clientAccount.findUnique({
    where: { email: user.email! },
  });

  if (!account) redirect('/auth/login');

  if (account.status === 'PENDING') redirect('/auth/pending');
  if (account.status === 'REJECTED') redirect('/auth/pending');

  return (
    <div className="min-h-screen bg-pearl py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <h1 className="font-cormorant text-3xl text-charcoal">My Account</h1>
          <p className="font-dm-sans text-warm text-sm mt-1">Approved wholesale account</p>
        </div>

        <div className="bg-ivory border border-gold/10 p-8 space-y-4">
          {[
            { label: 'Contact Name', value: account.name },
            { label: 'Email',        value: account.email },
            { label: 'Company',      value: account.company },
            { label: 'Country',      value: account.country },
            { label: 'Business Type', value: account.businessType },
            { label: 'Phone',        value: account.phone ?? '—' },
            { label: 'Status',       value: account.status },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-baseline gap-4">
              <span className="text-xs uppercase tracking-widest text-warm font-dm-sans shrink-0">{label}</span>
              <span className="font-dm-sans text-sm text-charcoal text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <AccountSignOut />
        </div>
      </div>
    </div>
  );
}
