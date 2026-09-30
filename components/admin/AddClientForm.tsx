'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRIES = ['India', 'United States', 'United Arab Emirates', 'United Kingdom', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'China', 'Other'];
const BUSINESS_TYPES = ['Retailer', 'Wholesaler', 'Designer', 'Other'];

/** Admin → Clients: create a wholesale login + approved account in one step. */
export default function AddClientForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', company: '', email: '', password: '',
    country: 'India', businessType: 'Retailer', phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const res = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || 'Failed to create user.');
      return;
    }
    setSuccess(`User ${data.email} created — they can sign in right away.`);
    setForm({ name: '', company: '', email: '', password: '', country: 'India', businessType: 'Retailer', phone: '' });
    router.refresh();
  };

  const inputClass = "w-full bg-ivory border border-black/10 px-4 py-2.5 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Contact Name *</label>
          <input required className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
        </div>
        <div>
          <label className={labelClass}>Company / Brand *</label>
          <input required className={inputClass} value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Jewels" />
        </div>
        <div>
          <label className={labelClass}>Business Email *</label>
          <input required type="email" className={inputClass} value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" />
        </div>
        <div>
          <label className={labelClass}>Password (min 8) *</label>
          <input required type="password" minLength={8} className={inputClass} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Set their login password" />
        </div>
        <div>
          <label className={labelClass}>Country *</label>
          <select className={inputClass} value={form.country} onChange={e => set('country', e.target.value)}>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Business Type *</label>
          <select className={inputClass} value={form.businessType} onChange={e => set('businessType', e.target.value)}>
            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Phone / WhatsApp</label>
          <input type="tel" className={inputClass} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 9876543210" />
        </div>
      </div>

      {error && <p className="text-red-500 text-xs font-dm-sans">{error}</p>}
      {success && <p className="text-green-600 text-xs font-dm-sans">{success}</p>}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? 'Creating…' : 'Create User'}
      </button>
    </form>
  );
}
