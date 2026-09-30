"use client";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "../ui/ScrollReveal";

export default function FactoryBento({
  images,
}: {
  images?: { bento_1: string; bento_2: string; bento_3: string; bento_4: string; bento_6: string };
} = {}) {
  const img = {
    bento_1: images?.bento_1 ?? "/BentoGrid/1.png",
    bento_2: images?.bento_2 ?? "/BentoGrid/2.png",
    bento_3: images?.bento_3 ?? "/BentoGrid/3.png",
    bento_4: images?.bento_4 ?? "/BentoGrid/4.png",
    bento_6: images?.bento_6 ?? "/BentoGrid/6.png",
  };
  return (
    <section className="bg-ivory py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal className="text-center mb-16 flex flex-col items-center">
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
            Inside Our Workshop
          </span>
          <h2 className="font-cormorant text-display-md text-charcoal mb-6">
            150 Craftsmen, One Vision
          </h2>
          <div className="h-px w-16 bg-gold animate-scaleX-reveal" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[200px] md:auto-rows-[280px] gap-4">
          {/* BENTO WIDE */}
          <ScrollReveal
            delay={0.1}
            className="md:col-span-8 row-span-1 group relative overflow-hidden bg-pearl border border-gold/10 hover:border-gold/60 transition-colors"
          >
            <Image
              src={img.bento_1}
              alt="Workshop"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-jet/20 group-hover:bg-transparent transition-colors" />
          </ScrollReveal>

          {/* BENTO SMALL */}
          <ScrollReveal
            delay={0.2}
            className="md:col-span-4 row-span-1 group relative overflow-hidden bg-pearl border border-gold/10 hover:border-gold/60 transition-colors"
          >
            <Image
              src={img.bento_2}
              alt="Tools"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </ScrollReveal>

          {/* BENTO TALL */}
          <ScrollReveal
            delay={0.3}
            className="md:col-span-4 row-span-2 group relative overflow-hidden bg-pearl border border-gold/10 hover:border-gold/60 transition-colors"
          >
            <Image
              src={img.bento_3}
              alt="Crafting"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </ScrollReveal>

          {/* BENTO WIDE */}
          <ScrollReveal
            delay={0.4}
            className="md:col-span-8 row-span-1 group relative overflow-hidden bg-pearl border border-gold/10 hover:border-gold/60 transition-colors"
          >
            <Image
              src={img.bento_4}
              alt="CAD"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </ScrollReveal>

          {/* BENTO SMALL */}
          <ScrollReveal
            delay={0.5}
            className="md:col-span-4 row-span-1 group relative overflow-hidden bg-pearl border border-gold/10 hover:border-gold/60 transition-colors"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gold p-6 text-center">
              <h3 className="font-cormorant text-2xl text-jet mb-2">
                Book a Factory Tour
              </h3>
              <p className="text-jet/80 text-sm mb-4">
                See where the magic happens.
              </p>
              <Link
                href="/contact"
                className="border-b border-jet text-jet pb-1 font-medium hover:text-jet/70 transition-colors font-dm-sans text-xs uppercase tracking-widest"
              >
                Contact Us →
              </Link>
            </div>
          </ScrollReveal>

          {/* BENTO SMALL */}
          <ScrollReveal
            delay={0.6}
            className="md:col-span-4 row-span-1 group relative overflow-hidden bg-pearl border border-gold/10 hover:border-gold/60 transition-colors"
          >
            <Image
              src={img.bento_6}
              alt="Workshop details"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
