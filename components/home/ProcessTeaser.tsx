'use client';
import ScrollReveal from '../ui/ScrollReveal';
import Link from 'next/link';

/** Home teaser: six high-level steps (full 12-step detail lives on /process). */
const processTeaserSteps = [
  {
    title: 'Design Consultation',
    desc: 'Understanding your vision and conceptualizing.',
  },
  {
    title: 'CAD Modelling',
    desc: '3D modeling and client approval loop.',
  },
  {
    title: 'Casting & Forming',
    desc: 'Lost-wax casting and metal working.',
  },
  {
    title: 'Gemstone Setting',
    desc: 'Precision color matching and setting.',
  },
  {
    title: 'QC',
    desc: 'Strict qualitative adherence checks.',
  },
  {
    title: 'Dispatch',
    desc: 'Secure packing and on-time delivery.',
  },
];

export default function ProcessTeaser() {
  return (
    <section className="bg-pearl py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal className="text-center mb-16 lg:mb-20 flex flex-col items-center">
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
            Our Process
          </span>
          <h2 className="font-cormorant text-display-md text-charcoal mb-6">
            From Concept to Creation
          </h2>
          <div className="h-px w-16 bg-gold animate-scaleX-reveal" />
        </ScrollReveal>

        <div className="relative">
          {/* Horizontal connector through step circles (desktop only) */}
          <div
            className="pointer-events-none absolute left-[6%] right-[6%] top-8 h-px bg-gold/40 hidden lg:block z-0"
            aria-hidden
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-4 xl:gap-6">
            {processTeaserSteps.map((step, idx) => (
              <ScrollReveal
                key={step.title}
                delay={idx * 0.08}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-ivory border-2 border-gold/50 flex items-center justify-center font-cormorant text-2xl text-gold mb-5 shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <h3 className="font-cormorant text-lg xl:text-xl text-charcoal mb-2 leading-snug max-w-56 lg:max-w-none mx-auto">
                  {step.title}
                </h3>
                <p className="text-warm text-sm font-dm-sans leading-relaxed max-w-xs lg:max-w-46 xl:max-w-52 mx-auto">
                  {step.desc}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 lg:mt-20">
          <Link
            href="/process"
            className="group inline-flex items-center text-charcoal font-medium hover:text-gold transition-colors font-dm-sans text-sm tracking-widest uppercase"
          >
            <span className="border-b border-transparent group-hover:border-gold pb-1 transition-colors">
              See Our Full Process
            </span>
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
