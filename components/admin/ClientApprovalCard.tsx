'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ClientRow {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  businessType: string;
  phone: string | null;
  createdAt: Date;
}

export default function ClientApprovalCard({ client }: { client: ClientRow }) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const act = async (action: 'approve' | 'reject') => {
    setLoading(true);
    await fetch(`/api/admin/clients/${client.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, rejectionNote: reason }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="bg-ivory border border-gold/20 p-5 rounded space-y-3">
      <div>
        <h3 className="font-dm-sans font-semibold text-charcoal text-sm">{client.company}</h3>
        <p className="text-xs text-warm mt-0.5">{client.name} · {client.country} · {client.businessType}</p>
        <p className="text-xs text-warm mt-0.5 break-all">{client.email}</p>
        {client.phone && <p className="text-xs text-warm">{client.phone}</p>}
        <p className="text-[10px] text-warm/60 mt-1.5">{new Date(client.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      </div>

      {rejecting ? (
        <div className="space-y-2">
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Rejection reason (optional)"
            rows={2}
            className="w-full border border-black/10 px-3 py-2 text-xs text-charcoal font-dm-sans focus:outline-none focus:border-gold resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => act('reject')}
              disabled={loading}
              className="flex-1 text-xs py-2 bg-red-500 text-white font-dm-sans uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? '…' : 'Confirm Reject'}
            </button>
            <button
              onClick={() => { setRejecting(false); setReason(''); }}
              className="flex-1 text-xs py-2 border border-black/10 text-warm font-dm-sans uppercase tracking-widest hover:text-charcoal"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => act('approve')}
            disabled={loading}
            className="flex-1 text-xs py-2 bg-gold text-jet font-dm-sans uppercase tracking-widest hover:bg-gold-deep transition-colors disabled:opacity-50"
          >
            {loading ? '…' : 'Approve'}
          </button>
          <button
            onClick={() => setRejecting(true)}
            className="flex-1 text-xs py-2 border border-black/10 text-warm font-dm-sans uppercase tracking-widest hover:text-red-500 hover:border-red-300 transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
