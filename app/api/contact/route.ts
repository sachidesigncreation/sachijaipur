import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

const RequestSchema = z.object({
  type:    z.enum(['INQUIRY', 'QUOTATION']),
  name:    z.string().min(2),
  email:   z.string().email(),
  company: z.string().optional(),
  phone:   z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = RequestSchema.parse(body);

    // Write to DB
    await prisma.inquiry.create({
      data: {
        type:    data.type,
        name:    data.name,
        email:   data.email,
        company: data.company || null,
        phone:   data.phone   || null,
        message: data.message || null,
        status:  'NEW',
      },
    });

    // Send email notification
    const subject = data.type === 'QUOTATION'
      ? `New Quotation Request from ${data.name} (${data.company ?? 'Individual'})`
      : `New Inquiry from ${data.name}`;

    try {
      await resend.emails.send({
        from: 'Sachi Jaipur <onboarding@resend.dev>',
        to: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@sachijewellery.com',
        subject,
        html: `
          <h3>${subject}</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
          ${data.phone   ? `<p><strong>Phone:</strong> ${data.phone}</p>`   : ''}
          <p><strong>Message:</strong></p>
          <p>${data.message ?? 'No additional message.'}</p>
          <br/><p><small><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/inquiries">View in Admin Panel</a></small></p>
        `,
      });
    } catch (emailErr) {
      console.warn('[contact] Email send failed (non-fatal):', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
