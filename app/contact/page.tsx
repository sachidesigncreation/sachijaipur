import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import FloatingQuoteCart from '@/components/layout/FloatingQuoteCart';
import QuoteCartDrawer from '@/components/quote/QuoteCartDrawer';
import ContactPageClient from '@/components/contact/ContactPageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us — Sachi Jaipur',
  description: 'Wholesale inquiries, factory tours and custom orders — Sachi Jaipur.',
};

export default function ContactPage() {
  return (
    <div className="bg-ivory min-h-screen pt-20">
      <Navbar />

      <div className="bg-jet py-32 text-center border-b border-gold/10">
        <h1 className="font-cormorant text-display-md lg:text-display-lg text-ivory mb-4">Contact Us</h1>
        <p className="font-dm-sans text-warm text-body-lg tracking-widest uppercase">
          Wholesale Inquiries · Factory Tours · Custom Orders
        </p>
      </div>

      <ContactPageClient />

      <Footer />
      <FloatingWhatsApp />
      <FloatingQuoteCart />
      <QuoteCartDrawer />
    </div>
  );
}
