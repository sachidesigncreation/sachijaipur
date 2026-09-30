import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [pendingClients, newInquiries, totalProducts] = await Promise.all([
    prisma.clientAccount.count({ where: { status: 'PENDING' } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.product.count(),
  ]);

  const stats = [
    { label: 'Pending Approvals', value: pendingClients, href: '/admin/clients', urgent: pendingClients > 0 },
    { label: 'New Inquiries',     value: newInquiries,   href: '/admin/inquiries', urgent: newInquiries > 0 },
    { label: 'Total Products',    value: totalProducts,  href: '/admin/products',  urgent: false },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-3xl text-charcoal">Dashboard</h1>
        <p className="text-warm text-sm font-dm-sans mt-1">Sachi Jaipur — Admin Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`block p-6 border rounded bg-ivory hover:border-gold transition-colors ${
              stat.urgent ? 'border-gold/50' : 'border-black/10'
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-warm font-dm-sans mb-2">{stat.label}</p>
            <p className={`font-cormorant text-4xl ${stat.urgent ? 'text-gold' : 'text-charcoal'}`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/products/new" className="flex items-center gap-4 p-5 border border-black/10 bg-ivory hover:border-gold transition-colors rounded">
          <span className="text-2xl text-gold">+</span>
          <div>
            <p className="font-dm-sans text-sm font-medium text-charcoal">Add New Product</p>
            <p className="text-xs text-warm mt-0.5">Create a product manually</p>
          </div>
        </Link>
        <Link href="/admin/pages/new" className="flex items-center gap-4 p-5 border border-black/10 bg-ivory hover:border-gold transition-colors rounded">
          <span className="text-2xl text-gold">▤</span>
          <div>
            <p className="font-dm-sans text-sm font-medium text-charcoal">Create New Page</p>
            <p className="text-xs text-warm mt-0.5">Website builder — sections + navbar</p>
          </div>
        </Link>
        <Link href="/admin/import" className="flex items-center gap-4 p-5 border border-black/10 bg-ivory hover:border-gold transition-colors rounded">
          <span className="text-2xl text-gold">↑</span>
          <div>
            <p className="font-dm-sans text-sm font-medium text-charcoal">Import CSV</p>
            <p className="text-xs text-warm mt-0.5">Bulk upload from spreadsheet</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
