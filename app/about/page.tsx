import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import FloatingQuoteCart from "@/components/layout/FloatingQuoteCart";
import QuoteCartDrawer from "@/components/quote/QuoteCartDrawer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getSiteSettingsMap } from "@/lib/siteSettings";
import { imagesFromMap, contentFromMap } from "@/lib/siteConfig";
import { resolveSiteImage } from "@/lib/siteImage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us — Sachi Jaipur",
  description:
    "Fine jewellery manufacturing in Jaipur. Sustainable mass production and wholesale of precious and semi-precious jewellery.",
};

function BodyBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-charcoal-light font-dm-sans text-body lg:text-body-lg leading-relaxed space-y-4">
      {children}
    </div>
  );
}

export default async function AboutPage() {
  const map = await getSiteSettingsMap();
  const imgs = imagesFromMap(map);
  const content = contentFromMap(map);
  const cover = resolveSiteImage(imgs.about_cover, '/HomePageImage.webp');
  const img1 = resolveSiteImage(imgs.about_img1, '/BentoGrid/1.png');
  const img2 = resolveSiteImage(imgs.about_img2, '/BentoGrid/3.png');
  return (
    <div className="bg-ivory min-h-screen">
      <Navbar />

      {/* Cover hero */}
      <div className="relative w-full h-[min(52vh,560px)] min-h-[280px] mt-20">
        <Image
          src={cover}
          alt="Sachi Jaipur — Jaipur manufacturing"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-jet/35" aria-hidden />
      </div>

      <main className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 lg:pt-20">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
              Who We Are
            </span>
            <h1 className="font-cormorant text-display-md lg:text-display-lg text-charcoal mb-6">
              About Us
            </h1>
            <div className="h-px w-16 bg-gold mx-auto mb-10" />
            <BodyBlock>
              <p className="text-center text-charcoal">
                {content.about_intro}
              </p>
            </BodyBlock>
          </ScrollReveal>

          {/* Image left · text right */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-16 border-t border-gold/15">
            <ScrollReveal className="relative aspect-square w-full max-w-xl mx-auto lg:mx-0 overflow-hidden border border-gold/20 bg-pearl">
              <Image
                src={img1}
                alt="Sachi Jaipur design and craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </ScrollReveal>
            <ScrollReveal>
              <BodyBlock>
                <p>
                  {content.about_p1}
                </p>
              </BodyBlock>
            </ScrollReveal>
          </section>

          {/* Text left · image right (stack: text then image on small screens) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-16 border-t border-gold/15">
            <ScrollReveal>
              <BodyBlock>
                <p>
                  {content.about_p2}
                </p>
              </BodyBlock>
            </ScrollReveal>
            <ScrollReveal className="relative aspect-square w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto overflow-hidden border border-gold/20 bg-pearl">
              <Image
                src={img2}
                alt="Sachi Jaipur workshop and production"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </ScrollReveal>
          </section>

          <div className="text-center pt-8">
            <Link
              href="/process"
              className="inline-flex items-center font-dm-sans text-sm tracking-widest uppercase text-charcoal border-b border-transparent hover:border-gold hover:text-gold transition-colors"
            >
              Explore Our Process →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <FloatingQuoteCart />
      <QuoteCartDrawer />
    </div>
  );
}
