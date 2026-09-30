'use client';
import ScrollReveal from '../ui/ScrollReveal';

export default function WhatWeDoSection() {
  const cards = [
    { title: 'High-Precision Manufacturing', desc: 'Advanced manufacturing with skilled craftsmanship ensuring precision and consistent global quality.', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { title: 'OEM / ODM Expertise', desc: 'Trusted Jaipur-based partner offering complete OEM/ODM solutions across Gold, Silver, and Brass jewellery.', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
    { title: 'Color Gemstone Specialization', desc: 'Deep expertise in sourcing, matching, and setting gemstones with consistent color, clarity, and finish.', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Global B2B Partnerships', desc: 'Working with international brands, wholesalers, and bulk buyers to deliver reliable, production-ready solutions.', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' },
    { title: 'End-to-End Development', desc: 'From concept to final production, delivering trend-driven and fully customized jewellery with accuracy.', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
    { title: 'Scalable & Consistent Production', desc: 'Handling small batches to high volumes with strict quality control, ensuring durability and premium finishing.', icon: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z' }
  ];

  return (
    <section id="what-we-do" className="bg-pearl py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal className="text-center mb-20 flex flex-col items-center">
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
            End-to-End Fine Jewellery
          </span>
          <h2 className="font-cormorant text-display-md text-charcoal mb-6">
            Manufacturing
          </h2>
          <div className="h-px w-16 bg-gold animate-scaleX-reveal" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="bg-ivory border border-gold/20 p-8 group hover:border-gold transition-colors duration-300 h-full">
                <div className="w-10 h-10 text-gold mb-6 group-hover:scale-110 transition-transform">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
                <h3 className="font-dm-sans text-sm font-semibold text-charcoal mb-3 uppercase tracking-[0.15em]">{card.title}</h3>
                <p className="text-body text-warm leading-relaxed">{card.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
