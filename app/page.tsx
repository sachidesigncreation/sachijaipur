import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import FloatingQuoteCart from "@/components/layout/FloatingQuoteCart";
import QuoteCartDrawer from "@/components/quote/QuoteCartDrawer";

import HeroCarousel, { type HeroSlide } from "@/components/home/HeroCarousel";
import CollectionsGrid, { type CollectionCard } from "@/components/home/CollectionsGrid";
import CollectionSpotlight from "@/components/home/CollectionSpotlight";
import BestsellersCarousel from "@/components/home/BestsellersCarousel";
import HomeProductGrid from "@/components/home/HomeProductGrid";
import BrandStorySection from "@/components/home/BrandStorySection";
import InfoStrip from "@/components/home/InfoStrip";
import { getSiteSettingsMap } from "@/lib/siteSettings";
import { imagesFromMap, contentFromMap } from "@/lib/siteConfig";
import { resolveSiteImage } from "@/lib/siteImage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const map = await getSiteSettingsMap();
  const imgs = imagesFromMap(map);
  const content = contentFromMap(map);
  const img = (key: string, fallback: string) => resolveSiteImage(imgs[key], fallback);

  const heroImages = [img('hero_1', '/HomePageImage.webp'), img('hero_2', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80'), img('hero_3', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80'), img('hero_4', '/HomePageAbout.webp')];

  const slides: HeroSlide[] = [
    {
      id: 1,
      image: heroImages[0],
      label: content.hero_1_label,
      heading: content.hero_1_heading,
      subtext: content.hero_1_subtext,
      primaryCta: { label: 'Explore Gold', href: '/products' },
      secondaryCta: { label: 'Request a Quote', href: '/contact#quote' },
    },
    {
      id: 2,
      image: heroImages[1],
      label: content.hero_2_label,
      heading: content.hero_2_heading,
      subtext: content.hero_2_subtext,
      primaryCta: { label: 'Explore Silver', href: '/products' },
      secondaryCta: { label: 'Request a Quote', href: '/contact#quote' },
    },
    {
      id: 3,
      image: heroImages[2],
      label: content.hero_3_label,
      heading: content.hero_3_heading,
      subtext: content.hero_3_subtext,
      primaryCta: { label: 'Browse Gemstones', href: '/products' },
      secondaryCta: { label: 'Request a Quote', href: '/contact#quote' },
    },
    {
      id: 4,
      image: heroImages[3],
      label: content.hero_4_label,
      heading: content.hero_4_heading,
      subtext: content.hero_4_subtext,
      primaryCta: { label: 'Our Process', href: '/process' },
      secondaryCta: { label: 'Contact Us', href: '/contact' },
    },
  ];

  const collections: CollectionCard[] = [
    {
      label: 'Gold Jewellery',
      image: img('collection_gold', '/BentoGrid/1.png'),
      href: '/products',
      description: 'Rings, earrings, pendants & more in 14K, 18K & 22K gold.',
    },
    {
      label: 'Silver Jewellery',
      image: img('collection_silver', '/BentoGrid/2.png'),
      href: '/products',
      description: '925 sterling silver with colour gemstone settings.',
    },
    {
      label: 'Brass Jewellery',
      image: img('collection_brass', '/BentoGrid/3.png'),
      href: '/products',
      description: 'Bold, fashion-forward brass pieces with stone inlays.',
    },
    {
      label: 'Gemstone Collections',
      image: img('collection_gemstone', '/BentoGrid/4.png'),
      href: '/products',
      description: 'Colour gemstones across sapphire, emerald, moonstone & more.',
    },
  ];

  return (
    <div className="relative">
      <Navbar />

      <main>
        {/* 1. Full-width hero slideshow */}
        <HeroCarousel slides={slides} />

        {/* 2. Collection category grid — Gold / Silver / Brass / Gemstone */}
        <CollectionsGrid collections={collections} />

        {/* 3. Gold collection spotlight */}
        <CollectionSpotlight
          label={content.spotlight_gold_label}
          title={content.spotlight_gold_title}
          description={content.spotlight_gold_desc}
          href="/products"
          image={img('spotlight_gold', '/HomePageImage.webp')}
          imageAlt="Sachi Jaipur gold jewellery collection"
          align="left"
          bg="ivory"
        />

        {/* 4. Bestsellers horizontal carousel */}
        <BestsellersCarousel />

        {/* 5. Silver collection spotlight */}
        <CollectionSpotlight
          label={content.spotlight_silver_label}
          title={content.spotlight_silver_title}
          description={content.spotlight_silver_desc}
          href="/products"
          image={img('spotlight_silver', '/HomePageAbout.webp')}
          imageAlt="Sachi Jaipur silver jewellery craftsmanship"
          align="right"
          bg="pearl"
        />

        {/* 6. Brass collection spotlight */}
        <CollectionSpotlight
          label={content.spotlight_brass_label}
          title={content.spotlight_brass_title}
          description={content.spotlight_brass_desc}
          href="/products"
          image={img('spotlight_brass', '/BentoGrid/4.png')}
          imageAlt="Sachi Jaipur brass jewellery collection"
          align="left"
          bg="ivory"
        />

        {/* 7. Full product grid */}
        <HomeProductGrid />

        {/* 8. Brand story text section */}
        <BrandStorySection
          eyebrow={content.brand_eyebrow}
          heading={content.brand_heading}
          paras={[content.brand_para1, content.brand_para2, content.brand_para3]}
        />

        {/* 9. Info strip — craftsmanship / bulk / support */}
        <InfoStrip />
      </main>

      <Footer />
      <FloatingWhatsApp />
      <FloatingQuoteCart />
      <QuoteCartDrawer />
    </div>
  );
}
