import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductForm from '@/components/admin/ProductForm';
import AdminDeleteProduct from '@/components/admin/AdminDeleteProduct';

export const metadata = { title: 'Edit Product — Admin' };

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const initial = {
    id:                product.id,
    sku:               product.sku ?? '',
    name:              product.name,
    category:          product.category,
    description:       product.description,
    baseMetal:         product.baseMetal,
    purityOptions:     product.purityOptions.join(', '),
    metalColorOptions: product.metalColorOptions.join(', '),
    availableStones:   product.availableStones.join(', '),
    primaryGemstone:   product.primaryGemstone ?? '',
    images:            product.images,
    featured:          product.featured,
    weightGrams:       product.weightGrams?.toString() ?? '',
    makingChargeC:     product.makingChargeC.toString(),
    gemstoneCount:     product.gemstoneCount.toString(),
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-cormorant text-3xl text-charcoal">{product.name}</h1>
        <AdminDeleteProduct id={product.id} name={product.name} />
      </div>
      <ProductForm mode="edit" initial={initial} />
    </div>
  );
}
