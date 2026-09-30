'use client';

import { useState } from 'react';

export interface TeamRow {
  id: string;
  email: string;
  name: string;
  role: string;
  isSelf: boolean;
}

const ROLES = ['owner', 'admin'];

/**
 * Admin → Team: User-table members with inline role editing.
 * The same rows are editable from Supabase → Table Editor → User.
 */
export default function TeamManager({ initial }: { initial: TeamRow[] }) {
  const [rows, setRows] = useState<TeamRow[]>(initial);
  const [form, setForm] = useState({ name: '', email: '', role: 'admin', password: '' });
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setNotice('');
  };

  const apiError = async (res: Response) => {
    const data = await res.json().catch(() => ({}));
    return (data as { error?: string }).error || 'Failed.';
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    const res = await fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Failed to add.');
      return;
    }
    const user = (data as { user: Omit<TeamRow, 'isSelf'> }).user;
    setRows(prev =>
      [...prev.filter(r => r.id !== user.id), { ...user, isSelf: false }].sort(
        (a, b) => (a.role === b.role ? 0 : a.role === 'owner' ? -1 : 1),
      ),
    );
    setNotice(
      (data as { createdLogin?: boolean }).createdLogin
        ? `${user.email} added as ${user.role} — they can open the admin panel right away.`
        : `${user.email} saved as ${user.role}.`,
    );
    setForm({ name: '', email: '', role: 'admin', password: '' });
  };

  const changeRole = async (id: string, role: string) => {
    setBusyId(id);
    setError('');
    const res = await fetch(`/api/admin/team/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    setBusyId(null);
    if (!res.ok) {
      setError(await apiError(res));
      return;
    }
    const data = (await res.json()) as { user: Omit<TeamRow, 'isSelf'> };
    setRows(prev => prev.map(r => (r.id === id ? { ...data.user, isSelf: r.isSelf } : r)));
  };

  const removeRow = async (id: string) => {
    setBusyId(id);
    setError('');
    const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
    setBusyId(null);
    if (!res.ok) {
      setError(await apiError(res));
      return;
    }
    setRows(prev => prev.filter(r => r.id !== id));
    setConfirmId(null);
  };

  const inputClass = "w-full bg-ivory border border-black/10 px-4 py-2.5 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-1.5";

  return (
    <div>
      {error && <p className="text-red-500 text-xs font-dm-sans mb-4">{error}</p>}

      <div className="bg-ivory border border-black/10 rounded overflow-hidden mb-10">
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-warm text-sm font-dm-sans">No team members yet — add the first owner below.</p>
        ) : (
          <table className="w-full text-sm font-dm-sans">
            <thead className="bg-charcoal text-ivory">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs uppercase tracking-widest font-medium">Name</th>
                <th className="px-4 py-2.5 text-left text-xs uppercase tracking-widest font-medium">Email</th>
                <th className="px-4 py-2.5 text-left text-xs uppercase tracking-widest font-medium">Role</th>
                <th className="px-4 py-2.5 text-right text-xs uppercase tracking-widest font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-pearl/50">
                  <td className="px-4 py-3 font-medium text-charcoal">
                    {r.name}
                    {r.isSelf && <span className="ml-2 text-[10px] uppercase tracking-widest text-gold">You</span>}
                  </td>
                  <td className="px-4 py-3 text-warm">{r.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.role}
                      disabled={busyId === r.id}
                      onChange={e => changeRole(r.id, e.target.value)}
                      className="bg-pearl border border-black/10 px-2 py-1 text-xs uppercase tracking-widest font-dm-sans text-charcoal focus:outline-none focus:border-gold disabled:opacity-50"
                    >
                      {ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.isSelf ? (
                      <span className="text-[11px] uppercase tracking-widest text-warm/50">Locked</span>
                    ) : confirmId === r.id ? (
                      <span className="inline-flex items-center gap-2">
                        <button type="button" disabled={busyId === r.id} onClick={() => removeRow(r.id)} className="text-xs uppercase tracking-widest text-red-600 hover:text-red-800 disabled:opacity-50">
                          {busyId === r.id ? '…' : 'Yes'}
                        </button>
                        <button type="button" onClick={() => setConfirmId(null)} className="text-xs uppercase tracking-widest text-warm hover:text-charcoal">No</button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setConfirmId(r.id)} className="text-xs text-warm uppercase tracking-widest hover:text-red-600 transition-colors">
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <section className="border border-gold/20 bg-ivory rounded p-6">
        <h2 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-1">Add Member</h2>
        <p className="text-warm text-xs font-dm-sans mb-6">Creates the login too when needed. The same rows can be edited in Supabase → Table Editor → User.</p>
        <form onSubmit={handleAdd} className="max-w-2xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input required className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Aarav Sharma" />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input required type="email" className={inputClass} value={form.email} onChange={e => set('email', e.target.value)} placeholder="aarav@company.com" />
            </div>
            <div>
              <label className={labelClass}>Role *</label>
              <select className={inputClass} value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(role => (
                  <option key={role} value={role}>{role === 'owner' ? 'owner — full access' : 'admin — full access'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" minLength={8} className={inputClass} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Only if they have no login yet" />
            </div>
          </div>
          {notice && <p className="text-green-600 text-xs font-dm-sans">{notice}</p>}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Adding…' : 'Add Member'}
          </button>
        </form>
      </section>
    </div>
  );
}
