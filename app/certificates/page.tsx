import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import FloatingQuoteCart from '@/components/layout/FloatingQuoteCart';
import QuoteCartDrawer from '@/components/quote/QuoteCartDrawer';
import CertificatesGrid from '@/components/certificates/CertificatesGrid';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quality Certifications — Sachi Jaipur',
  description: 'Commitment to excellence and compliance — Sachi Jaipur.',
};

export default function CertificatesPage() {
  return (
    <div className="bg-ivory min-h-screen pt-20">
      <Navbar />

      <div className="bg-jet py-32 text-center border-b border-gold/10">
        <h1 className="font-cormorant text-display-md lg:text-display-lg text-ivory mb-4">Quality Certifications</h1>
        <p className="font-dm-sans text-warm text-body-lg tracking-widest uppercase">
          Commitment to Excellence & Compliance
        </p>
      </div>

      <CertificatesGrid />

      <Footer />
      <FloatingWhatsApp />
      <FloatingQuoteCart />
      <QuoteCartDrawer />
    </div>
  );
}
