'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useQuoteCart } from '@/store/quoteCart';
import { useEffect, useState } from 'react';

export default function FloatingQuoteCart() {
  const { items, openCart } = useQuoteCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted || items.length === 0) return null;

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      <motion.button
        className="fixed bottom-6 right-6 z-30 w-16 h-16 bg-jet border border-gold rounded-full flex flex-col items-center justify-center text-gold shadow-lg hover:bg-jet/90 transition-colors"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        onClick={openCart}
        aria-label="Open Quote Cart"
      >
        <span className="absolute -top-2 -right-2 bg-gold text-jet w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-ivory">
          {totalItems}
        </span>
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <span className="text-[10px] mt-0.5 font-dm-sans tracking-wider uppercase">Quote</span>
      </motion.button>
    </AnimatePresence>
  );
}
