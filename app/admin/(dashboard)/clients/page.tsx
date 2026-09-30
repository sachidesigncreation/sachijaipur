import { prisma } from '@/lib/db';
import ClientApprovalCard from '@/components/admin/ClientApprovalCard';
import AddClientForm from '@/components/admin/AddClientForm';

export const metadata = { title: 'Clients — Admin' };

export default async function AdminClientsPage() {
  const [pending, others] = await Promise.all([
    prisma.clientAccount.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.clientAccount.findMany({
      where: { status: { not: 'PENDING' } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const statusColor: Record<string, string> = {
    APPROVED: 'text-green-600 bg-green-50 border-green-200',
    REJECTED: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <div>
      <h1 className="font-cormorant text-3xl text-charcoal mb-2">Clients</h1>
      <p className="text-warm text-sm font-dm-sans mb-8">{pending.length} pending · {others.length} processed</p>

      <section className="mb-12 border border-gold/20 bg-ivory rounded p-6">
        <h2 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-1">Add User</h2>
        <p className="text-warm text-xs font-dm-sans mb-6">Create a login + approved wholesale account instantly — no approval wait.</p>
        <AddClientForm />
      </section>

      {pending.length > 0 && (
        <section className="mb-12">
          <h2 className="font-dm-sans text-xs uppercase tracking-widest text-gold mb-4 border-b border-gold/20 pb-2">
            Pending Approvals ({pending.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pending.map(c => (
              <ClientApprovalCard key={c.id} client={c} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="font-dm-sans text-xs uppercase tracking-widest text-warm mb-4 border-b border-black/10 pb-2">
            All Clients
          </h2>
          <div className="bg-ivory border border-black/10 rounded overflow-hidden">
            <table className="w-full text-sm font-dm-sans">
              <thead className="bg-charcoal text-ivory">
                <tr>
                  {['Company', 'Name', 'Country', 'Type', 'Registered', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs uppercase tracking-widest font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {others.map(c => (
                  <tr key={c.id} className="hover:bg-pearl/50">
                    <td className="px-4 py-3 font-medium text-charcoal">{c.company}</td>
                    <td className="px-4 py-3 text-warm">{c.name}</td>
                    <td className="px-4 py-3 text-warm">{c.country}</td>
                    <td className="px-4 py-3 text-warm capitalize">{c.businessType}</td>
                    <td className="px-4 py-3 text-warm text-xs">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 border rounded-full font-medium ${statusColor[c.status] ?? 'text-warm border-black/10'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {pending.length === 0 && others.length === 0 && (
        <div className="text-center py-20 text-warm font-dm-sans text-sm">No clients registered yet.</div>
      )}
    </div>
  );
}
