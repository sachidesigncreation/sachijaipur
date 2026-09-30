'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

const defaultSlides = [
  {
    id: 1,
    image: '/HomePageImage.webp',
    label: 'Gold Collections',
    heading: 'Crafted in Jaipur.\nTrusted Worldwide.',
    subtext: 'Fine gold jewellery manufacturing and wholesale.',
    primaryCta: { label: 'Explore Gold', href: '/products' },
    secondaryCta: { label: 'Request a Quote', href: '/contact#quote' },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
    label: 'Silver Collections',
    heading: 'Sterling\nCraftsmanship.',
    subtext: '925 Sterling Silver jewellery with precision stone setting.',
    primaryCta: { label: 'Explore Silver', href: '/products' },
    secondaryCta: { label: 'Request a Quote', href: '/contact#quote' },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80',
    label: 'Gemstone Collections',
    heading: 'Colour\nat Its Finest.',
    subtext: 'Expertly sourced colour gemstones set in gold, silver & brass.',
    primaryCta: { label: 'Browse Gemstones', href: '/products' },
    secondaryCta: { label: 'Request a Quote', href: '/contact#quote' },
  },
  {
    id: 4,
    image: '/HomePageAbout.webp',
    label: 'OEM / ODM Manufacturing',
    heading: 'Your Vision,\nOur Craftsmanship.',
    subtext: '150 skilled craftsmen. End-to-end production from your design.',
    primaryCta: { label: 'Our Process', href: '/process' },
    secondaryCta: { label: 'Contact Us', href: '/contact' },
  },
];

export type HeroSlide = (typeof defaultSlides)[number];

export default function HeroCarousel({ slides = defaultSlides }: { slides?: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        {slides.map((slide, i) =>
          i === current ? (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src={slide.image}
                alt={slide.label}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-jet/55" />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${current}`}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-dm-sans mb-5 block">
            {slides[current].label}
          </span>
          <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl text-ivory leading-tight mb-6 whitespace-pre-line">
            {slides[current].heading}
          </h1>
          <p className="font-dm-sans text-ivory/75 text-body-lg mb-10 max-w-md">
            {slides[current].subtext}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={slides[current].primaryCta.href} className="btn-primary">
              {slides[current].primaryCta.label}
            </Link>
            <Link
              href={slides[current].secondaryCta.href}
              className="border border-ivory text-ivory px-8 py-3 font-dm-sans font-medium text-xs tracking-[0.25em] uppercase hover:bg-ivory hover:text-jet transition-colors duration-300"
            >
              {slides[current].secondaryCta.label}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center border border-ivory/40 text-ivory hover:border-gold hover:text-gold transition-colors duration-300"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center border border-ivory/40 text-ivory hover:border-gold hover:text-gold transition-colors duration-300"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-1.5 bg-gold'
                : 'w-1.5 h-1.5 bg-ivory/50 hover:bg-ivory/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
