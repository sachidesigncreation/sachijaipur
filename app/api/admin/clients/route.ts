import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/isAdminEmail';

async function isAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isAdminUser(user);
}

const BUSINESS_TYPES = ['Retailer', 'Wholesaler', 'Designer', 'Other'];

/**
 * Admin-created wholesale user. Creates the Supabase auth login AND an
 * APPROVED client account in one step — the user can sign in immediately,
 * with no approval wait and no emails sent.
 */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const name = String(body.name ?? '').trim();
  const company = String(body.company ?? '').trim();
  const country = String(body.country ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const businessType = String(body.businessType ?? '').trim();

  if (!email || !email.includes('@')) return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  if (!name) return NextResponse.json({ error: 'Contact name is required.' }, { status: 400 });
  if (!company) return NextResponse.json({ error: 'Company is required.' }, { status: 400 });
  if (!country) return NextResponse.json({ error: 'Country is required.' }, { status: 400 });
  if (!BUSINESS_TYPES.includes(businessType)) return NextResponse.json({ error: 'Business type is required.' }, { status: 400 });

  const existing = await prisma.clientAccount.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });

  const supabase = await createSupabaseAdminClient();
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const account = await prisma.clientAccount.create({
    data: {
      email,
      name,
      company,
      country,
      phone: phone || null,
      businessType,
      status: 'APPROVED',
      supabaseUid: authData.user?.id,
    },
  });

  return NextResponse.json({ success: true, id: account.id, email: account.email }, { status: 201 });
}
