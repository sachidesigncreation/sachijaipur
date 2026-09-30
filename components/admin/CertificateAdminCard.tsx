'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { normalizeR2Image } from '@/lib/r2/config';

interface Cert {
  id: string;
  name: string;
  issuingBody: string;
  imageKey: string;
  validity: string | null;
  sortOrder: number;
}

export default function CertificateAdminCard({ cert }: { cert: Cert }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const imageUrl = normalizeR2Image(cert.imageKey) ?? cert.imageKey;

  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/admin/certificates/${cert.id}`, { method: 'DELETE' });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="bg-ivory border border-gold/20 p-4 rounded space-y-3">
      <div className="aspect-[4/3] relative bg-pearl border border-gold/10 overflow-hidden">
        <Image src={imageUrl} alt={cert.name} fill className="object-contain p-2" />
      </div>
      <div>
        <p className="font-dm-sans font-medium text-charcoal text-sm">{cert.name}</p>
        <p className="text-xs text-warm">{cert.issuingBody}</p>
        {cert.validity && <p className="text-xs text-warm">Validity: {cert.validity}</p>}
      </div>
      {confirming ? (
        <div className="flex gap-2">
          <button onClick={handleDelete} disabled={loading} className="flex-1 text-xs py-1.5 bg-red-500 text-white font-dm-sans uppercase tracking-widest hover:bg-red-600 disabled:opacity-50">
            {loading ? '…' : 'Delete'}
          </button>
          <button onClick={() => setConfirming(false)} className="flex-1 text-xs py-1.5 border border-black/10 text-warm font-dm-sans uppercase tracking-widest hover:text-charcoal">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setConfirming(true)} className="text-xs text-warm font-dm-sans uppercase tracking-widest hover:text-red-500 transition-colors">
          Delete
        </button>
      )}
    </div>
  );
}
