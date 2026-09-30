'use client';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

const DEFAULTS = {
  eyebrow: 'Our Heritage',
  heading: 'The Art of Fine Jewellery Manufacturing',
  paras: [
    'Jaipur has long been the heartbeat of India\u2019s fine jewellery tradition — a city where craftsmanship is passed down through generations and every piece carries the weight of centuries of artisanal mastery. Sachi Jaipur was built upon this legacy, combining timeless techniques with modern manufacturing standards that meet the demands of global markets.',
    'We specialise in large-scale production of gold, silver, and brass jewellery with colour gemstone settings — serving international wholesalers, private-label brands, and boutique retailers across eight global markets. Our in-house CAD design team, precision casting facilities, and 150 skilled craftsmen work under one roof to deliver consistency at every tier of volume.',
    'Operating from the Sitapura Industrial Area in Jaipur, we are positioned to offer fully compliant services with competitive lead times. Whether you need OEM manufacturing from your design files or a custom ODM collection built from scratch, Sachi is your end-to-end fine jewellery partner.',
  ],
};

export default function BrandStorySection({
  eyebrow = DEFAULTS.eyebrow,
  heading = DEFAULTS.heading,
  paras = DEFAULTS.paras,
}: {
  eyebrow?: string;
  heading?: string;
  paras?: string[];
} = {}) {
  return (
    <section className="bg-pearl py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <ScrollReveal>
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
            {eyebrow}
          </span>
          <h2 className="font-cormorant text-display-md text-charcoal mb-8 leading-tight">
            {heading}
          </h2>
          <div className="h-px w-12 bg-gold mx-auto mb-10" />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-6 text-charcoal-light text-body-lg leading-relaxed font-dm-sans text-left max-w-3xl mx-auto">
            {paras.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="btn-primary">
              Our Story
            </Link>
            <Link href="/contact" className="btn-secondary">
              Start a Partnership
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
