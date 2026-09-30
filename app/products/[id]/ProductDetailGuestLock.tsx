'use client';

import { useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import Link from 'next/link';

export default function ProductDetailGuestLock() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="border border-gold/20 bg-pearl/50 p-6 text-center">
        <div className="w-10 h-10 border border-gold/30 flex items-center justify-center mx-auto mb-3">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gold">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <p className="font-dm-sans text-sm text-charcoal font-medium mb-1">Wholesale Access Required</p>
        <p className="font-dm-sans text-xs text-warm mb-4">Sign in or apply for a wholesale account to add this product to your quotation.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">Sign In</button>
          <Link href="/auth/register" className="btn-secondary text-sm">Apply for Access</Link>
        </div>
      </div>

      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} message="Sign in to add products to your quotation" />
    </div>
  );
}
