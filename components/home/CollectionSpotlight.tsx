'use client';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface CollectionSpotlightProps {
  label: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  align?: 'left' | 'right';
  /** bg-ivory or bg-pearl — alternated by caller */
  bg?: 'ivory' | 'pearl';
}

export default function CollectionSpotlight({
  label,
  title,
  description,
  href,
  image,
  imageAlt,
  align = 'left',
  bg = 'ivory',
}: CollectionSpotlightProps) {
  const bgClass = bg === 'pearl' ? 'bg-pearl' : 'bg-ivory';
  const isRight = align === 'right';

  return (
    <section className={`${bgClass} py-20 lg:py-28 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            isRight ? 'lg:grid-flow-col-dense' : ''
          }`}
        >
          {/* Image */}
          <ScrollReveal
            className={`relative aspect-[4/5] overflow-hidden ${isRight ? 'lg:col-start-2' : ''}`}
            delay={0}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal
            className={`flex flex-col justify-center ${isRight ? 'lg:col-start-1 lg:row-start-1' : ''}`}
            delay={0.1}
          >
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
              {label}
            </span>
            <h2 className="font-cormorant text-display-md text-charcoal mb-6 leading-tight">
              {title}
            </h2>
            <div className="h-px w-12 bg-gold mb-8" />
            <p className="font-dm-sans text-charcoal-light text-body-lg leading-relaxed mb-8">
              {description}
            </p>
            <Link
              href={href}
              className="inline-flex items-center gap-2 group text-charcoal font-dm-sans text-xs tracking-[0.2em] uppercase"
            >
              <span className="border-b border-charcoal/0 group-hover:border-charcoal pb-0.5 transition-colors duration-300">
                Browse Collection
              </span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
