'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import LoginModal from '@/components/auth/LoginModal';

const METALS     = ['All', 'Gold', 'Silver', 'Brass'];
const CATEGORIES = ['All', 'Rings', 'Earrings', 'Pendants', 'Bracelets', 'Bangles', 'Necklaces'];

interface Props {
  products:   Product[];
  isApproved: boolean;
  isGuest:    boolean;
}

export default function ProductsClientPage({ products, isApproved }: Props) {
  const [activeMetal,    setActiveMetal]    = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showLogin, setShowLogin] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const openGate = (msg: string) => {
    setLoginMessage(msg);
    setShowLogin(true);
  };

  const filtered = useMemo(() => {
    if (!isApproved) return products; // guests see all fetched featured products unfiltered
    return products.filter(p => {
      const metalMatch = activeMetal === 'All' || p.baseMetal === activeMetal.toLowerCase();
      const catMatch   = activeCategory === 'All' || p.category === activeCategory.toLowerCase();
      return metalMatch && catMatch;
    });
  }, [products, activeMetal, activeCategory, isApproved]);

  return (
    <>
      {/* Masthead */}
      <div className="bg-jet py-32 text-center border-b border-gold/10">
        <h1 className="font-cormorant text-display-md lg:text-display-lg text-ivory mb-4">Our Collections</h1>
        <p className="font-dm-sans text-warm text-body-lg tracking-widest uppercase">
          Gold · Silver · Brass · Gemstones
        </p>
        {!isApproved && (
          <p className="font-dm-sans text-warm/60 text-xs tracking-widest mt-4">
            Showing {products.length} featured pieces ·{' '}
            <button
              onClick={() => openGate('Sign in to view the full catalogue')}
              className="underline text-gold hover:text-gold-light transition-colors"
            >
              Sign in for full access
            </button>
          </p>
        )}
      </div>

      {/* Filters (Sticky) */}
      <div className={`sticky top-[80px] lg:top-[90px] z-30 bg-ivory/95 backdrop-blur-md border-b border-gold/10 py-6 mb-12 ${!isApproved ? 'opacity-50 pointer-events-none select-none' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-6 justify-between items-center">
          {!isApproved && (
            <button
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={() => openGate('Sign in to use filters and search the full catalogue')}
              aria-label="Sign in to use filters"
            />
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            {METALS.map(metal => (
              <button
                key={metal}
                onClick={() => isApproved && setActiveMetal(metal)}
                className={`px-4 py-1.5 md:py-2 text-xs md:text-sm uppercase tracking-widest font-dm-sans rounded-full transition-all duration-200 ${
                  activeMetal === metal
                    ? 'bg-gold text-jet border border-gold'
                    : 'border border-gold/30 text-charcoal-light hover:border-gold'
                }`}
              >
                {metal}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => isApproved && setActiveCategory(cat)}
                className={`px-4 py-1.5 md:py-2 text-xs md:text-sm uppercase tracking-widest font-dm-sans rounded-full transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-charcoal text-ivory border border-charcoal'
                    : 'border border-black/10 text-charcoal-light hover:border-black/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pb-32 min-h-[50vh] relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  isGuest={!isApproved}
                  onGuestAction={() => openGate('Sign in to add products to your quotation')}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-warm font-dm-sans text-lg">
            No products match the selected filters.
          </div>
        )}

        {/* Guest CTA banner */}
        {!isApproved && (
          <div className="mt-16 bg-jet text-ivory text-center py-12 px-6">
            <p className="font-cormorant text-2xl mb-2">Viewing {products.length} of our featured pieces</p>
            <p className="font-dm-sans text-warm text-sm mb-6">Sign in or register for a wholesale account to browse the complete catalogue.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => openGate('Sign in for full catalogue access')} className="btn-primary">Sign In</button>
              <Link href="/auth/register" className="btn-secondary">Apply for Wholesale Access</Link>
            </div>
          </div>
        )}
      </main>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} message={loginMessage} />
    </>
  );
}
