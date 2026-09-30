import Link from 'next/link';
import { getSiteSettingsMap } from '@/lib/siteSettings';
import { footerFromMap } from '@/lib/siteConfig';
import { getNavPages } from '@/lib/cmsServer';

export const dynamic = 'force-dynamic';

export default async function Footer() {
  const [map, navPages] = await Promise.all([getSiteSettingsMap(), getNavPages()]);
  const footer = footerFromMap(map);

  const addressLines = footer.address
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  return (
    <footer className="bg-jet pt-20 pb-10 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1 — brand */}
          <div>
            <h2 className="font-cormorant text-3xl text-ivory mb-1 uppercase tracking-widest">Sachi</h2>
            <p className="font-dm-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">
              Jaipur
            </p>
            <p className="text-warm text-body mb-6">
              {footer.tagline}
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 border border-gold/20 flex flex-col justify-center items-center text-ivory hover:border-gold transition-colors">In</a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 border border-gold/20 flex flex-col justify-center items-center text-ivory hover:border-gold transition-colors">Ig</a>
              <a
                href={`https://wa.me/${footer.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 border border-gold/20 flex flex-col justify-center items-center text-ivory hover:border-gold transition-colors"
              >
                Wa
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-ivory font-dm-sans text-sm tracking-widest uppercase mb-6">Company</h3>
            <div className="flex flex-col gap-3 text-warm text-body">
              <Link href="/about" className="hover:text-gold transition-colors">About Sachi Jaipur</Link>
              <Link href="/process" className="hover:text-gold transition-colors">Our Process</Link>
              <Link href="/certificates" className="hover:text-gold transition-colors">Certificates</Link>
              <Link href="/#sustainability" className="hover:text-gold transition-colors">Sustainability</Link>
              {navPages.map(p => (
                <Link key={p.slug} href={`/${p.slug}`} className="hover:text-gold transition-colors">{p.label}</Link>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-ivory font-dm-sans text-sm tracking-widest uppercase mb-6">Products</h3>
            <div className="flex flex-col gap-3 text-warm text-body">
              <Link href="/products?metal=gold" className="hover:text-gold transition-colors">Gold Jewellery</Link>
              <Link href="/products?metal=silver" className="hover:text-gold transition-colors">Silver Jewellery</Link>
              <Link href="/products?metal=brass" className="hover:text-gold transition-colors">Brass Jewellery</Link>
              <Link href="/products" className="hover:text-gold transition-colors">All Collections</Link>
            </div>
          </div>

          {/* Column 4 — editable contact */}
          <div>
            <h3 className="text-ivory font-dm-sans text-sm tracking-widest uppercase mb-6">Contact</h3>
            <div className="flex flex-col gap-3 text-warm text-body">
              <p>
                {addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <a href={`mailto:${footer.email}`} className="hover:text-gold transition-colors">{footer.email}</a>
              <a href={`tel:+${footer.phone.replace(/\D/g, '')}`} className="hover:text-gold transition-colors">{footer.phone}</a>
              <a
                href={`https://wa.me/${footer.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/20 flex flex-col md:flex-row justify-between items-center gap-4 text-warm text-sm">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <p suppressHydrationWarning>© {new Date().getFullYear()} {footer.brand}. All rights reserved.</p>
            <span className="hidden md:inline text-gold/30">|</span>
            <p className="text-warm/60 text-xs">GST: {footer.gst}</p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
