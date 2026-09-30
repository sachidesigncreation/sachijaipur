'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── NDJSON stream event types ─────────────────────────────────────────────────
type StreamEvent =
  | { type: 'start'; total: number }
  | { type: 'progress'; index: number; total: number; name: string; sku: string }
  | { type: 'images_start'; sku: string; count: number }
  | { type: 'images_done'; sku: string; uploaded: number; failed: number }
  | { type: 'saved'; sku: string; action: 'inserted' | 'updated' }
  | { type: 'row_error'; sku: string; message: string }
  | { type: 'complete'; inserted: number; updated: number; errors: number; imagesUploaded: number; imagesFailed: number };

type LogEntry = { id: number; text: string; kind: 'info' | 'ok' | 'warn' | 'error' };

// ── Lightweight CSV row count (server handles full parse) ─────────────────────
function countDataRows(csv: string): number {
  // Quick count: split by lines, skip header and blanks.
  // Handles quoted multi-line cells well enough for a count estimate.
  let rows = 0;
  let inQuote = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (c === '"') inQuote = !inQuote;
    if (!inQuote && c === '\n') rows++;
  }
  // rows now = number of newlines; subtract 1 for header, guard negatives
  return Math.max(0, rows - 1);
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CsvImportClient() {
  const router = useRouter();
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [done, setDone] = useState<StreamEvent & { type: 'complete' } | null>(null);
  const [error, setError] = useState('');
  const logIdRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, kind: LogEntry['kind'] = 'info') => {
    const id = ++logIdRef.current;
    setLog(prev => [...prev.slice(-199), { id, text, kind }]);
    // scroll log to bottom
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 20);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCsvText((ev.target?.result as string) ?? '');
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    setError('');
    setDone(null);
    setLog([]);

    try {
      const res = await fetch('/api/admin/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || `Request failed (${res.status})`);
        setImporting(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (reader) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buf += decoder.decode(value, { stream: true });

        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const ev = JSON.parse(line) as StreamEvent;
            handleEvent(ev);
          } catch {
            // ignore malformed chunk
          }
        }
      }
    } catch (err) {
      setError(String(err));
    }

    setImporting(false);
  };

  const handleEvent = (ev: StreamEvent) => {
    switch (ev.type) {
      case 'start':
        addLog(`Starting import — ${ev.total} product${ev.total !== 1 ? 's' : ''} detected.`, 'info');
        break;
      case 'progress':
        addLog(`[${ev.index}/${ev.total}] Processing: ${ev.name} (${ev.sku})`, 'info');
        break;
      case 'images_start':
        addLog(`  ↓ Downloading ${ev.count} image${ev.count !== 1 ? 's' : ''}…`, 'info');
        break;
      case 'images_done':
        if (ev.failed > 0 && ev.uploaded === 0) {
          addLog(`  ✗ Images: ${ev.failed} failed (check Drive sharing)`, 'warn');
        } else if (ev.failed > 0) {
          addLog(`  ✓ Images: ${ev.uploaded} uploaded, ${ev.failed} failed`, 'warn');
        } else {
          addLog(`  ✓ Images: ${ev.uploaded} uploaded to R2`, 'ok');
        }
        break;
      case 'saved':
        addLog(`  ✓ ${ev.action === 'inserted' ? 'Created' : 'Updated'} product (${ev.sku})`, 'ok');
        break;
      case 'row_error':
        addLog(`  ✗ DB error for ${ev.sku}: ${ev.message}`, 'error');
        break;
      case 'complete':
        setDone(ev);
        addLog(
          `Done — ${ev.inserted} inserted · ${ev.updated} updated · ${ev.errors} errors · ${ev.imagesUploaded} images uploaded · ${ev.imagesFailed} images failed`,
          ev.errors > 0 ? 'warn' : 'ok',
        );
        router.refresh();
        break;
    }
  };

  const reset = () => {
    setCsvText('');
    setLog([]);
    setDone(null);
    setError('');
  };

  const rowCount = csvText.trim() ? countDataRows(csvText) : 0;

  const logKindClass: Record<LogEntry['kind'], string> = {
    info:  'text-warm',
    ok:    'text-green-600',
    warn:  'text-amber-600',
    error: 'text-red-500',
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Template download */}
      <div className="flex items-center gap-4 p-4 bg-pearl border border-gold/20">
        <div>
          <p className="font-dm-sans text-sm font-medium text-charcoal">Products Import Template</p>
          <p className="text-xs text-warm mt-0.5">Use this CSV template to prepare your products. Google Drive image links are auto-downloaded and uploaded to R2.</p>
        </div>
        <a
          href="/products-import-template.csv"
          download="Sachi_Products_Import_Template.csv"
          className="shrink-0 border border-gold text-gold px-4 py-2 font-dm-sans text-xs tracking-widest uppercase hover:bg-gold hover:text-jet transition-colors"
        >
          ↓ Download Template
        </a>
      </div>

      {done ? (
        /* Result screen */
        <div className="bg-ivory border border-gold/20 p-6 rounded">
          <p className="font-cormorant text-2xl text-charcoal mb-2">Import Complete</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4 font-dm-sans text-sm">
            <div className="bg-green-50 border border-green-200 p-3 rounded text-center">
              <span className="block text-2xl font-cormorant text-green-700">{done.inserted}</span>
              <span className="text-xs text-warm uppercase tracking-widest">Inserted</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-center">
              <span className="block text-2xl font-cormorant text-blue-700">{done.updated}</span>
              <span className="text-xs text-warm uppercase tracking-widest">Updated</span>
            </div>
            <div className={`p-3 rounded text-center border ${done.errors > 0 ? 'bg-red-50 border-red-200' : 'bg-pearl border-black/10'}`}>
              <span className={`block text-2xl font-cormorant ${done.errors > 0 ? 'text-red-600' : 'text-warm'}`}>{done.errors}</span>
              <span className="text-xs text-warm uppercase tracking-widest">Errors</span>
            </div>
            <div className="bg-gold/10 border border-gold/30 p-3 rounded text-center">
              <span className="block text-2xl font-cormorant text-gold-deep">{done.imagesUploaded}</span>
              <span className="text-xs text-warm uppercase tracking-widest">Images → R2</span>
            </div>
            {done.imagesFailed > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded text-center">
                <span className="block text-2xl font-cormorant text-amber-700">{done.imagesFailed}</span>
                <span className="text-xs text-warm uppercase tracking-widest">Images Failed</span>
              </div>
            )}
          </div>
          {done.imagesFailed > 0 && (
            <p className="text-xs text-amber-700 font-dm-sans bg-amber-50 border border-amber-200 px-3 py-2 mb-4">
              Some images could not be downloaded. Make sure the Google Drive files are shared publicly (&quot;Anyone with the link can view&quot;).
            </p>
          )}
          {/* Scrollable log */}
          <div
            ref={logRef}
            className="h-40 overflow-y-auto bg-jet text-xs font-mono p-3 space-y-0.5 rounded mb-4"
          >
            {log.map(l => (
              <div key={l.id} className={logKindClass[l.kind]}>{l.text}</div>
            ))}
          </div>
          <button onClick={reset} className="btn-primary text-sm">
            Import Another File
          </button>
        </div>
      ) : (
        <>
          {/* File upload */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-warm font-dm-sans mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="font-dm-sans text-sm text-charcoal"
            />
          </div>

          {/* Or paste */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-warm font-dm-sans mb-2">
              Or Paste CSV Content
            </label>
            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              rows={8}
              placeholder={`SKU,Thumbnail for Reference,Name,Category,...`}
              className="w-full bg-ivory border border-black/10 px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-gold font-mono resize-y"
            />
            {rowCount > 0 && (
              <p className="text-xs text-warm font-dm-sans mt-1">{rowCount} data row{rowCount !== 1 ? 's' : ''} detected</p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm font-dm-sans bg-red-50 border border-red-200 px-3 py-2">
              {error}
            </p>
          )}

          {/* Live log while importing */}
          {log.length > 0 && (
            <div>
              <p className="text-xs text-warm font-dm-sans uppercase tracking-widest mb-2">Import Log</p>
              <div
                ref={logRef}
                className="h-52 overflow-y-auto bg-jet text-xs font-mono p-3 space-y-0.5 rounded"
              >
                {log.map(l => (
                  <div key={l.id} className={logKindClass[l.kind]}>{l.text}</div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handleImport}
              disabled={!csvText.trim() || importing}
              className="btn-primary text-sm disabled:opacity-40"
            >
              {importing
                ? '⏳ Importing & uploading images…'
                : rowCount > 0
                  ? `Import ${rowCount} Product${rowCount !== 1 ? 's' : ''}`
                  : 'Import'}
            </button>
            {importing && (
              <span className="text-xs text-warm font-dm-sans animate-pulse">
                Downloading images from Google Drive and uploading to R2 — this may take a minute…
              </span>
            )}
          </div>

          <div className="text-xs text-warm font-dm-sans space-y-1 border-t border-black/10 pt-4">
            <p>• Google Drive image links are automatically downloaded, compressed to WebP, and uploaded to R2.</p>
            <p>• Make sure Drive files are shared: <strong>Anyone with the link → Viewer</strong>.</p>
            <p>• Products are upserted by SKU — rows without a SKU get an auto-generated one.</p>
            <p>• Existing products are updated; only images are replaced if new ones are found.</p>
          </div>
        </>
      )}
    </div>
  );
}
