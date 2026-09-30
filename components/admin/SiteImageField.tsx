'use client';

import { useRef, useState } from 'react';
import { resolveSiteImage } from '@/lib/siteImage';

/**
 * Single-image field for admin forms. The value may be an https URL, a
 * /public path, or an R2 key. Uploads store an R2 key under folder "site".
 */
export default function SiteImageField({
  value,
  fallback,
  onChange,
  folder = 'site',
  label,
}: {
  value: string;
  fallback: string;
  onChange: (v: string) => void;
  folder?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const preview = resolveSiteImage(value || fallback, fallback);

  const handleFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.key) throw new Error(data.error || 'Upload failed');
      onChange(data.key);
    } catch (err) {
      setError(String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <span className="block text-xs uppercase tracking-widest text-warm font-dm-sans mb-1.5">{label}</span>
      )}
      <div className="flex items-start gap-3 max-w-xl">
        <div className="relative w-20 h-20 shrink-0 border border-gold/20 bg-pearl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={fallback}
            className="bg-ivory border border-black/10 px-4 py-2.5 font-dm-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors w-full"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-[11px] uppercase tracking-widest font-dm-sans border border-gold/30 px-3 py-1.5 hover:border-gold transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
            {value && value !== fallback && (
              <button
                type="button"
                onClick={() => onChange(fallback)}
                className="text-[11px] uppercase tracking-widest font-dm-sans text-warm hover:text-charcoal transition-colors px-2 py-1.5"
              >
                Reset
              </button>
            )}
          </div>
          {error && <p className="text-red-500 text-xs font-dm-sans">{error}</p>}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files)} />
        </div>
      </div>
    </div>
  );
}
