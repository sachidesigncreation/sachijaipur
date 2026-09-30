'use client';

import { useState } from 'react';
import AdminProductToggle from '@/components/admin/AdminProductToggle';
import ProductForm, { type ProductFormData } from '@/components/admin/ProductForm';

export interface BuiltInProduct {
  id: string;
  sku: string | null;
  name: string;
  category: string;
  description: string;
  baseMetal: string;
  purityOptions: string[];
  metalColorOptions: string[];
  availableStones: string[];
  primaryGemstone: string | null;
  images: string[];
  featured: boolean;
  weightGrams: number | null;
  makingChargeC: number;
  gemstoneCount: number;
}

function toFormInitial(p: BuiltInProduct): ProductFormData {
  return {
    id: p.id,
    sku: p.sku ?? '',
    name: p.name,
    category: p.category,
    description: p.description,
    baseMetal: p.baseMetal,
    purityOptions: p.purityOptions.join(', '),
    metalColorOptions: p.metalColorOptions.join(', '),
    availableStones: p.availableStones.join(', '),
    primaryGemstone: p.primaryGemstone ?? '',
    images: p.images,
    featured: p.featured,
    weightGrams: p.weightGrams?.toString() ?? '',
    makingChargeC: p.makingChargeC.toString(),
    gemstoneCount: p.gemstoneCount.toString(),
  };
}

function fromApi(data: Record<string, unknown>): BuiltInProduct {
  const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
  const num = (v: unknown, fb: number): number => (typeof v === 'number' && Number.isFinite(v) ? v : fb);
  return {
    id: String(data.id ?? ''),
    sku: typeof data.sku === 'string' ? data.sku : null,
    name: String(data.name ?? ''),
    category: String(data.category ?? ''),
    description: String(data.description ?? ''),
    baseMetal: String(data.baseMetal ?? ''),
    purityOptions: arr(data.purityOptions),
    metalColorOptions: arr(data.metalColorOptions),
    availableStones: arr(data.availableStones),
    primaryGemstone: typeof data.primaryGemstone === 'string' ? data.primaryGemstone : null,
    images: arr(data.images),
    featured: data.featured === true,
    weightGrams: typeof data.weightGrams === 'number' ? data.weightGrams : null,
    makingChargeC: num(data.makingChargeC, 0),
    gemstoneCount: num(data.gemstoneCount, 1),
  };
}

/**
 * Inline product manager for the Collections built-in page editor.
 * Add / edit / feature / delete without leaving the page.
 */
export default function BuiltInProductsManager({ initialProducts }: { initialProducts: BuiltInProduct[] }) {
  const [products, setProducts] = useState<BuiltInProduct[]>(initialProducts);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeletingId(null);
      if (editingId === id) setEditingId(null);
    }
  };

  const editing = editingId ? products.find(p => p.id === editingId) ?? null : null;

  return (
    <div>
      <p className="text-warm text-sm font-dm-sans mb-6">
        {products.length} product{products.length === 1 ? '' : 's'} on the Collections page · toggle <span className="text-charcoal">Featured</span> to show on the homepage
      </p>

      <div className="bg-ivory border border-black/10 overflow-hidden rounded mb-8">
        <table className="w-full text-sm font-dm-sans">
          <thead className="bg-charcoal text-ivory">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Name</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden md:table-cell">SKU</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium hidden lg:table-cell">Category</th>
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
                <td className="px-4 py-3 text-center">
                  <AdminProductToggle id={p.id} featured={p.featured} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => { setEditingId(editingId === p.id ? null : p.id); setAdding(false); }}
                    className="text-xs text-gold uppercase tracking-widest hover:text-gold-deep transition-colors mr-4"
                  >
                    {editingId === p.id ? 'Close' : 'Edit'}
                  </button>
                  {deletingId === p.id ? (
                    <span className="inline-flex items-center gap-2">
                      <button type="button" onClick={() => handleDelete(p.id)} className="text-xs uppercase tracking-widest text-red-600">Yes</button>
                      <button type="button" onClick={() => setDeletingId(null)} className="text-xs uppercase tracking-widest text-warm">No</button>
                    </span>
                  ) : (
                    <button type="button" onClick={() => setDeletingId(p.id)} className="text-xs text-warm uppercase tracking-widest hover:text-red-600">Del</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-warm font-dm-sans text-sm">No products yet — add the first one below.</div>
        )}
      </div>

      {editing && (
        <div className="border border-gold/30 bg-ivory rounded p-6 mb-8">
          <h3 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-6">Editing — {editing.name}</h3>
          <ProductForm
            mode="edit"
            initial={toFormInitial(editing)}
            onSaved={data => {
              const updated = fromApi(data);
              if (!updated.id) return;
              setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {!adding ? (
        <button
          type="button"
          onClick={() => { setAdding(true); setEditingId(null); }}
          className="btn-primary"
        >
          + Add Product
        </button>
      ) : (
        <div className="border border-gold/30 bg-ivory rounded p-6">
          <h3 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-6">New Product</h3>
          <ProductForm
            mode="new"
            onSaved={data => {
              const created = fromApi(data);
              if (!created.id) return;
              setProducts(prev => [created, ...prev]);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}
    </div>
  );
}
