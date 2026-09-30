'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Custom pages flagged “Show in navbar” (Admin → Pages).
 * Rendered after the built-in links so admins can extend the menu
 * without code changes.
 */
export default function CmsNavLinks({
  variant = 'desktop',
  onNavigate,
}: {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}) {
  const [pages, setPages] = useState<Array<{ slug: string; label: string }>>([]);

  useEffect(() => {
    fetch('/api/cms/nav')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d?.pages)) setPages(d.pages);
      })
      .catch(() => {});
  }, []);

  if (pages.length === 0) return null;

  if (variant === 'mobile') {
    return (
      <>
        {pages.map(p => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            onClick={onNavigate}
            className="font-dm-sans text-2xl text-charcoal uppercase tracking-widest"
          >
            {p.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {pages.map(p => (
        <Link key={p.slug} href={`/${p.slug}`} className="hover:opacity-70 transition-opacity">
          {p.label}
        </Link>
      ))}
    </>
  );
}
