import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import {
  getAdminNotificationRecipients,
  resendFromAddress,
  sendResendEmail,
} from '@/lib/email/resendHelpers';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name, company, country, phone, businessType } = body;

  if (!email || !password || !name || !company || !country || !businessType) {
    return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
  }

  const existing = await prisma.clientAccount.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
  }

  const supabase = await createSupabaseAdminClient();
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const approvalToken = crypto.randomBytes(32).toString('hex');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  await prisma.clientAccount.create({
    data: {
      email,
      name,
      company,
      country,
      phone: phone || null,
      businessType,
      status: 'PENDING',
      approvalToken,
      supabaseUid: authData.user?.id,
    },
  });

  const from = resendFromAddress();

  const clientResult = await sendResendEmail(
    {
      from,
      to: email,
      replyTo: process.env.NEXT_PUBLIC_COMPANY_EMAIL || undefined,
      subject: 'Your Sachi Jaipur account is under review',
      html: `
        <h2>Thank you for registering with Sachi Jaipur!</h2>
        <p>Dear ${escapeHtml(name)},</p>
        <p>We have received your wholesale account application for <strong>${escapeHtml(company)}</strong>. Our team will review your application and you will receive an email once approved.</p>
        <p>This typically takes 1–2 business days.</p>
        <br/>
        <p>Best regards,<br/>Sachi Jaipur<br/>Sitapura Industrial Area, Jaipur, Rajasthan 302022, India<br/>${process.env.NEXT_PUBLIC_COMPANY_EMAIL} | ${process.env.NEXT_PUBLIC_COMPANY_PHONE}<br/>GST: 08ACSFS4747G1ZI</p>
      `,
    },
    'auth/register-client'
  );

  if (!clientResult.ok) {
    console.error('[auth/register] Client confirmation email failed (account still created).');
  }

  const adminRecipients = getAdminNotificationRecipients();
  if (adminRecipients.length === 0) {
    console.warn(
      '[auth/register] No admin recipients: set ADMIN_EMAIL and/or ADMIN_NOTIFICATION_EMAILS in the server environment.'
    );
  } else {
    const approveUrl = `${baseUrl}/api/auth/approve?token=${encodeURIComponent(approvalToken)}`;
    const rejectUrl = `${baseUrl}/api/auth/reject?token=${encodeURIComponent(approvalToken)}&reason=${encodeURIComponent('Application does not meet our current criteria')}`;

    const adminResult = await sendResendEmail(
      {
        from,
        to: adminRecipients,
        replyTo: email,
        subject: `New wholesale account application — ${company}`,
        html: `
          <h2>New account application</h2>
          <p><strong>Company:</strong> ${escapeHtml(company)}</p>
          <p><strong>Contact:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Country:</strong> ${escapeHtml(country)}</p>
          <p><strong>Type:</strong> ${escapeHtml(businessType)}</p>
          ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
          <br/>
          <p>
            <a href="${approveUrl}" style="background:#C9922A;color:#fff;padding:10px 20px;text-decoration:none;display:inline-block;margin-right:10px;">Approve</a>
            <a href="${rejectUrl}" style="background:#dc2626;color:#fff;padding:10px 20px;text-decoration:none;display:inline-block;">Reject</a>
          </p>
          <p><small>You can also use the <a href="${baseUrl}/admin/clients">admin panel</a>.</small></p>
        `,
      },
      'auth/register-admin'
    );

    if (!adminResult.ok) {
      console.error(
        '[auth/register] Admin notification failed. If using onboarding@resend.dev, add these addresses as verified recipients in Resend, or set RESEND_FROM to your verified domain.'
      );
    }
  }

  return NextResponse.json({ success: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
