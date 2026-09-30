'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check account status
    const res = await fetch('/api/auth/status');
    const data = await res.json();

    if (data.status === 'PENDING') {
      router.push('/auth/pending');
    } else if (data.status === 'REJECTED') {
      router.push('/auth/rejected');
    } else if (data.status === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/products');
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-transparent border border-black/10 px-4 py-3 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-2";

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="font-cormorant text-3xl text-charcoal tracking-widest uppercase">Sachi</Link>
          <p className="font-dm-sans text-warm text-xs uppercase tracking-widest mt-2">Wholesale Portal</p>
        </div>

        <div className="bg-ivory border border-gold/10 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" required className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@company.com" />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" required className={inputClass} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error && <p className="text-red-500 text-xs font-dm-sans">{error}</p>}

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-warm text-xs font-dm-sans mt-6">
            New to Sachi Jaipur?{' '}
            <Link href="/auth/register" className="text-charcoal underline">Apply for wholesale access</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
