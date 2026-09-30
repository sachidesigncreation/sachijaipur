'use client';
import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/ui/Lightbox';
import { Certificate } from '@/types';

const certificates: Certificate[] = [
  { id: 'bis', name: 'BIS Hallmark Certification', issuingBody: 'Bureau of Indian Standards', thumbnail: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=600', fullImage: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=100&w=1200' },
  { id: 'iso', name: 'ISO 9001:2015', issuingBody: 'International Organization for Standardization', thumbnail: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=600', fullImage: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=100&w=1200' },
  { id: 'gst', name: 'GST Registration', issuingBody: 'Government of India', thumbnail: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=600', fullImage: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=100&w=1200' },
  { id: 'msme', name: 'MSME Registration', issuingBody: 'Ministry of MSME', thumbnail: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=600', fullImage: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=100&w=1200' },
];

export default function CertificatesGrid() {
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  const handleNext = () => {
    if (!activeCert) return;
    const idx = certificates.findIndex(c => c.id === activeCert.id);
    setActiveCert(certificates[(idx + 1) % certificates.length]);
  };

  const handlePrev = () => {
    if (!activeCert) return;
    const idx = certificates.findIndex(c => c.id === activeCert.id);
    setActiveCert(certificates[(idx - 1 + certificates.length) % certificates.length]);
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-32 min-h-[50vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-pearl border border-gold/20 p-6 group cursor-pointer hover:border-gold transition-colors"
              onClick={() => setActiveCert(cert)}
            >
              <div className="aspect-[4/3] bg-ivory border border-gold/10 mb-4 relative overflow-hidden">
                <Image src={cert.thumbnail} alt={cert.name} fill className="object-cover p-4 group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="font-cormorant text-heading text-charcoal">{cert.name}</h3>
              <p className="text-caption text-warm mt-1 uppercase tracking-widest">{cert.issuingBody}</p>
            </div>
          ))}
        </div>
      </main>
      <Lightbox cert={activeCert} onClose={() => setActiveCert(null)} onNext={handleNext} onPrev={handlePrev} />
    </>
  );
}
