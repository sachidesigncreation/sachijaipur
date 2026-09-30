import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import FloatingQuoteCart from "@/components/layout/FloatingQuoteCart";
import QuoteCartDrawer from "@/components/quote/QuoteCartDrawer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { manufacturingProcessSteps } from "@/data/manufacturingProcess";
import { getSiteSettingsMap } from "@/lib/siteSettings";
import { imagesFromMap } from "@/lib/siteConfig";
import { resolveSiteImage } from "@/lib/siteImage";

export const dynamic = "force-dynamic";

export default async function ProcessPage() {
  const map = await getSiteSettingsMap();
  const imgs = imagesFromMap(map);
  const steps = manufacturingProcessSteps.map((step, i) => {
    const key = `process_${i + 1}`;
    return { ...step, image: resolveSiteImage(imgs[key], step.image) };
  });
  return (
    <div className="bg-ivory min-h-screen pt-20">
      <Navbar />

      <div className="bg-jet py-32 text-center border-b border-gold/10">
        <h1 className="font-cormorant text-display-md lg:text-display-lg text-ivory mb-4">
          From Concept to Creation
        </h1>
        <p className="font-dm-sans text-warm text-body-lg tracking-widest uppercase">
          End-to-End Fine Jewellery Manufacturing
        </p>
      </div>

      <main className="pb-20">
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={step.title} className="border-b border-gold/10 py-24">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <ScrollReveal
                  className={`relative aspect-[4/3] w-full overflow-hidden ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </ScrollReveal>

                <ScrollReveal
                  delay={0.2}
                  className={`relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="font-cormorant text-8xl text-gold/20 absolute -top-16 -left-8 lg:-left-20 pointer-events-none select-none z-0">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="relative z-10">
                    <h2 className="font-cormorant text-display-md text-charcoal mb-6">
                      {step.title}
                    </h2>
                    <p className="font-dm-sans text-body-lg text-charcoal-light mb-8 leading-relaxed">
                      {step.desc}
                    </p>
                    <ul className="space-y-3 font-dm-sans text-charcoal font-medium text-sm">
                      {step.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          );
        })}

        <div className="text-center py-32 bg-pearl border-t border-gold/20 mt-12 flex flex-col items-center">
          <h2 className="font-cormorant text-display-md text-charcoal mb-8">
            Ready to Begin Your Collection?
          </h2>
          <Link href="/contact" className="btn-primary">
            Contact Us Today
          </Link>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <FloatingQuoteCart />
      <QuoteCartDrawer />
    </div>
  );
}
