import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { CmsSectionRow, CmsSectionProps } from '@/lib/cms';
import { resolveSiteImage } from '@/lib/siteImage';
import { sanitizeHex } from '@/lib/siteConfig';

function txt(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

/** Custom background override (empty = theme default / preset). */
function customBg(p: CmsSectionProps): CSSProperties | undefined {
  const c = sanitizeHex(txt(p.bgColor), '');
  return c ? { backgroundColor: c } : undefined;
}

/** Custom text color override for headings + body copy (empty = theme default). */
function customText(p: CmsSectionProps): CSSProperties | undefined {
  const c = sanitizeHex(txt(p.textColor), '');
  return c ? { color: c } : undefined;
}

function paragraphs(body: string): string[] {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function bgClass(bg: string): string {
  if (bg === 'jet') return 'bg-jet';
  if (bg === 'pearl') return 'bg-pearl';
  return 'bg-ivory';
}

function headingColor(bg: string): string {
  return bg === 'jet' ? 'text-ivory' : 'text-charcoal';
}

function bodyColor(bg: string): string {
  return bg === 'jet' ? 'text-ivory/75' : 'text-charcoal-light';
}

function Buttons({ primaryLabel, primaryHref, secondaryLabel, secondaryHref, dark }: {
  primaryLabel?: string; primaryHref?: string;
  secondaryLabel?: string; secondaryHref?: string;
  dark?: boolean;
}) {
  if (!primaryLabel && !secondaryLabel) return null;
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      {primaryLabel && (
        <Link href={primaryHref || '/contact'} className="btn-primary text-center">
          {primaryLabel}
        </Link>
      )}
      {secondaryLabel && (
        <Link
          href={secondaryHref || '/contact'}
          className={dark
            ? 'border border-ivory text-ivory px-8 py-3 font-dm-sans font-medium text-xs tracking-[0.25em] uppercase hover:bg-ivory hover:text-jet transition-colors duration-300 text-center'
            : 'btn-secondary text-center'}
        >
          {secondaryLabel}
        </Link>
      )}
    </div>
  );
}

function HeroSection({ s }: { s: CmsSectionRow }) {
  const p = s.props;
  const bg = txt(p.image);
  const left = txt(p.align) === 'left';
  const text = customText(p);
  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center overflow-hidden bg-jet"
      style={!bg ? customBg(p) : undefined}
    >
      {bg && (
        <>
          <Image src={resolveSiteImage(bg, bg)} alt={txt(p.imageAlt) || txt(p.heading) || 'Banner'} fill className="object-cover" priority={false} sizes="100vw" />
          {p.overlay !== false && <div className="absolute inset-0 bg-jet/55" aria-hidden />}
        </>
      )}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 ${left ? 'text-left' : 'text-center flex flex-col items-center'}`}>
        {txt(p.eyebrow) && (
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-dm-sans mb-5 block">{txt(p.eyebrow)}</span>
        )}
        {txt(p.heading) && (
          <h1 className={`font-cormorant text-5xl md:text-6xl text-ivory leading-tight mb-6 whitespace-pre-line ${left ? '' : 'text-center'} max-w-3xl`} style={text}>
            {txt(p.heading)}
          </h1>
        )}
        {txt(p.subtext) && (
          <p className={`font-dm-sans text-ivory/75 text-body-lg mb-2 max-w-xl ${left ? '' : 'text-center'}`} style={text}>{txt(p.subtext)}</p>
        )}
        <Buttons primaryLabel={txt(p.primaryLabel)} primaryHref={txt(p.primaryHref)} secondaryLabel={txt(p.secondaryLabel)} secondaryHref={txt(p.secondaryHref)} dark />
      </div>
    </section>
  );
}

function TextSection({ s }: { s: CmsSectionRow }) {
  const p = s.props;
  const bg = txt(p.bg) || 'ivory';
  const left = txt(p.align) === 'left';
  const text = customText(p);
  return (
    <section className={`${bgClass(bg)} py-20 lg:py-28`} style={customBg(p)}>
      <div className={`max-w-4xl mx-auto px-6 lg:px-12 ${left ? 'text-left' : 'text-center'}`}>
        {txt(p.eyebrow) && (
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">{txt(p.eyebrow)}</span>
        )}
        {txt(p.heading) && (
          <h2 className={`font-cormorant text-display-md ${headingColor(bg)} mb-6 leading-tight`} style={text}>{txt(p.heading)}</h2>
        )}
        {(txt(p.heading) || txt(p.eyebrow)) && !!txt(p.body) && (
          <div className={`h-px w-12 bg-gold mb-10 ${left ? '' : 'mx-auto'}`} />
        )}
        <div className={`space-y-6 ${bodyColor(bg)} text-body-lg leading-relaxed font-dm-sans ${left ? 'text-left' : 'text-left max-w-3xl mx-auto'}`} style={text}>
          {paragraphs(txt(p.body)).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageTextSection({ s }: { s: CmsSectionRow }) {
  const p = s.props;
  const bg = txt(p.bg) || 'ivory';
  const right = txt(p.align) === 'right';
  const text = customText(p);
  return (
    <section className={`${bgClass(bg)} py-20 lg:py-28 overflow-hidden`} style={customBg(p)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${right ? 'lg:grid-flow-col-dense' : ''}`}>
          <div className={`relative aspect-[4/5] overflow-hidden ${right ? 'lg:col-start-2' : ''}`}>
            {txt(p.image) ? (
              <Image src={resolveSiteImage(txt(p.image), txt(p.image))} alt={txt(p.imageAlt) || txt(p.heading) || 'Image'} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              <div className="absolute inset-0 bg-pearl border border-gold/20" />
            )}
          </div>
          <div className={`flex flex-col justify-center ${right ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            {txt(p.eyebrow) && (
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">{txt(p.eyebrow)}</span>
            )}
            {txt(p.heading) && (
              <h2 className={`font-cormorant text-display-md ${headingColor(bg)} mb-6 leading-tight`} style={text}>{txt(p.heading)}</h2>
            )}
            <div className="h-px w-12 bg-gold mb-8" />
            <div className={`space-y-4 ${bodyColor(bg)} font-dm-sans text-body-lg leading-relaxed mb-8`} style={text}>
              {paragraphs(txt(p.body)).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {txt(p.ctaLabel) && (
              <Link
                href={txt(p.ctaHref) || '/contact'}
                className={`inline-flex items-center gap-2 group ${headingColor(bg)} font-dm-sans text-xs tracking-[0.2em] uppercase`}
              >
                <span className="border-b border-current/0 group-hover:border-current pb-0.5 transition-colors duration-300">
                  {txt(p.ctaLabel)}
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection({ s }: { s: CmsSectionRow }) {
  const p = s.props;
  const images = Array.isArray(p.images) ? p.images.map(String).filter(Boolean) : [];
  if (images.length === 0 && !txt(p.heading) && !txt(p.body)) return null;
  const text = customText(p);
  return (
    <section className="bg-ivory py-20 lg:py-28" style={customBg(p)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {(txt(p.eyebrow) || txt(p.heading)) && (
          <div className="text-center mb-12">
            {txt(p.eyebrow) && (
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">{txt(p.eyebrow)}</span>
            )}
            {txt(p.heading) && (
              <h2 className="font-cormorant text-display-md text-charcoal" style={text}>{txt(p.heading)}</h2>
            )}
            {txt(p.body) && (
              <p className="font-dm-sans text-charcoal-light text-body-lg mt-4 max-w-2xl mx-auto" style={text}>{txt(p.body)}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-pearl border border-gold/10 group">
              <Image
                src={resolveSiteImage(img, img)}
                alt={`${txt(p.heading) || 'Gallery'} ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ s }: { s: CmsSectionRow }) {
  const p = s.props;
  const bg = txt(p.bg) || 'pearl';
  const dark = bg === 'jet';
  const text = customText(p);
  return (
    <section className={`${bgClass(bg)} py-20 lg:py-28`} style={customBg(p)}>
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        {txt(p.heading) && (
          <h2 className={`font-cormorant text-display-md ${headingColor(bg)} mb-6`} style={text}>{txt(p.heading)}</h2>
        )}
        {txt(p.subtext) && (
          <p className={`font-dm-sans ${bodyColor(bg)} text-body-lg`} style={text}>{txt(p.subtext)}</p>
        )}
        <Buttons primaryLabel={txt(p.primaryLabel)} primaryHref={txt(p.primaryHref)} secondaryLabel={txt(p.secondaryLabel)} secondaryHref={txt(p.secondaryHref)} dark={dark} />
      </div>
    </section>
  );
}

function StatsSection({ s }: { s: CmsSectionRow }) {
  const p = s.props;
  const bg = txt(p.bg) || 'ivory';
  const items = Array.isArray(p.items) ? p.items : [];
  const text = customText(p);
  return (
    <section className={`${bgClass(bg)} py-20 lg:py-24 border-y border-gold/10`} style={customBg(p)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {(txt(p.eyebrow) || txt(p.heading)) && (
          <div className="text-center mb-12">
            {txt(p.eyebrow) && (
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">{txt(p.eyebrow)}</span>
            )}
            {txt(p.heading) && (
              <h2 className={`font-cormorant text-display-md ${headingColor(bg)}`} style={text}>{txt(p.heading)}</h2>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {items.map((item, i) => (
            <div key={i}>
              <p className="font-dm-sans font-medium text-4xl lg:text-5xl text-gold mb-2">{String(item.value ?? '')}</p>
              <p className={`text-caption uppercase tracking-wider ${bg === 'jet' ? 'text-ivory/70' : 'text-warm'}`} style={text}>{String(item.label ?? '')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CmsSections({ sections }: { sections: CmsSectionRow[] }) {
  return (
    <>
      {sections.map(s => {
        switch (s.type) {
          case 'hero':       return <HeroSection key={s.id} s={s} />;
          case 'text':       return <TextSection key={s.id} s={s} />;
          case 'image_text': return <ImageTextSection key={s.id} s={s} />;
          case 'gallery':    return <GallerySection key={s.id} s={s} />;
          case 'cta':        return <CtaSection key={s.id} s={s} />;
          case 'stats':      return <StatsSection key={s.id} s={s} />;
          default:           return null;
        }
      })}
    </>
  );
}
