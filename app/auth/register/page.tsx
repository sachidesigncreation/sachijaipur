'use client';

import { useState } from 'react';
import Link from 'next/link';

const COUNTRIES = ['India', 'United States', 'United Arab Emirates', 'United Kingdom', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'China', 'Other'];
const BUSINESS_TYPES = ['Retailer', 'Wholesaler', 'Designer', 'Other'];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', country: 'India', phone: '', businessType: 'Retailer' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const d = await res.json();
      setError(d.error || 'Registration failed');
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-transparent border border-black/10 px-4 py-3 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-2";

  if (success) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border-2 border-gold flex items-center justify-center mx-auto mb-6">
            <span className="text-gold text-2xl">✓</span>
          </div>
          <h1 className="font-cormorant text-3xl text-charcoal mb-3">Application Received</h1>
          <p className="font-dm-sans text-warm text-sm leading-relaxed mb-6">
            Thank you for registering with Sachi Jaipur. Your wholesale account application is under review.
            We&apos;ll send you an email once it&apos;s approved — typically within 1–2 business days.
          </p>
          <Link href="/" className="btn-primary">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="font-cormorant text-3xl text-charcoal tracking-widest uppercase">Sachi</Link>
          <p className="font-dm-sans text-warm text-xs uppercase tracking-widest mt-2">Wholesale Account Registration</p>
        </div>

        <div className="bg-ivory border border-gold/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contact Name *</label>
                <input className={inputClass} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
              </div>
              <div>
                <label className={labelClass}>Company / Brand *</label>
                <input className={inputClass} required value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Jewels" />
              </div>
              <div>
                <label className={labelClass}>Business Email *</label>
                <input className={inputClass} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" />
              </div>
              <div>
                <label className={labelClass}>Password *</label>
                <input className={inputClass} type="password" required minLength={8} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className={labelClass}>Country *</label>
                <select className={inputClass} required value={form.country} onChange={e => set('country', e.target.value)}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Business Type *</label>
                <select className={inputClass} required value={form.businessType} onChange={e => set('businessType', e.target.value)}>
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Phone / WhatsApp</label>
                <input className={inputClass} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 9876543210" />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-dm-sans">{error}</p>}

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 mt-2">
              {loading ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>

          <p className="text-center text-warm text-xs font-dm-sans mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-charcoal underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
