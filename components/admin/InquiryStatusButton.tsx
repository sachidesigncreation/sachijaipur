'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CYCLE: Record<string, string> = { NEW: 'VIEWED', VIEWED: 'HANDLED', HANDLED: 'NEW' };
const LABELS: Record<string, string> = { NEW: 'Mark Viewed', VIEWED: 'Mark Handled', HANDLED: 'Reset to New' };

export default function InquiryStatusButton({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const advance = async () => {
    setLoading(true);
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: CYCLE[status] ?? 'VIEWED' }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={advance}
      disabled={loading}
      className="text-xs text-gold border border-gold/30 px-3 py-1.5 font-dm-sans uppercase tracking-widest hover:bg-gold hover:text-jet transition-colors disabled:opacity-50 shrink-0"
    >
      {loading ? '…' : LABELS[status] ?? 'Update'}
    </button>
  );
}
