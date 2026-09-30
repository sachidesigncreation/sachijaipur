'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CmsPageDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    setBusy(true);
    const res = await fetch(`/api/admin/cms/pages/${id}`, { method: 'DELETE' });
    setBusy(false);
    if (res.ok) {
      setConfirming(false);
      router.refresh();
    }
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-warm uppercase tracking-widest hover:text-red-600 transition-colors"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-warm">Delete “{title}”?</span>
      <button
        type="button"
        disabled={busy}
        onClick={handleDelete}
        className="text-xs uppercase tracking-widest text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {busy ? '…' : 'Yes'}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs uppercase tracking-widest text-warm hover:text-charcoal"
      >
        No
      </button>
    </span>
  );
}
