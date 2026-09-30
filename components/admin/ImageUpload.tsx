'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { normalizeR2Image } from '@/lib/r2/config';

interface Props {
  value:    string[];    // array of R2 keys
  onChange: (keys: string[]) => void;
  folder?:  string;      // e.g. 'products' or 'certificates'
  max?:     number;      // max images
  label?:   string;
}

export default function ImageUpload({ value, onChange, folder = 'products', max = 5, label = 'Product Images' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (value.length + files.length > max) {
      setError(`Maximum ${max} images allowed.`);
      return;
    }

    setUploading(true);
    setError('');

    const newKeys: string[] = [];

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', folder);

      try {
        const res  = await fetch('/api/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok || !data.key) throw new Error(data.error || 'Upload failed');
        newKeys.push(data.key);
      } catch (err) {
        setError(String(err));
      }
    }

    onChange([...value, ...newKeys]);
    setUploading(false);
  };

  const removeImage = (key: string) => {
    onChange(value.filter(k => k !== key));
  };

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-warm font-dm-sans mb-3">{label}</label>

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {value.map(key => {
            const url = normalizeR2Image(key) ?? key;
            return (
              <div key={key} className="relative w-20 h-20 border border-gold/20 group overflow-hidden">
                <Image src={url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(key)}
                  className="absolute inset-0 bg-jet/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-ivory text-xs"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Drop zone */}
      {value.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`flex flex-col items-center justify-center w-full border border-dashed border-gold/30 py-6 text-warm font-dm-sans text-xs uppercase tracking-widest hover:border-gold hover:text-charcoal transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          {uploading ? 'Uploading…' : `Click or drag to upload (${value.length}/${max})`}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {error && <p className="text-red-500 text-xs mt-2 font-dm-sans">{error}</p>}
    </div>
  );
}
