'use client';

import { useState } from 'react';
import SiteImageField from '@/components/admin/SiteImageField';

export type SettingsField = {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  note?: string;
  options?: Array<{ value: string; label: string }>;
  /** Value used when the key has never been saved */
  fallback?: string;
};

export type SettingsGroup = {
  section: string;
  note?: string;
  fields: SettingsField[];
};

/** Seed unsaved keys with their declared fallback so a first save persists them. */
function withFallbacks(initial: Record<string, string>, groups: SettingsGroup[]): Record<string, string> {
  const seeded = { ...initial };
  groups.forEach(section =>
    section.fields.forEach(field => {
      if (field.fallback !== undefined && seeded[field.key] === undefined) {
        seeded[field.key] = field.fallback;
      }
    })
  );
  return seeded;
}

/**
 * Generic grouped SiteSettings editor. Renders any set of field groups and
 * saves the whole map to /api/admin/settings. Used by Admin → Settings and
 * by the per-page editors under Admin → Pages.
 */
export default function SiteSettingsEditor({
  groups,
  initial,
  saveLabel = 'Save',
}: {
  groups: SettingsGroup[];
  initial: Record<string, string>;
  saveLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => withFallbacks(initial, groups));
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const set = (key: string, value: string) => setValues(v => ({ ...v, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fieldBase   = "bg-ivory border border-black/10 px-4 py-2.5 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
  const inputClass  = `${fieldBase} w-48`;
  const textClass   = `${fieldBase} w-full max-w-xl`;
  const areaClass   = `${fieldBase} w-full max-w-xl min-h-20`;
  const selectClass = `${fieldBase} w-64`;
  const labelClass  = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-1.5";

  return (
    <div className="space-y-10">
      {groups.map(section => (
        <div key={section.section}>
          <h2 className="font-dm-sans text-xs uppercase tracking-widest text-charcoal mb-1">{section.section}</h2>
          {section.note && (
            <p className="text-[10px] font-mono text-warm bg-black/5 px-3 py-1.5 mb-4 inline-block max-w-xl">{section.note}</p>
          )}
          <div className="space-y-6">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className={labelClass}>{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={values[field.key] ?? field.fallback ?? ''}
                    onChange={e => set(field.key, e.target.value)}
                    className={selectClass}
                  >
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === 'toggle' ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => set(field.key, values[field.key] === 'true' ? 'false' : 'true')}
                      className={`w-10 h-5 rounded-full transition-colors relative ${values[field.key] === 'true' ? 'bg-gold' : 'bg-black/20'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${values[field.key] === 'true' ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <span className="text-sm font-dm-sans text-charcoal">
                      {values[field.key] === 'true' ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                ) : field.type === 'currency' ? (
                  <div className="flex items-center" role="group" aria-label={field.label}>
                    {[
                      { value: 'INR', label: '₹ INR' },
                      { value: 'USD', label: '$ USD' },
                    ].map(opt => {
                      const active = (values[field.key] ?? field.fallback ?? 'INR') === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set(field.key, opt.value)}
                          aria-pressed={active}
                          className={`px-6 py-2.5 font-dm-sans text-xs tracking-widest border transition-colors ${
                            active
                              ? 'bg-gold text-jet font-medium border-gold'
                              : 'bg-ivory text-charcoal border-black/10 hover:border-gold'
                          } ${opt.value === 'INR' ? 'rounded-l-full border-r-0' : 'rounded-r-full'}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : field.type === 'color' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={/^#[0-9a-fA-F]{6}$/.test(values[field.key] ?? '') ? values[field.key] : field.fallback ?? '#c9922a'}
                      onChange={e => set(field.key, e.target.value)}
                      className="w-10 h-10 border border-black/10 cursor-pointer bg-ivory p-1"
                    />
                    <input
                      type="text"
                      value={values[field.key] ?? ''}
                      onChange={e => set(field.key, e.target.value)}
                      placeholder={field.fallback}
                      className={inputClass}
                    />
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={values[field.key] ?? ''}
                    onChange={e => set(field.key, e.target.value)}
                    placeholder={field.placeholder ?? field.fallback}
                    rows={3}
                    className={areaClass}
                  />
                ) : field.type === 'image' ? (
                  <SiteImageField
                    value={values[field.key] ?? field.fallback ?? ''}
                    fallback={field.fallback ?? ''}
                    onChange={v => set(field.key, v)}
                  />
                ) : field.type === 'text' ? (
                  <input
                    type="text"
                    value={values[field.key] ?? ''}
                    onChange={e => set(field.key, e.target.value)}
                    className={textClass}
                    placeholder={field.placeholder ?? field.fallback}
                  />
                ) : (
                  <input
                    type="number"
                    step="0.001"
                    value={values[field.key] ?? ''}
                    onChange={e => set(field.key, e.target.value)}
                    className={inputClass}
                    placeholder={field.placeholder}
                  />
                )}
                {field.note && <p className="text-[10px] text-warm mt-1 font-dm-sans max-w-sm">{field.note}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
        {saved ? 'Saved ✓' : saving ? 'Saving…' : saveLabel}
      </button>
    </div>
  );
}
