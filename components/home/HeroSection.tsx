"use client";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

export default function HeroSection() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row pt-20 lg:pt-0">
      {/* Left: Full-width Background Image on Mobile, Half-width on Desktop */}
      <div className="relative w-full lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 h-[50vh] lg:h-full overflow-hidden">
        <Image
          src="/HomePageImage.webp"
          alt="Sachi Jaipur — Fine Craftsmanship"
          fill
          className="object-cover animate-kenburns"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-jet/10 lg:bg-jet/0" />
      </div>

      {/* Right: Solid Gold Content Block */}
      <div className="relative z-10 w-full lg:w-1/2 lg:ml-auto min-h-[50vh] lg:min-h-screen bg-[#c2964b] px-8 py-20 lg:pt-32 xl:px-24 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto lg:mx-0 w-full"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-row items-center justify-center lg:justify-start gap-4 mb-8 text-jet text-xs tracking-[0.2em] uppercase font-dm-sans font-medium opacity-90 z-20 flex-wrap"
          >
            <span className="inline-block px-5 py-1.5 tracking-[0.25em] border border-jet/40 text-jet rounded-full shadow-sm bg-transparent hover:bg-jet hover:text-[#c2964b] transition-colors cursor-default font-semibold opacity-100 whitespace-nowrap">
              Since 1975
            </span>
            <span className="whitespace-nowrap">
              Jaipur, India &mdash; Est. in Craftsmanship
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-cormorant text-5xl lg:text-[4rem] xl:text-[4.75rem] lg:leading-[1.1] text-jet mb-8 text-center lg:text-left tracking-[0] xl:tracking-tight mt-6"
          >
            Crafted in Jaipur.
            <br />
            Trusted
            <br />
            Worldwide.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-dm-sans text-jet/80 text-body lg:text-lg mb-14 max-w-md mx-auto lg:mx-0 text-center lg:text-left font-light leading-relaxed"
          >
            Fine jewellery manufacturing and wholesale. Gold &middot;
            Silver &middot; Brass &middot; Gemstones.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
          >
            <Link
              href="/products"
              className="bg-jet text-[#c2964b] px-10 py-4 text-center font-dm-sans font-medium text-xs tracking-[0.25em] uppercase hover:bg-jet/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Explore Collections
            </Link>
            <Link
              href="/contact#quote"
              className="border border-jet text-jet px-10 py-4 text-center font-dm-sans font-medium text-xs tracking-[0.2em] uppercase hover:bg-jet hover:text-[#c2964b] transition-colors"
            >
              Request a Quote
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
