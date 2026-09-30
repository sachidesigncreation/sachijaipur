'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin',              label: 'Dashboard',     icon: '◈' },
  { href: '/admin/products',     label: 'Products',      icon: '◎' },
  { href: '/admin/pages',        label: 'Pages',         icon: '▤' },
  { href: '/admin/clients',      label: 'Clients',       icon: '◉' },
  { href: '/admin/team',         label: 'Team',          icon: '✦' },
  { href: '/admin/inquiries',    label: 'Inquiries',     icon: '◇' },
  { href: '/admin/certificates', label: 'Certificates',  icon: '◆' },
  { href: '/admin/import',       label: 'CSV Import',    icon: '◈' },
  { href: '/admin/settings',     label: 'Settings',      icon: '⚙' },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex h-full min-h-0 w-60 shrink-0 flex-col border-r border-gold/10 bg-jet">
      {/* Logo */}
      <div className="shrink-0 px-6 py-7 border-b border-gold/10">
        <Link href="/" className="font-cormorant text-2xl text-ivory tracking-widest uppercase">
          Sachi
        </Link>
        <p className="text-warm text-[10px] uppercase tracking-widest mt-1 font-dm-sans">Admin Panel</p>
      </div>

      {/* Nav — scrolls if many items; footer stays viewport-bottom */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded font-dm-sans text-xs uppercase tracking-widest transition-colors ${
                active
                  ? 'bg-gold/20 text-gold'
                  : 'text-warm hover:text-ivory hover:bg-white/5'
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer — pinned to bottom of sidebar (viewport) */}
      <div className="shrink-0 border-t border-gold/10 px-6 py-5">
        <p className="text-warm text-[10px] truncate mb-3 font-dm-sans">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="text-xs text-warm uppercase tracking-widest hover:text-ivory transition-colors font-dm-sans"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
