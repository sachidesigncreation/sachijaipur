import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isAdminUser } from '@/lib/isAdminEmail';
import { getPostAuthRedirectPath } from '@/lib/getPostAuthRedirectPath';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Build a mutable response so Supabase can refresh session cookies ──
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── ADMIN ROUTES ─────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (user && (await isAdminUser(user))) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return response;
    }

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (!(await isAdminUser(user))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return response;
  }

  // ── CLIENT ACCOUNT ROUTES ────────────────────────────────────────────
  if (pathname.startsWith('/account')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // Status check (PENDING vs APPROVED) is handled server-side in the layout
    return response;
  }

  // ── AUTH ROUTES: redirect away if already logged in ──────────────────
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    if (user) {
      const dest = await getPostAuthRedirectPath(user);
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/auth/login',
    '/auth/register',
  ],
};
