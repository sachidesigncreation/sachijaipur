'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StoneRow { id: string; stoneName: string; priceD: number; satinCost: number; }

export default function StonePriceManager({ stones }: { stones: StoneRow[] }) {
  const router = useRouter();
  const [newName,      setNewName]      = useState('');
  const [newPrice,     setNewPrice]     = useState('');
  const [newSatin,     setNewSatin]     = useState('');
  const [saving,       setSaving]       = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [editPrice,    setEditPrice]    = useState('');
  const [editSatin,    setEditSatin]    = useState('');

  const addStone = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await fetch('/api/admin/stone-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stoneName: newName.trim(),
        priceD:    parseFloat(newPrice)    || 0,
        satinCost: parseFloat(newSatin)    || 0,
      }),
    });
    setNewName('');
    setNewPrice('');
    setNewSatin('');
    router.refresh();
    setSaving(false);
  };

  const updateStone = async (id: string) => {
    await fetch(`/api/admin/stone-prices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceD:    parseFloat(editPrice) || 0,
        satinCost: parseFloat(editSatin) || 0,
      }),
    });
    setEditId(null);
    router.refresh();
  };

  const deleteStone = async (id: string) => {
    await fetch(`/api/admin/stone-prices/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  const inputClass = "border border-black/10 px-3 py-2 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors bg-ivory";

  return (
    <div className="space-y-4">
      <h2 className="font-dm-sans text-sm uppercase tracking-widest text-charcoal">Stone &amp; Satin Costs</h2>
      <p className="text-[10px] text-warm font-dm-sans max-w-lg">
        Used in formula: <span className="font-mono">N × (s + st)</span> — where <strong>s</strong> = Stone Cost (₹/piece) and <strong>st</strong> = Satin/Setting Cost (₹/piece, per stone type).
      </p>

      {/* Header row */}
      {stones.length > 0 && (
        <div className="grid grid-cols-[1fr_120px_120px_80px] gap-2 px-4 py-1">
          <span className="text-[10px] uppercase tracking-widest text-warm font-dm-sans">Stone Name</span>
          <span className="text-[10px] uppercase tracking-widest text-warm font-dm-sans text-right">Stone Cost s (₹)</span>
          <span className="text-[10px] uppercase tracking-widest text-warm font-dm-sans text-right">Satin Cost st (₹)</span>
          <span />
        </div>
      )}

      <div className="space-y-2">
        {stones.map(stone => (
          <div key={stone.id} className="grid grid-cols-[1fr_auto] items-center gap-4 bg-ivory border border-black/5 px-4 py-3 rounded">
            <span className="font-dm-sans text-sm text-charcoal">{stone.stoneName}</span>
            {editId === stone.id ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-warm font-dm-sans">Stone s</label>
                  <input type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} className={`${inputClass} w-24`} placeholder="0.00" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-warm font-dm-sans">Satin st</label>
                  <input type="number" step="0.01" value={editSatin} onChange={e => setEditSatin(e.target.value)} className={`${inputClass} w-24`} placeholder="0.00" />
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <button onClick={() => updateStone(stone.id)} className="text-xs text-gold font-dm-sans uppercase tracking-widest">Save</button>
                  <button onClick={() => setEditId(null)} className="text-xs text-warm font-dm-sans uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest text-warm font-dm-sans">Stone s</p>
                  <span className="font-dm-sans text-sm text-warm">₹{Math.round(stone.priceD).toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest text-warm font-dm-sans">Satin st</p>
                  <span className="font-dm-sans text-sm text-warm">₹{Math.round(stone.satinCost).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setEditId(stone.id);
                      setEditPrice(stone.priceD.toString());
                      setEditSatin(stone.satinCost.toString());
                    }}
                    className="text-xs text-gold font-dm-sans uppercase tracking-widest"
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteStone(stone.id)} className="text-xs text-warm font-dm-sans uppercase tracking-widest hover:text-red-500">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new row */}
      <div className="flex items-end gap-3 pt-2">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-warm font-dm-sans mb-1">Stone Name</label>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Diamond" className={`${inputClass} w-32`} />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-warm font-dm-sans mb-1">Stone Cost s (₹)</label>
          <input type="number" step="1" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="0" className={`${inputClass} w-24`} />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-warm font-dm-sans mb-1">Satin Cost st (₹)</label>
          <input type="number" step="1" value={newSatin} onChange={e => setNewSatin(e.target.value)} placeholder="0" className={`${inputClass} w-24`} />
        </div>
        <button onClick={addStone} disabled={saving || !newName.trim()} className="btn-secondary text-sm disabled:opacity-40">
          {saving ? '…' : 'Add'}
        </button>
      </div>
    </div>
  );
}
