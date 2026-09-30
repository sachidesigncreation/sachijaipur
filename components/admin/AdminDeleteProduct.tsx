'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminDeleteProduct({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin/products');
      router.refresh();
    }
    setLoading(false);
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-red-500 font-dm-sans">Delete &quot;{name}&quot;?</span>
        <button onClick={handleDelete} disabled={loading} className="text-xs text-red-500 border border-red-500 px-3 py-1.5 hover:bg-red-500 hover:text-white transition-colors font-dm-sans uppercase tracking-widest disabled:opacity-50">
          {loading ? '…' : 'Confirm'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-warm uppercase tracking-widest font-dm-sans hover:text-charcoal">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-warm uppercase tracking-widest font-dm-sans hover:text-red-500 transition-colors"
    >
      Delete
    </button>
  );
}
