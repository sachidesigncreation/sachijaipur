import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resendFromAddress, sendResendEmail } from '@/lib/email/resendHelpers';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/auth/approval-done?outcome=invalid', req.url));
  }

  const account = await prisma.clientAccount.findUnique({
    where: { approvalToken: token },
  });

  if (!account) {
    return NextResponse.redirect(new URL('/auth/approval-done?outcome=invalid', req.url));
  }

  if (account.status === 'APPROVED') {
    return NextResponse.redirect(
      new URL(
        `/auth/approval-done?outcome=already-approved&company=${encodeURIComponent(account.company)}`,
        req.url
      )
    );
  }

  await prisma.clientAccount.update({
    where: { id: account.id },
    data: { status: 'APPROVED', approvalToken: null },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
  await sendResendEmail(
    {
      from: resendFromAddress(),
      to: account.email,
      subject: 'Your Sachi Jaipur account has been approved',
      html: `
        <h2>Welcome to Sachi Jaipur!</h2>
        <p>Dear ${escapeHtml(account.name)},</p>
        <p>Your wholesale account for <strong>${escapeHtml(account.company)}</strong> has been approved.</p>
        <p>You can now log in to access our full product catalogue, apply filters, and generate quotations.</p>
        <p><a href="${baseUrl}/auth/login">Log in now →</a></p>
        <br/>
        <p>Best regards,<br/>Sachi Jaipur<br/>Sitapura Industrial Area, Jaipur, Rajasthan 302022<br/>${process.env.NEXT_PUBLIC_COMPANY_EMAIL} | ${process.env.NEXT_PUBLIC_COMPANY_PHONE}</p>
      `,
    },
    'auth/approve-client'
  );

  return NextResponse.redirect(
    new URL(
      `/auth/approval-done?outcome=approved&company=${encodeURIComponent(account.company)}`,
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
