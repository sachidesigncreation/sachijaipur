import { prisma } from '@/lib/db';
import Link from 'next/link';
import AdminProductToggle from '@/components/admin/AdminProductToggle';

export const metadata = { title: 'Products — Admin' };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-cormorant text-3xl text-charcoal">Products</h1>
          <p className="text-warm text-sm font-dm-sans mt-1">{products.length} total</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/import" className="btn-secondary text-sm">Import CSV</Link>
          <Link href="/admin/products/new" className="btn-primary text-sm">+ Add Product</Link>
        </div>
      </div>

      <div className="bg-ivory border border-black/10 overflow-hidden rounded">
        <table className="w-full text-sm font-dm-sans">
          <thead className="bg-charcoal text-ivory">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Name</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden md:table-cell">SKU</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden lg:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden lg:table-cell">Metal</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden xl:table-cell">C ($/g)</th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-widest font-medium">Featured</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-widest font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-pearl/50 transition-colors">
                <td className="px-4 py-3 text-charcoal font-medium">{p.name}</td>
                <td className="px-4 py-3 text-warm hidden md:table-cell">{p.sku ?? '—'}</td>
                <td className="px-4 py-3 text-warm capitalize hidden lg:table-cell">{p.category}</td>
                <td className="px-4 py-3 text-warm capitalize hidden lg:table-cell">{p.baseMetal}</td>
                <td className="px-4 py-3 text-warm hidden xl:table-cell">${p.makingChargeC.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <AdminProductToggle id={p.id} featured={p.featured} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs text-gold uppercase tracking-widest hover:text-gold-deep transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-16 text-warm font-dm-sans text-sm">
            No products yet.{' '}
            <Link href="/admin/products/new" className="text-gold underline">Add one</Link>{' '}
            or{' '}
            <Link href="/admin/import" className="text-gold underline">import CSV</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
