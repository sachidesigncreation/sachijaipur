import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resendFromAddress, sendResendEmail } from '@/lib/email/resendHelpers';

export async function GET(req: NextRequest) {
  const token  = req.nextUrl.searchParams.get('token');
  const reason = req.nextUrl.searchParams.get('reason') ?? 'Your application did not meet our current criteria.';

  if (!token) {
    return NextResponse.redirect(new URL('/auth/approval-done?outcome=invalid', req.url));
  }

  const account = await prisma.clientAccount.findUnique({
    where: { approvalToken: token },
  });

  if (!account) {
    return NextResponse.redirect(new URL('/auth/approval-done?outcome=invalid', req.url));
  }

  await prisma.clientAccount.update({
    where: { id: account.id },
    data: { status: 'REJECTED', rejectionNote: reason, approvalToken: null },
  });

  await sendResendEmail(
    {
      from: resendFromAddress(),
      to: account.email,
      subject: 'Update on your Sachi Jaipur account application',
      html: `
        <h2>Account Application Update</h2>
        <p>Dear ${escapeHtml(account.name)},</p>
        <p>Thank you for your interest in <strong>Sachi Jaipur</strong></p>
        <p>Unfortunately, we are unable to approve your wholesale account at this time.</p>
        ${reason ? `<p><em>Reason: ${escapeHtml(reason)}</em></p>` : ''}
        <p>If you believe this is an error or would like to discuss further, please contact us at <a href="mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL}">${process.env.NEXT_PUBLIC_COMPANY_EMAIL}</a> or call ${process.env.NEXT_PUBLIC_COMPANY_PHONE}.</p>
        <br/>
        <p>Best regards,<br/>Sachi Jaipur<br/>Sitapura Industrial Area, Jaipur, Rajasthan 302022</p>
      `,
    },
    'auth/reject-client'
  );

  return NextResponse.redirect(
    new URL(
      `/auth/approval-done?outcome=rejected&company=${encodeURIComponent(account.company)}`,
      req.url
    )
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
