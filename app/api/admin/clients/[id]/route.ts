import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/isAdminEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

async function isAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isAdminUser(user);
}

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id }     = await props.params;
  const body       = await req.json();
  const { action, rejectionNote } = body; // action: 'approve' | 'reject'

  const account = await prisma.clientAccount.findUnique({ where: { id } });
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (action === 'approve') {
    await prisma.clientAccount.update({
      where: { id },
      data: { status: 'APPROVED', approvalToken: null },
    });

    try {
      await resend.emails.send({
        from: 'Sachi Jaipur <onboarding@resend.dev>',
        to: account.email,
        subject: 'Your Sachi Jaipur account has been approved',
        html: `<p>Dear ${account.name},</p><p>Your wholesale account for <strong>${account.company}</strong> has been approved. <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/login">Log in now →</a></p><br/><p>Best regards,<br/>Sachi Jaipur<br/>${process.env.NEXT_PUBLIC_COMPANY_EMAIL} | ${process.env.NEXT_PUBLIC_COMPANY_PHONE}</p>`,
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ status: 'APPROVED' });
  }

  if (action === 'reject') {
    await prisma.clientAccount.update({
      where: { id },
      data: { status: 'REJECTED', rejectionNote: rejectionNote || null, approvalToken: null },
    });

    try {
      await resend.emails.send({
        from: 'Sachi Jaipur <onboarding@resend.dev>',
        to: account.email,
        subject: 'Update on your Sachi Jaipur account application',
        html: `<p>Dear ${account.name},</p><p>Your application has been reviewed. Unfortunately we are unable to approve it at this time.</p>${rejectionNote ? `<p><em>Reason: ${rejectionNote}</em></p>` : ''}<p>Please contact us at <a href="mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL}">${process.env.NEXT_PUBLIC_COMPANY_EMAIL}</a> or ${process.env.NEXT_PUBLIC_COMPANY_PHONE} if you have any questions.</p><br/><p>Best regards,<br/>Sachi Jaipur.</p>`,
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ status: 'REJECTED' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
