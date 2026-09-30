import Link from 'next/link';
import AccountSignOut from '@/components/auth/AccountSignOut';

export const metadata = { title: 'Account Pending — Sachi Jaipur' };

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 border-2 border-gold/40 flex items-center justify-center mx-auto mb-6">
          <span className="text-gold/60 text-2xl">⏳</span>
        </div>
        <h1 className="font-cormorant text-3xl text-charcoal mb-3">Account Under Review</h1>
        <p className="font-dm-sans text-warm text-sm leading-relaxed mb-8">
          Your wholesale account application is currently being reviewed by our team.
          You will receive an email notification once your account is approved.
          This typically takes 1–2 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/" className="btn-secondary">Return to Homepage</Link>
          <Link href="/contact" className="btn-primary">Contact Us</Link>
        </div>
        <p className="text-warm text-xs font-dm-sans mt-6">
          <AccountSignOut />
        </p>
        <p className="text-warm text-xs font-dm-sans mt-8">
          Questions? Email us at{' '}
          <a href="mailto:contact@sachijewellery.com" className="text-charcoal underline">contact@sachijewellery.com</a>
        </p>
      </div>
    </div>
  );
}
