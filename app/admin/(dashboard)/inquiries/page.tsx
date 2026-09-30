import { prisma } from '@/lib/db';
import InquiryStatusButton from '@/components/admin/InquiryStatusButton';

export const metadata = { title: 'Inquiries — Admin' };

const STATUS_COLORS: Record<string, string> = {
  NEW:     'text-blue-600 bg-blue-50 border-blue-200',
  VIEWED:  'text-yellow-700 bg-yellow-50 border-yellow-200',
  HANDLED: 'text-green-600 bg-green-50 border-green-200',
};

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1 className="font-cormorant text-3xl text-charcoal mb-2">Inquiries</h1>
      <p className="text-warm text-sm font-dm-sans mb-8">{inquiries.length} total</p>

      <div className="space-y-4">
        {inquiries.map(inq => (
          <div key={inq.id} className="bg-ivory border border-black/10 rounded p-5">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 border rounded-full font-medium uppercase tracking-wider font-dm-sans ${STATUS_COLORS[inq.status] ?? ''}`}>
                    {inq.status}
                  </span>
                  <span className="text-[10px] text-warm/60 font-dm-sans">
                    {inq.type} · {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="font-dm-sans font-medium text-charcoal text-sm">{inq.name}</p>
                {inq.company && <p className="text-xs text-warm">{inq.company}</p>}
                <p className="text-xs text-warm">{inq.email}{inq.phone ? ` · ${inq.phone}` : ''}</p>
              </div>
              <InquiryStatusButton id={inq.id} status={inq.status} />
            </div>
            {inq.message && (
              <p className="mt-3 text-sm text-charcoal-light font-dm-sans border-t border-black/5 pt-3 whitespace-pre-line">
                {inq.message}
              </p>
            )}
          </div>
        ))}

        {inquiries.length === 0 && (
          <div className="text-center py-20 text-warm font-dm-sans text-sm">No inquiries yet.</div>
        )}
      </div>
    </div>
  );
}
