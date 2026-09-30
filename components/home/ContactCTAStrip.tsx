'use client';
import Link from 'next/link';
import ScrollReveal from '../ui/ScrollReveal';

export default function ContactCTAStrip() {
  return (
    <section className="bg-gold py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal>
          <h2 className="font-cormorant text-display-md text-jet mb-4">
            Ready to Start Your Next Collection?
          </h2>
          <p className="text-jet/80 text-body-lg mb-8 max-w-md font-dm-sans">
            Contact our dedicated team to discuss your manufacturing needs, request a sample, or get a quotation for bulk orders.
          </p>
          <Link href="/contact" className="inline-block bg-jet text-gold px-8 py-4 font-dm-sans font-medium text-xs tracking-widest uppercase hover:bg-jet/90 transition-colors">
            Contact Us Today
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="bg-ivory p-8">
          <h3 className="font-cormorant text-2xl text-charcoal mb-6">Quick Inquiry</h3>
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); /* Connect to contact API in future step */ }}>
            <input type="text" placeholder="Name" className="w-full bg-pearl border border-gold/30 px-4 py-3 placeholder:text-warm focus:outline-none focus:border-gold" />
            <input type="email" placeholder="Email" className="w-full bg-pearl border border-gold/30 px-4 py-3 placeholder:text-warm focus:outline-none focus:border-gold" />
            <textarea placeholder="Message" rows={3} className="w-full bg-pearl border border-gold/30 px-4 py-3 placeholder:text-warm focus:outline-none focus:border-gold resize-none" />
            <button type="submit" className="w-full bg-charcoal text-ivory py-3 font-dm-sans text-xs uppercase tracking-widest hover:bg-jet transition-colors">
              Send Message
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
