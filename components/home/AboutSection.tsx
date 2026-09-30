'use client';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '../ui/ScrollReveal';
import { useInView, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const springValue = useSpring(0, { bounce: 0, duration: 2000 });

  useEffect(() => {
    if (isInView) springValue.set(to);
  }, [isInView, springValue, to]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toString() + (to === 150 || to === 8 ? '+' : '');
      }
    });
  }, [springValue, to]);

  return <span ref={ref} className="font-dm-sans font-medium text-5xl text-gold mb-2 block" />;
}

export default function AboutSection({ image = "/HomePageAbout.webp" }: { image?: string }) {
  return (
    <section id="about" className="bg-ivory py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-20 items-center">
        {/* Left: Layered Image Frame */}
        <ScrollReveal className="relative lg:ml-8 lg:mt-8 order-2 lg:order-1 mt-10">
          <div className="absolute inset-0 lg:-ml-8 lg:-mt-8 -ml-4 -mt-4 border border-gold/30 z-0" />
          <div className="relative aspect-[4/5] w-full z-10 w-full overflow-hidden">
            <Image
              src={image}
              alt="Sachi Jaipur craftsmen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </ScrollReveal>

        {/* Right: Content */}
        <div className="order-1 lg:order-2">
          <ScrollReveal>
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
              About Sachi Jaipur
            </span>
            <h2 className="font-cormorant text-display-md text-charcoal mb-8">
              Where Craft Meets Global Standards
            </h2>
            <div className="space-y-6 text-charcoal-light text-body-lg mb-12">
              <p>
                Sachi Jaipur is a Jaipur-based manufacturer specializing in large-scale production and global supply of precious and semi-precious jewellery. We serve global wholesalers, retailers, and brands with consistent quality and reliable delivery.
              </p>
              <p>
                With in-house design, CAD expertise, and skilled craftsmanship, we deliver precision-driven, market-ready collections. Our focus is on scalability, quality control, and long-term business partnerships across global markets.
              </p>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-8 mb-12 border-t border-gold/20 pt-8">
              <div>
                <Counter to={150} />
                <span className="text-caption text-warm uppercase tracking-wider block mt-2">Skilled<br/>Craftsmen</span>
              </div>
              <div>
                <Counter to={8} />
                <span className="text-caption text-warm uppercase tracking-wider block mt-2">Global<br/>Markets</span>
              </div>
              <div>
                <Counter to={4} />
                <span className="text-caption text-warm uppercase tracking-wider block mt-2">Metal<br/>Specialisations</span>
              </div>
            </div>

            <Link href="/about" className="group inline-flex items-center text-charcoal font-medium hover:text-gold transition-colors font-dm-sans text-sm tracking-widest uppercase">
              <span className="border-b border-transparent group-hover:border-gold pb-1 transition-colors">Learn More About Our Story</span>
              <span className="ml-2">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
