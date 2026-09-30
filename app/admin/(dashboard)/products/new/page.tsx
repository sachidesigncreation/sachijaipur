import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'New Product — Admin' };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-cormorant text-3xl text-charcoal mb-8">New Product</h1>
      <ProductForm mode="new" />
    </div>
  );
}
