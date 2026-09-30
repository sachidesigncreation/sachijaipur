'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SECTION_TYPES, type CmsSectionProps, type SectionType } from '@/lib/cms';
import SiteImageField from '@/components/admin/SiteImageField';
import ImageUpload from '@/components/admin/ImageUpload';

export interface EditableSection {
  id: string;
  type: string;
  sortOrder: number;
  isVisible: boolean;
  props: CmsSectionProps;
}

const inputClass = "w-full bg-ivory border border-black/10 px-4 py-2.5 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
const labelClass = "block text-xs uppercase tracking-widest text-warm font-dm-sans mb-1.5";
const bgOptions = [
  { value: 'ivory', label: 'Ivory (light)' },
  { value: 'pearl', label: 'Pearl (warm light)' },
  { value: 'jet', label: 'Jet (dark)' },
];

function Field({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {note && <p className="text-[10px] text-warm mt-1 font-dm-sans">{note}</p>}
    </div>
  );
}

function Toggle({ value, onChange, hint }: { value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${value ? 'bg-gold' : 'bg-black/20'}`}
        aria-pressed={value}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-5' : 'left-0.5'}`} />
      </button>
      {hint && <span className="text-sm font-dm-sans text-charcoal">{hint}</span>}
    </div>
  );
}

/** Parse stats textarea lines ("150+ | Skilled Craftsmen") into items. */
function parseStats(text: string): Array<{ value: string; label: string }> {
  return text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const [value = '', ...rest] = line.split('|');
      return { value: value.trim(), label: rest.join('|').trim() };
    })
    .filter(i => i.value || i.label);
}

function statsToText(items?: Array<{ value: string; label: string }>): string {
  return (items ?? []).map(i => `${i.value} | ${i.label}`).join('\n');
}

/** Hex color with an empty-means-default state. */
function ColorOrDefault({
  label,
  value,
  onChange,
  note,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  note?: string;
}) {
  return (
    <Field label={label} note={note}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#c9922a'}
          onChange={e => onChange(e.target.value)}
          className="w-10 h-10 shrink-0 border border-black/10 cursor-pointer bg-ivory p-1"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Theme default"
          className={`${inputClass} font-mono text-xs`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] uppercase tracking-widest font-dm-sans text-warm hover:text-charcoal transition-colors px-2 shrink-0"
          >
            Default
          </button>
        )}
      </div>
    </Field>
  );
}

function SectionForm({
  type,
  initial,
  saving,
  onSave,
  onCancel,
}: {
  type: SectionType;
  initial: CmsSectionProps;
  saving: boolean;
  onSave: (props: CmsSectionProps) => void;
  onCancel: () => void;
}) {
  const [p, setP] = useState<CmsSectionProps>({ ...initial });
  const [statsText, setStatsText] = useState(statsToText(initial.items));
  const [galleryText, setGalleryText] = useState((initial.images ?? []).join('\n'));

  const set = (k: string, v: unknown) => setP(prev => ({ ...prev, [k]: v }));

  const str = (k: keyof CmsSectionProps): string =>
    typeof p[k] === 'string' ? (p[k] as string) : '';

  const handleSave = () => {
    const out: CmsSectionProps = { ...p };
    if (type === 'stats') out.items = parseStats(statsText);
    if (type === 'gallery') {
      out.images = galleryText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    }
    onSave(out);
  };

  return (
    <div className="space-y-4 bg-pearl/50 border border-gold/20 p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(type === 'hero' || type === 'text' || type === 'image_text' || type === 'gallery' || type === 'stats') && (
          <Field label="Eyebrow (small label)">
            <input className={inputClass} value={str('eyebrow')} onChange={e => set('eyebrow', e.target.value)} placeholder="Our Story" />
          </Field>
        )}
        {(type === 'hero' || type === 'text' || type === 'image_text' || type === 'gallery' || type === 'cta' || type === 'stats') && (
          <Field label="Heading">
            <input className={inputClass} value={str('heading')} onChange={e => set('heading', e.target.value)} placeholder="Section heading" />
          </Field>
        )}
      </div>

      {(type === 'hero' || type === 'cta') && (
        <Field label="Subtext">
          <textarea className={`${inputClass} min-h-20`} rows={2} value={str('subtext')} onChange={e => set('subtext', e.target.value)} placeholder="Supporting line under the heading" />
        </Field>
      )}

      {(type === 'text' || type === 'image_text') && (
        <Field label="Body text" note="Blank lines split into paragraphs.">
          <textarea className={`${inputClass} min-h-28`} rows={5} value={str('body')} onChange={e => set('body', e.target.value)} placeholder="Write the section copy…" />
        </Field>
      )}

      {type === 'gallery' && (
        <Field label="Body (optional)">
          <textarea className={`${inputClass} min-h-20`} rows={2} value={str('body')} onChange={e => set('body', e.target.value)} placeholder="Optional intro line" />
        </Field>
      )}

      {(type === 'hero' || type === 'image_text') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SiteImageField value={str('image')} fallback="" onChange={v => set('image', v)} label={type === 'hero' ? 'Background image' : 'Image'} />
          <Field label="Image alt text">
            <input className={inputClass} value={str('imageAlt')} onChange={e => set('imageAlt', e.target.value)} placeholder="Describe the image" />
          </Field>
        </div>
      )}

      {type === 'gallery' && (
        <div className="space-y-3">
          <Field label="Images — one per line" note="Paste https URLs, /public paths, or R2 keys. Or upload below to append.">
            <textarea
              className={`${inputClass} min-h-28 font-mono text-xs`}
              rows={4}
              value={galleryText}
              onChange={e => setGalleryText(e.target.value)}
              placeholder={'https://…\n/BentoGrid/1.png'}
            />
          </Field>
          <ImageUpload
            value={[]}
            onChange={keys => {
              if (keys.length > 0) setGalleryText(t => (t ? t + '\n' : '') + keys.join('\n'));
            }}
            folder="site"
            max={8}
            label="Upload to append"
          />
        </div>
      )}

      {type === 'stats' && (
        <Field label='Stats — one per line as "value | label"' note="Example: 150+ | Skilled Craftsmen">
          <textarea
            className={`${inputClass} min-h-28 font-mono text-xs`}
            rows={4}
            value={statsText}
            onChange={e => setStatsText(e.target.value)}
            placeholder={'150+ | Skilled Craftsmen\n8 | Global Markets'}
          />
        </Field>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(type === 'hero') && (
          <>
            <Field label="Alignment">
              <select className={inputClass} value={str('align') || 'center'} onChange={e => set('align', e.target.value)}>
                <option value="center">Center</option>
                <option value="left">Left</option>
              </select>
            </Field>
            <Field label="Dark overlay">
              <Toggle value={p.overlay !== false} onChange={v => set('overlay', v)} hint={p.overlay !== false ? 'On (text readable on photos)' : 'Off'} />
            </Field>
          </>
        )}
        {(type === 'text' || type === 'image_text' || type === 'cta' || type === 'stats') && (
          <Field label="Background">
            <select className={inputClass} value={str('bg') || 'ivory'} onChange={e => set('bg', e.target.value)}>
              {bgOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        )}
        {(type === 'text') && (
          <Field label="Alignment">
            <select className={inputClass} value={str('align') || 'center'} onChange={e => set('align', e.target.value)}>
              <option value="center">Center</option>
              <option value="left">Left</option>
            </select>
          </Field>
        )}
        {(type === 'image_text') && (
          <Field label="Image position">
            <select className={inputClass} value={str('align') || 'left'} onChange={e => set('align', e.target.value)}>
              <option value="left">Image left</option>
              <option value="right">Image right</option>
            </select>
          </Field>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ColorOrDefault
          label="Custom background"
          value={str('bgColor')}
          onChange={v => set('bgColor', v)}
          note={type === 'hero' ? 'Used only when there is no background image. Empty = theme default.' : 'Overrides the preset above. Empty = theme default.'}
        />
        <ColorOrDefault
          label="Custom text color"
          value={str('textColor')}
          onChange={v => set('textColor', v)}
          note="Headings and body copy. Empty = theme default."
        />
      </div>

      {(type === 'hero' || type === 'cta') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Primary button label">
            <input className={inputClass} value={str('primaryLabel')} onChange={e => set('primaryLabel', e.target.value)} placeholder="Shop Now" />
          </Field>
          <Field label="Primary button link">
            <input className={inputClass} value={str('primaryHref')} onChange={e => set('primaryHref', e.target.value)} placeholder="/products" />
          </Field>
          <Field label="Secondary button label">
            <input className={inputClass} value={str('secondaryLabel')} onChange={e => set('secondaryLabel', e.target.value)} placeholder="Contact Us" />
          </Field>
          <Field label="Secondary button link">
            <input className={inputClass} value={str('secondaryHref')} onChange={e => set('secondaryHref', e.target.value)} placeholder="/contact" />
          </Field>
        </div>
      )}

      {type === 'image_text' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Button label (optional)">
            <input className={inputClass} value={str('ctaLabel')} onChange={e => set('ctaLabel', e.target.value)} placeholder="Learn More" />
          </Field>
          <Field label="Button link">
            <input className={inputClass} value={str('ctaHref')} onChange={e => set('ctaHref', e.target.value)} placeholder="/about" />
          </Field>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Section'}
        </button>
        <button type="button" onClick={onCancel} className="text-xs text-warm uppercase tracking-widest hover:text-charcoal px-2">
          Cancel
        </button>
      </div>
    </div>
  );
}

function sectionSummary(s: EditableSection): string {
  const h = typeof s.props.heading === 'string' && s.props.heading ? ` — “${s.props.heading}”` : '';
  const extra = s.type === 'gallery' && Array.isArray(s.props.images) ? ` (${s.props.images.length} images)` : '';
  const label = SECTION_TYPES.find(t => t.value === s.type)?.label ?? s.type;
  return `${label}${h}${extra}`;
}

export default function CmsSectionManager({ pageId, initialSections }: { pageId: string; initialSections: EditableSection[] }) {
  const router = useRouter();
  const [sections, setSections] = useState<EditableSection[]>(() =>
    [...initialSections].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [addingType, setAddingType] = useState<SectionType | ''>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = () => router.refresh();

  const createSection = async (props: CmsSectionProps) => {
    if (!addingType) return;
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/cms/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, type: addingType, props }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Failed to add section.');
      return;
    }
    setSections(s => [...s, { id: data.id, type: data.type, sortOrder: data.sortOrder, isVisible: data.isVisible, props: (data.props ?? {}) as CmsSectionProps }]);
    setAddingType('');
    refresh();
  };

  const saveSection = async (id: string, props: CmsSectionProps) => {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/admin/cms/sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ props }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Failed to save section.');
      return;
    }
    setSections(s => s.map(x => (x.id === id ? { ...x, props: (data.props ?? props) as CmsSectionProps } : x)));
    setEditingId(null);
    refresh();
  };

  const duplicateSection = async (s: EditableSection) => {
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/cms/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, type: s.type, props: s.props, isVisible: s.isVisible }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Failed to duplicate.');
      return;
    }
    setSections(prev => [...prev, { id: data.id, type: data.type, sortOrder: data.sortOrder, isVisible: data.isVisible, props: (data.props ?? {}) as CmsSectionProps }]);
    refresh();
  };

  const deleteSection = async (id: string) => {
    const res = await fetch(`/api/admin/cms/sections/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSections(s => s.filter(x => x.id !== id));
      setDeletingId(null);
      refresh();
    }
  };

  const toggleVisible = async (s: EditableSection) => {
    const res = await fetch(`/api/admin/cms/sections/${s.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !s.isVisible }),
    });
    if (res.ok) {
      setSections(prev => prev.map(x => (x.id === s.id ? { ...x, isVisible: !s.isVisible } : x)));
      refresh();
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...sections];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setSections(next);
    await fetch('/api/admin/cms/sections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, orderedIds: next.map(s => s.id) }),
    });
    refresh();
  };

  return (
    <div>
      {error && <p className="text-red-500 text-xs font-dm-sans mb-4">{error}</p>}

      {sections.length === 0 && !addingType && (
        <div className="border border-dashed border-gold/30 py-10 px-6 text-center text-warm font-dm-sans text-sm mb-6">
          No sections yet — add your first one below. Sections render top-to-bottom in this order.
        </div>
      )}

      <div className="space-y-4 mb-8">
        {sections.map((s, i) => (
          <div key={s.id} className={`border rounded bg-ivory ${s.isVisible ? 'border-black/10' : 'border-black/10 opacity-60'}`}>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="font-cormorant text-lg text-gold w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <p className="font-dm-sans text-sm text-charcoal truncate">{sectionSummary(s)}</p>
                {!s.isVisible && <p className="text-[10px] uppercase tracking-widest text-warm">Hidden</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" title="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="w-7 h-7 border border-black/10 text-charcoal hover:border-gold disabled:opacity-30">↑</button>
                <button type="button" title="Move down" disabled={i === sections.length - 1} onClick={() => move(i, 1)} className="w-7 h-7 border border-black/10 text-charcoal hover:border-gold disabled:opacity-30">↓</button>
                <button type="button" title={s.isVisible ? 'Hide' : 'Show'} onClick={() => toggleVisible(s)} className="w-7 h-7 border border-black/10 text-charcoal hover:border-gold">
                  {s.isVisible ? '◉' : '○'}
                </button>
                <button type="button" title="Duplicate" onClick={() => duplicateSection(s)} disabled={saving} className="w-7 h-7 border border-black/10 text-charcoal hover:border-gold disabled:opacity-30">⧉</button>
                <button type="button" onClick={() => setEditingId(editingId === s.id ? null : s.id)} className="text-xs text-gold uppercase tracking-widest hover:text-gold-deep px-2">
                  {editingId === s.id ? 'Close' : 'Edit'}
                </button>
                {deletingId === s.id ? (
                  <span className="inline-flex items-center gap-2">
                    <button type="button" onClick={() => deleteSection(s.id)} className="text-xs uppercase tracking-widest text-red-600">Yes</button>
                    <button type="button" onClick={() => setDeletingId(null)} className="text-xs uppercase tracking-widest text-warm">No</button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setDeletingId(s.id)} className="text-xs text-warm uppercase tracking-widest hover:text-red-600 px-1">Del</button>
                )}
              </div>
            </div>
            {editingId === s.id && (
              <div className="px-4 pb-4">
                <SectionForm
                  type={s.type as SectionType}
                  initial={s.props}
                  saving={saving}
                  onSave={props => saveSection(s.id, props)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add section */}
      {!addingType ? (
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs uppercase tracking-widest text-warm font-dm-sans mb-1">+ Add section</span>
          {SECTION_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              title={t.hint}
              onClick={() => setAddingType(t.value)}
              className="border border-gold/30 px-4 py-2 font-dm-sans text-xs uppercase tracking-widest text-charcoal hover:border-gold hover:bg-gold/10 transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="border border-gold/30 p-5 bg-ivory">
          <p className="text-xs uppercase tracking-widest text-charcoal font-dm-sans mb-1">
            New section — {SECTION_TYPES.find(t => t.value === addingType)?.label}
          </p>
          <p className="text-[11px] text-warm font-dm-sans mb-4">{SECTION_TYPES.find(t => t.value === addingType)?.hint}</p>
          <SectionForm
            type={addingType}
            initial={{}}
            saving={saving}
            onSave={createSection}
            onCancel={() => setAddingType('')}
          />
        </div>
      )}
    </div>
  );
}
