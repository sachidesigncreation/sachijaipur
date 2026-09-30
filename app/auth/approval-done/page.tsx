import Link from 'next/link';

type Outcome = 'approved' | 'rejected' | 'already-approved' | 'invalid';

export default async function ApprovalDonePage({
  searchParams,
}: {
  searchParams: Promise<{ outcome?: string; company?: string }>;
}) {
  const sp = await searchParams;
  const outcome = (sp.outcome ?? '') as Outcome;
  const company = sp.company ? decodeURIComponent(sp.company) : '';

  const titles: Record<string, string> = {
    approved: 'Account approved',
    rejected: 'Application updated',
    'already-approved': 'Already approved',
    invalid: 'Link invalid',
  };

  const bodies: Record<string, string> = {
    approved:
      company
        ? `Wholesale access for “${company}” is now active. The applicant has been notified by email.`
        : 'The wholesale account has been approved. The applicant has been notified by email.',
    rejected:
      company
        ? `The application for “${company}” has been marked as not approved. The applicant has been notified by email.`
        : 'The application has been updated. The applicant has been notified by email.',
    'already-approved': 'This application was already approved earlier.',
    invalid: 'This link is invalid or has already been used.',
  };

  const title = titles[outcome] ?? 'Done';
  const body = bodies[outcome] ?? 'You can close this page.';

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6 pt-24 pb-16">
      <div className="max-w-md w-full border border-gold/20 bg-pearl p-10 text-center">
        <h1 className="font-cormorant text-2xl text-charcoal mb-4">{title}</h1>
        <p className="font-dm-sans text-sm text-charcoal-light leading-relaxed mb-8">{body}</p>
        <Link
          href="/"
          className="inline-block text-xs uppercase tracking-widest text-gold border-b border-gold pb-1 hover:text-charcoal transition-colors"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
