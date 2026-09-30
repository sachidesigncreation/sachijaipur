'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginModal({ isOpen, onClose, message }: Props) {
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

    const res = await fetch('/api/auth/status');
    const data = await res.json();

    onClose();

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-jet/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm"
          >
            <div className="bg-ivory border border-gold/20 shadow-2xl p-8 relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-warm hover:text-charcoal transition-colors">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-6">
                <h2 className="font-cormorant text-2xl text-charcoal">Sign In</h2>
                <p className="font-dm-sans text-warm text-xs mt-1">
                  {message ?? 'Sign in to access the full catalogue'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
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

              <div className="text-center mt-6 space-y-2">
                <p className="text-warm text-xs font-dm-sans">
                  New to Sachi Jaipur?{' '}
                  <Link href="/auth/register" onClick={onClose} className="text-charcoal underline">
                    Apply for wholesale access
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
