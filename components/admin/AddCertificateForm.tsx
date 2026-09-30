'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

export default function AddCertificateForm() {
  const router = useRouter();
  const [form, setForm] = useState({ id: '', name: '', issuingBody: '', validity: '', imageKey: '' });
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass = "w-full bg-ivory border border-black/10 px-4 py-2.5 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-1.5";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const imageKey = images[0] ?? form.imageKey;
    if (!imageKey) { setError('Please upload a certificate image.'); setSaving(false); return; }

    const res = await fetch('/api/admin/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, imageKey }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || 'Failed');
    } else {
      setForm({ id: '', name: '', issuingBody: '', validity: '', imageKey: '' });
      setImages([]);
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>ID (unique slug) *</label>
          <input required className={inputClass} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} placeholder="bis-hallmark" />
        </div>
        <div>
          <label className={labelClass}>Certificate Name *</label>
          <input required className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="BIS Hallmark" />
        </div>
        <div>
          <label className={labelClass}>Issuing Body *</label>
          <input required className={inputClass} value={form.issuingBody} onChange={e => setForm(f => ({ ...f, issuingBody: e.target.value }))} placeholder="Bureau of Indian Standards" />
        </div>
        <div>
          <label className={labelClass}>Validity</label>
          <input className={inputClass} value={form.validity} onChange={e => setForm(f => ({ ...f, validity: e.target.value }))} placeholder="2025" />
        </div>
      </div>
      <ImageUpload value={images} onChange={setImages} folder="certificates" max={1} label="Certificate Image" />
      {error && <p className="text-red-500 text-xs font-dm-sans">{error}</p>}
      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? 'Saving…' : 'Add Certificate'}
      </button>
    </form>
  );
}
