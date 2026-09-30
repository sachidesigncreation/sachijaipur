'use client';

import { useQuoteCart } from '@/store/quoteCart';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MetalPrices } from '@/types';
import { calculateQuoteTotal, getItemBreakdown } from '@/lib/quotation';
import { currencyContext, formatMoney } from '@/lib/currency';
import { normalizeR2Image } from '@/lib/r2/config';

export default function QuoteCartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useQuoteCart();
  const [mounted, setMounted] = useState(false);
  const [metalPrices, setMetalPrices] = useState<MetalPrices | null>(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Sachi Jaipur',
    address: 'Sitapura Industrial Area, Jaipur, Rajasthan 302022, India',
    email: 'contact@sachijewellery.com',
    phone: '+91 89469 31404',
    gst: '08ACSFS4747G1ZI',
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/metal-prices')
        .then(r => r.json())
        .then(data => setMetalPrices(data))
        .catch(console.error);
      fetch('/api/site-settings')
        .then(r => r.json())
        .then(d => {
          if (d?.company) {
            setCompanyInfo(c => ({
              name: 'Sachi Jaipur',
              address: d.company.address || c.address,
              email: d.company.email || c.email,
              phone: d.company.phone || c.phone,
              gst: d.company.gst || c.gst,
            }));
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!mounted) return null;

  const totalINR = metalPrices ? calculateQuoteTotal(items, metalPrices) : 0;
  const currency = currencyContext(metalPrices);
  const fmt      = (n: number) => formatMoney(n, currency);

  const handleDownloadPDF = async () => {
    if (!metalPrices || items.length === 0) return;
    const { generateQuotePDF } = await import('@/lib/generateQuotePDF');
    generateQuotePDF(
      items,
      metalPrices,
      {
        name: process.env.NEXT_PUBLIC_COMPANY_NAME || companyInfo.name,
        address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || companyInfo.address,
        email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || companyInfo.email,
        phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || companyInfo.phone,
        gst: process.env.NEXT_PUBLIC_COMPANY_GST || companyInfo.gst,
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-jet/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ivory shadow-2xl z-50 flex flex-col border-l border-gold/30"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 bg-jet border-b border-gold/20">
              <div>
                <h2 className="font-dm-sans text-sm font-semibold text-ivory uppercase tracking-widest">
                  Quotation Cart
                </h2>
                {items.length > 0 && (
                  <p className="text-warm text-xs mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                )}
              </div>
              <button onClick={closeCart} className="text-warm hover:text-ivory transition-colors">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="text-center text-warm mt-10 font-dm-sans">
                  <p>Your quotation cart is empty.</p>
                  <button onClick={closeCart} className="mt-4 btn-primary">Browse Catalogue</button>
                </div>
              ) : (
                items.map((item) => {
                  const breakdown = metalPrices ? getItemBreakdown(item, metalPrices) : null;
                  const itemINR   = breakdown ? breakdown.P * item.quantity : null;
                  const imgSrc    = normalizeR2Image(item.product.images?.[0]) ?? '/image.png';

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedKarat}-${item.selectedStone}`}
                      className="flex gap-4 border-b border-black/5 pb-6"
                    >
                      <div className="relative w-20 h-20 bg-pearl border border-gold/10 shrink-0 overflow-hidden">
                        <Image src={imgSrc} alt={item.product.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-dm-sans text-sm font-medium text-charcoal leading-tight">
                              {item.product.name}
                            </h3>
                            <p className="text-xs text-warm mt-0.5 uppercase tracking-wider">
                              {item.selectedMetal} · {item.selectedKarat}
                              {item.selectedStone && item.selectedStone !== 'None'
                                ? ` · ${item.product.gemstoneCount ?? 1}× ${item.selectedStone}`
                                : ''}
                              {item.selectedSecondaryStone && item.selectedSecondaryStone !== 'None'
                                ? ` · ${item.secondaryGemstoneCount ?? 1}× ${item.selectedSecondaryStone}`
                                : ''}
                            </p>
                            {item.product.weightGrams && (
                              <p className="text-xs text-warm mt-0.5">{item.product.weightGrams}g</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-warm hover:text-red-500 transition-colors shrink-0"
                          >
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Mini cost breakdown */}
                        {breakdown && (
                          <div className="mt-1 text-[10px] text-warm/70 font-dm-sans">
                            <span>Metal: {fmt(breakdown.metalCost)}</span>
                            {breakdown.stoneCost1  > 0 && <span> · Stone 1: {fmt(breakdown.stoneCost1)}</span>}
                            {breakdown.stoneCost2  > 0 && <span> · Stone 2: {fmt(breakdown.stoneCost2)}</span>}
                            {breakdown.labourCost  > 0 && <span> · Labour: {fmt(breakdown.labourCost)}</span>}
                            {breakdown.platingCost > 0 && <span> · Plating: {fmt(breakdown.platingCost)}</span>}
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-3">
                          {/* Qty stepper */}
                          <div className="flex items-center border border-gold/30">
                            <button
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-gold/10 text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-dm-sans text-sm text-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-gold/10 text-sm"
                            >
                              +
                            </button>
                          </div>

                          {/* Price — rendered in the site display currency */}
                          {itemINR !== null ? (
                            <p className="font-dm-sans text-sm font-medium text-charcoal">
                              {fmt(itemINR)}
                            </p>
                          ) : (
                            <span className="text-xs text-warm italic">Loading price…</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="bg-pearl p-6 border-t border-gold/20">
                {metalPrices && (
                  <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-gold/10">
                    <span className="font-dm-sans text-xs uppercase tracking-widest text-warm">
                      Estimated Total
                    </span>
                    <div className="text-right">
                      <p className="font-cormorant text-2xl text-charcoal font-medium">
                        {fmt(totalINR)}
                      </p>
                      <p className="text-[10px] text-warm/60 mt-0.5">
                        P = w·m·{metalPrices.settings?.wastageFactor ?? 1.07} + N1·(s1+st1) + N2·(s2+st2) + L·w
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={!metalPrices}
                    className="w-full btn-secondary flex justify-center items-center gap-2 disabled:opacity-40"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Quote PDF
                  </button>
                  <Link
                    href="/contact#quote"
                    onClick={closeCart}
                    className="w-full btn-primary text-center"
                  >
                    Request Formal Quotation
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs text-warm uppercase tracking-widest hover:text-charcoal transition-colors w-full text-center mt-1"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
