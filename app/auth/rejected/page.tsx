import Link from 'next/link';
import AccountSignOut from '@/components/auth/AccountSignOut';

export const metadata = { title: 'Application Not Approved — Sachi Jaipur' };

export default function RejectedPage() {
  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-cormorant text-3xl text-charcoal mb-3">Application Not Approved</h1>
        <p className="font-dm-sans text-warm text-sm leading-relaxed mb-8">
          We were unable to approve your wholesale account application. If you think this is a mistake,
          please contact us using the details below.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
          <AccountSignOut />
        </div>
        <p className="text-warm text-xs font-dm-sans">
          <a href="mailto:contact@sachijewellery.com" className="text-charcoal underline">
            contact@sachijewellery.com
          </a>
        </p>
      </div>
    </div>
  );
}
