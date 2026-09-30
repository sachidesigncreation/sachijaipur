'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeSlug } from '@/lib/cms';

export interface PageFormState {
  id?: string;
  title: string;
  slug: string;
  navLabel: string;
  showInNav: boolean;
  navOrder: string;
  status: string;
  metaDescription: string;
}

/**
 * Page settings form — used for both creating (no id) and editing a page.
 * On create it redirects into the page editor; on edit it shows a saved tick.
 */
export default function CmsPageSettingsForm({ initial }: { initial?: Partial<PageFormState> }) {
  const router = useRouter();
  const [form, setForm] = useState<PageFormState>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    navLabel: initial?.navLabel ?? '',
    showInNav: initial?.showInNav ?? false,
    navOrder: initial?.navOrder ?? '0',
    status: initial?.status ?? 'DRAFT',
    metaDescription: initial?.metaDescription ?? '',
  });
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!initial?.id;

  const set = (k: keyof PageFormState, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v } as PageFormState));

  const handleTitle = (v: string) => {
    setForm(f => ({ ...f, title: v, slug: slugTouched ? f.slug : normalizeSlug(v) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const payload = {
      title: form.title.trim(),
      slug: normalizeSlug(form.slug || form.title),
      navLabel: form.navLabel.trim(),
      showInNav: form.showInNav,
      navOrder: Number(form.navOrder) || 0,
      status: form.status,
      metaDescription: form.metaDescription.trim(),
    };

    const url = isEdit ? `/api/admin/cms/pages/${initial!.id}` : '/api/admin/cms/pages';
    const res = await fetch(url, {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || 'Failed to save.');
      return;
    }
    if (isEdit) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } else {
      router.push(`/admin/pages/${data.id}`);
    }
  };

  const inputClass = "w-full bg-ivory border border-black/10 px-4 py-2.5 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Page Title *</label>
          <input required className={inputClass} value={form.title} onChange={e => handleTitle(e.target.value)} placeholder="Our Story" />
        </div>
        <div>
          <label className={labelClass}>URL Slug *</label>
          <div className="flex items-center gap-0">
            <span className="bg-black/5 border border-r-0 border-black/10 px-3 py-2.5 font-dm-sans text-sm text-warm">/</span>
            <input
              required
              className={`${inputClass} font-mono`}
              value={form.slug}
              onChange={e => { setSlugTouched(true); set('slug', e.target.value); }}
              onBlur={e => set('slug', normalizeSlug(e.target.value))}
              placeholder="our-story"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Navbar Label</label>
          <input className={inputClass} value={form.navLabel} onChange={e => set('navLabel', e.target.value)} placeholder="Defaults to the title" />
          <p className="text-[10px] text-warm mt-1 font-dm-sans">Only used when “Show in navbar” is on.</p>
        </div>
        <div>
          <label className={labelClass}>Meta Description</label>
          <input className={inputClass} value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="Short SEO summary" />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="DRAFT">Draft — hidden from the site</option>
            <option value="PUBLISHED">Published — live at /{form.slug || 'slug'}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Navbar Order</label>
          <input type="number" className={inputClass} value={form.navOrder} onChange={e => set('navOrder', e.target.value)} placeholder="0" />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-ivory border border-black/10 px-4 py-3">
        <button
          type="button"
          onClick={() => set('showInNav', !form.showInNav)}
          className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${form.showInNav ? 'bg-gold' : 'bg-black/20'}`}
          aria-pressed={form.showInNav}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.showInNav ? 'left-5' : 'left-0.5'}`} />
        </button>
        <div>
          <p className="text-sm font-dm-sans text-charcoal">Show in navbar {form.showInNav ? '· visible' : '· hidden'}</p>
          <p className="text-[11px] text-warm font-dm-sans">Published pages with this on appear in the site menu and footer automatically.</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs font-dm-sans">{error}</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving…' : saved ? 'Saved ✓' : isEdit ? 'Save Settings' : 'Create Page →'}
        </button>
        {isEdit && form.status === 'PUBLISHED' && (
          <a href={`/${form.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gold uppercase tracking-widest hover:text-gold-deep">
            View live page →
          </a>
        )}
      </div>
    </form>
  );
}
