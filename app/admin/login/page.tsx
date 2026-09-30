'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
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

    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-jet flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-cormorant text-3xl text-ivory tracking-widest uppercase">Sachi</h1>
          <p className="font-dm-sans text-warm text-xs uppercase tracking-widest mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-charcoal/40 border border-gold/10 p-8 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-warm font-dm-sans mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-jet border border-gold/20 text-ivory px-4 py-3 font-dm-sans text-sm focus:outline-none focus:border-gold"
              placeholder="admin@sachijewellery.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-warm font-dm-sans mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-jet border border-gold/20 text-ivory px-4 py-3 font-dm-sans text-sm focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-dm-sans">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-warm/40 text-xs mt-6 font-dm-sans">
          Access restricted to authorised personnel only.
        </p>
      </div>
    </div>
  );
}
