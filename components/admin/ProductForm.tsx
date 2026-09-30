'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

export interface ProductFormData {
  id?:                string;
  sku:                string;
  name:               string;
  category:           string;
  description:        string;
  baseMetal:          string;
  purityOptions:      string;   // comma-separated
  metalColorOptions:  string;   // comma-separated
  availableStones:    string;   // comma-separated
  primaryGemstone:    string;
  images:             string[]; // R2 keys
  featured:           boolean;
  weightGrams:        string;
  makingChargeC:      string;
  gemstoneCount:      string;
}

const CATEGORIES = ['rings', 'earrings', 'pendants', 'bracelets', 'bangles', 'necklaces'];
const METALS     = ['gold', 'silver', 'brass'];

interface Props {
  initial?: Partial<ProductFormData>;
  mode: 'new' | 'edit';
  /** When provided, called with the saved product instead of navigating to /admin/products. */
  onSaved?: (product: Record<string, unknown>) => void;
  /** When provided, called on cancel instead of router.back(). */
  onCancel?: () => void;
}

export default function ProductForm({ initial, mode, onSaved, onCancel }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({
    sku:               initial?.sku               ?? '',
    name:              initial?.name              ?? '',
    category:          initial?.category          ?? 'rings',
    description:       initial?.description       ?? '',
    baseMetal:         initial?.baseMetal         ?? 'silver',
    purityOptions:     initial?.purityOptions     ?? '925',
    metalColorOptions: initial?.metalColorOptions ?? 'Silver925 with Rhodium, Yellow Gold Plated',
    availableStones:   initial?.availableStones   ?? 'None',
    primaryGemstone:   initial?.primaryGemstone   ?? '',
    images:            initial?.images            ?? [],
    featured:          initial?.featured          ?? false,
    weightGrams:       initial?.weightGrams       ?? '',
    makingChargeC:     initial?.makingChargeC     ?? '0',
    gemstoneCount:     initial?.gemstoneCount     ?? '1',
    id:                initial?.id,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof ProductFormData, value: string | boolean | string[]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url  = mode === 'edit' ? `/api/admin/products/${form.id}` : '/api/admin/products';
    const method = mode === 'edit' ? 'PUT' : 'POST';

    const body = {
      ...form,
      purityOptions:     form.purityOptions.split(',').map(s => s.trim()).filter(Boolean),
      metalColorOptions: form.metalColorOptions.split(',').map(s => s.trim()).filter(Boolean),
      availableStones:   form.availableStones.split(',').map(s => s.trim()).filter(Boolean),
      weightGrams:       form.weightGrams ? parseFloat(form.weightGrams) : null,
      makingChargeC:     parseFloat(form.makingChargeC) || 0,
      gemstoneCount:     parseInt(form.gemstoneCount, 10) || 1,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || 'Save failed');
      }
      if (onSaved) {
        onSaved(data as Record<string, unknown>);
      } else {
        router.push('/admin/products');
        router.refresh();
      }
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-ivory border border-black/10 px-4 py-2.5 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>SKU</label>
          <input className={inputClass} value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="SJIH16437-" />
        </div>
        <div>
          <label className={labelClass}>Name *</label>
          <input className={inputClass} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Category *</label>
          <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)} required>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Base Metal *</label>
          <select className={inputClass} value={form.baseMetal} onChange={e => set('baseMetal', e.target.value)} required>
            {METALS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea className={inputClass} required rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Purity Options (comma-separated)</label>
          <input className={inputClass} value={form.purityOptions} onChange={e => set('purityOptions', e.target.value)} placeholder="925, 10K, 14K" />
        </div>
        <div>
          <label className={labelClass}>Metal Color Options (comma-separated)</label>
          <input className={inputClass} value={form.metalColorOptions} onChange={e => set('metalColorOptions', e.target.value)} placeholder="Yellow Gold, Rose Gold" />
        </div>
        <div>
          <label className={labelClass}>Available Stones (comma-separated)</label>
          <input className={inputClass} value={form.availableStones} onChange={e => set('availableStones', e.target.value)} placeholder="Diamond, None" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className={labelClass}>Primary Gemstone</label>
          <input className={inputClass} value={form.primaryGemstone} onChange={e => set('primaryGemstone', e.target.value)} placeholder="Blue Sapphire" />
        </div>
        <div>
          <label className={labelClass}>Weight (grams)</label>
          <input className={inputClass} type="number" step="0.001" value={form.weightGrams} onChange={e => set('weightGrams', e.target.value)} placeholder="4.25" />
        </div>
        <div>
          <label className={labelClass}>Gemstone Count N</label>
          <input className={inputClass} type="number" min="0" step="1" value={form.gemstoneCount} onChange={e => set('gemstoneCount', e.target.value)} placeholder="1" />
          <p className="text-[10px] text-warm mt-1 font-dm-sans">N in formula: N × (s + st)</p>
        </div>
        <div>
          <label className={labelClass}>Labour Override L (₹/g)</label>
          <input className={inputClass} type="number" step="0.01" value={form.makingChargeC} onChange={e => set('makingChargeC', e.target.value)} placeholder="0.00" />
          <p className="text-[10px] text-warm mt-1 font-dm-sans">0 = use global Labour Cost from Settings</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-gold" />
        <label htmlFor="featured" className="text-sm font-dm-sans text-charcoal cursor-pointer">
          Show on homepage (featured)
        </label>
      </div>

      <ImageUpload
        value={form.images}
        onChange={imgs => set('images', imgs)}
        folder="products"
        max={6}
      />

      {error && <p className="text-red-500 text-sm font-dm-sans">{error}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create Product'}
        </button>
        <button type="button" onClick={() => (onCancel ? onCancel() : router.back())} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
