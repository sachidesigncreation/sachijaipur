'use client';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useEffect } from 'react';
import { Certificate } from '@/types';

interface LightboxProps {
  cert: Certificate | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ cert, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    if (cert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [cert, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-jet/95 backdrop-blur-sm flex items-center justify-center"
        >
          {/* Close Area overlay */}
          <div className="absolute inset-0 z-0" onClick={onClose} />

          {/* Image Container */}
          <div className="relative z-10 w-full max-w-4xl px-4 aspect-[4/3] max-h-[80vh] flex items-center justify-center">
            <motion.div
              key={cert.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full h-full bg-ivory p-4 shadow-2xl"
            >
              <Image src={cert.fullImage} alt={cert.name} fill className="object-contain" sizes="100vw" priority />
            </motion.div>
          </div>

          {/* Interface Overlay */}
          <div className="absolute top-6 right-6 z-20">
            <button onClick={onClose} className="text-ivory/60 hover:text-ivory transition-colors">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="absolute top-1/2 left-6 z-20 -translate-y-1/2">
            <button onClick={onPrev} className="text-ivory/60 hover:text-gold transition-colors">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
          </div>

          <div className="absolute top-1/2 right-6 z-20 -translate-y-1/2">
            <button onClick={onNext} className="text-ivory/60 hover:text-gold transition-colors">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center z-20 pointer-events-none">
            <h3 className="font-cormorant text-2xl text-ivory">{cert.name}</h3>
            <p className="text-warm text-sm mt-1 uppercase tracking-widest">{cert.issuingBody}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
