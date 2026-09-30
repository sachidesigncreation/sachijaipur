"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CmsNavLinks from "@/components/layout/CmsNavLinks";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navbarSolid = scrolled || !isHomePage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/80 backdrop-blur-md border-b border-white/20 text-charcoal ${
        navbarSolid ? "py-4 shadow-sm" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link
          href="/"
          className="relative z-50 flex flex-col items-start leading-none transition-colors text-charcoal"
        >
          <span className="font-cormorant text-2xl tracking-widest uppercase">Sachi</span>
          <span className="font-dm-sans text-[8px] tracking-[0.45em] uppercase text-gold mt-0.5">
            Jaipur
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 font-dm-sans text-sm uppercase tracking-widest">
          <div className="group relative">
            <button className="hover:opacity-70 transition-opacity uppercase font-dm-sans text-sm tracking-widest">
              Company ▾
            </button>
            <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <div className="bg-jet border border-jet/20 flex flex-col">
              <Link
                href="/about"
                className="px-4 py-3 text-ivory hover:bg-ivory/10 text-xs transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/#what-we-do"
                className="px-4 py-3 text-ivory hover:bg-ivory/10 text-xs transition-colors"
              >
                What We Do
              </Link>
              <Link
                href="/#why-choose-us"
                className="px-4 py-3 text-ivory hover:bg-ivory/10 text-xs transition-colors"
              >
                Why Choose Us
              </Link>
              <Link
                href="/#values"
                className="px-4 py-3 text-ivory hover:bg-ivory/10 text-xs transition-colors"
              >
                Our Values
              </Link>
            </div>
            </div>
          </div>
          <Link
            href="/products"
            className="hover:opacity-70 transition-opacity"
          >
            Products
          </Link>
          <Link href="/process" className="hover:opacity-70 transition-opacity">
            Our Process
          </Link>
          <Link
            href="/certificates"
            className="hover:opacity-70 transition-opacity"
          >
            Certificates
          </Link>
          <Link href="/contact" className="hover:opacity-70 transition-opacity">
            Contact
          </Link>
          <CmsNavLinks />
          <Link
            href="/contact#quote"
            className={`px-6 py-3 font-dm-sans text-xs font-medium uppercase tracking-[0.25em] transition-colors bg-gold text-jet hover:bg-gold-deep`}
          >
            Request a Quote →
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden relative z-50 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-4 relative flex flex-col justify-between">
            <span
              className={`w-full h-0.5 transition-all duration-300 bg-charcoal ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <span
              className={`w-full h-0.5 transition-all duration-300 bg-charcoal ${menuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`w-full h-0.5 transition-all duration-300 bg-charcoal ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-ivory z-40 transition-transform duration-500 flex flex-col justify-center items-center gap-8 ${menuOpen ? "translate-x-0" : "translate-x-full lg:hidden"}`}
        >
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="font-dm-sans text-2xl text-charcoal uppercase tracking-widest"
          >
            About Us
          </Link>
          <Link
            href="/#what-we-do"
            onClick={() => setMenuOpen(false)}
            className="font-dm-sans text-lg text-charcoal/80 uppercase tracking-widest"
          >
            What We Do
          </Link>
          <Link
            href="/#why-choose-us"
            onClick={() => setMenuOpen(false)}
            className="font-dm-sans text-lg text-charcoal/80 uppercase tracking-widest"
          >
            Why Choose Us
          </Link>
          <Link
            href="/#values"
            onClick={() => setMenuOpen(false)}
            className="font-dm-sans text-lg text-charcoal/80 uppercase tracking-widest"
          >
            Our Values
          </Link>
          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="font-dm-sans text-2xl text-charcoal uppercase tracking-widest"
          >
            Products
          </Link>
          <Link
            href="/process"
            onClick={() => setMenuOpen(false)}
            className="font-dm-sans text-2xl text-charcoal uppercase tracking-widest"
          >
            Our Process
          </Link>
          <Link
            href="/certificates"
            onClick={() => setMenuOpen(false)}
            className="font-dm-sans text-2xl text-charcoal uppercase tracking-widest"
          >
            Certificates
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="font-dm-sans text-2xl text-charcoal uppercase tracking-widest"
          >
            Contact
          </Link>
          <CmsNavLinks variant="mobile" onNavigate={() => setMenuOpen(false)} />
          <Link
            href="/contact#quote"
            onClick={() => setMenuOpen(false)}
            className="btn-primary mt-4"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </nav>
  );
}
