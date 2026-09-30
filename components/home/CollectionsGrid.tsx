'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

const defaultCollections = [
  {
    label: 'Gold Jewellery',
    image: '/BentoGrid/1.png',
    href: '/products',
    description: 'Rings, earrings, pendants & more in 14K, 18K & 22K gold.',
  },
  {
    label: 'Silver Jewellery',
    image: '/BentoGrid/2.png',
    href: '/products',
    description: '925 sterling silver with colour gemstone settings.',
  },
  {
    label: 'Brass Jewellery',
    image: '/BentoGrid/3.png',
    href: '/products',
    description: 'Bold, fashion-forward brass pieces with stone inlays.',
  },
  {
    label: 'Gemstone Collections',
    image: '/BentoGrid/4.png',
    href: '/products',
    description: 'Colour gemstones across sapphire, emerald, moonstone & more.',
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], delay: i * 0.1 },
  }),
};

export type CollectionCard = {
  label: string;
  image: string;
  href: string;
  description: string;
};

export default function CollectionsGrid({ collections = defaultCollections }: { collections?: CollectionCard[] }) {
  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
            Browse by Category
          </span>
          <h2 className="font-cormorant text-display-md text-charcoal">
            Collections
          </h2>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col.label}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="group relative overflow-hidden aspect-[4/3] bg-charcoal"
            >
              <Image
                src={col.image}
                alt={col.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-jet/80 via-jet/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <h3 className="font-cormorant text-2xl lg:text-3xl text-ivory mb-1">
                  {col.label}
                </h3>
                <p className="font-dm-sans text-ivory/70 text-caption mb-4 hidden sm:block">
                  {col.description}
                </p>
                <Link
                  href={col.href}
                  className="inline-flex items-center text-gold font-dm-sans text-xs tracking-[0.2em] uppercase group/link"
                >
                  <span className="border-b border-gold/0 group-hover/link:border-gold pb-0.5 transition-colors duration-300">
                    Browse
                  </span>
                  <span className="ml-2 group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
