'use client';
import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Props {
  products: Product[];
}

export default function BestsellersCarouselClient({ products }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = { x: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const el = trackRef.current;
      if (!el) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - dragStart.current.x) * 1.2;
      el.scrollLeft = dragStart.current.scrollLeft - walk;
    },
    [isDragging]
  );

  const stopDrag = useCallback(() => setIsDragging(false), []);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="bg-pearl py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-3 block">
              Handpicked Favourites
            </span>
            <h2 className="font-cormorant text-display-md text-charcoal">Bestsellers</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="w-10 h-10 flex items-center justify-center border border-gold/40 text-charcoal hover:border-gold hover:text-gold transition-colors duration-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="w-10 h-10 flex items-center justify-center border border-gold/40 text-charcoal hover:border-gold hover:text-gold transition-colors duration-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </ScrollReveal>

        {/* Draggable scroll track */}
        <div
          ref={trackRef}
          className={`flex gap-4 overflow-x-auto pb-4 select-none scroll-smooth
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
              style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/products" className="btn-secondary">
            Browse All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
