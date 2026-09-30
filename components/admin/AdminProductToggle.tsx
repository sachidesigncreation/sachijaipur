'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminProductToggle({ id, featured }: { id: string; featured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(featured);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}/toggle-featured`, { method: 'POST' });
    if (res.ok) {
      setValue(v => !v);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-gold' : 'bg-black/20'} disabled:opacity-50`}
      title={value ? 'Featured — click to unfeature' : 'Not featured — click to feature'}
    >
      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${value ? 'left-4' : 'left-0.5'}`} />
    </button>
  );
}
