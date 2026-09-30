# Sachi Jewellery Co. — Complete Website Project Document
### Version 2.0 — Updated for Latest Stack (April 2026)
**For use with Cursor / Copilot / AI Coding Assistants**

---

## CHANGELOG FROM v1.0
- Updated to **Next.js 16.2** (latest stable as of April 2026)
- Updated to **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- Updated to **React 19.2** (View Transitions, `<Activity />`, `useEffectEvent`)
- Updated to **Motion v12** (rebranded from Framer Motion — new import path `motion/react`)
- Updated to **Zustand v5** (React 19 compatible)
- Updated to **Zod v4** with `@hookform/resolvers` v5+ (import from `zod/v4`)
- Updated to **React Hook Form v7**
- Tailwind setup is now CSS-first (`@theme` in globals.css — no JS config file)
- Removed `framer-motion` package reference — use `motion` package instead
- Added Next.js 16 breaking change notes (async params, `proxy.ts` middleware)
- Added React Compiler (stable in Next.js 16) guidance
- Added `next.config.ts` (native TypeScript config, no `.js` needed)

---

## 1. PROJECT OVERVIEW

**Client:** Sachi Jewellery Co.
**Location:** Sitapura Industrial Area (SEZ-II), Jaipur, Rajasthan, India
**Business Type:** B2B Fine Jewellery Manufacturer, Wholesaler & Exporter
**Website Purpose:** International B2B showcase, product catalogue, and quotation request portal
**Target Audience:** International brands, wholesalers, large-scale buyers, private designers
**Primary Language:** English only
**Device Priority:** Desktop-first; mobile needs to work but is not primary

---

## 2. TECH STACK & EXACT VERSIONS

```
Next.js          16.2.x        (latest stable — Turbopack stable, React Compiler stable)
React            19.2.1        (View Transitions, Activity, useEffectEvent)
React DOM        19.2.1
TypeScript       5.8.x
Tailwind CSS     4.1.x         (CSS-first config, @theme directive, no tailwind.config.js)
@tailwindcss/postcss  4.x      (PostCSS plugin for Tailwind v4 with Next.js)
motion           12.x          (formerly Framer Motion — import from "motion/react")
zustand          5.0.x         (React 19 compatible)
react-hook-form  7.x
zod              4.x
@hookform/resolvers  5.x       (supports zod v4 — import from "zod/v4")
jspdf            3.x
jspdf-autotable  5.x
resend           4.x           (recommended email — first-class Next.js support)
Node.js          22.x LTS      (minimum required for Next.js 16)
```

**Compatibility Matrix:**
```
Next.js 16.2  →  React 19.2  →  Zustand 5  →  Motion 12  ✅ All compatible
Tailwind v4   →  @tailwindcss/postcss  →  Next.js 16  ✅ Official support
Zod v4        →  @hookform/resolvers v5  →  RHF v7  ✅ Compatible
```

---

## 3. INITIAL PROJECT SETUP

### 3.1 Create the Project

```bash
# Create Next.js 16 project (do NOT use --tailwind flag — install Tailwind v4 manually)
npx create-next-app@latest sachi-jewellery \
  --typescript \
  --eslint \
  --app \
  --no-tailwind \
  --turbopack

cd sachi-jewellery
```

> **Why no `--tailwind` flag?** `create-next-app` still scaffolds Tailwind v3. We install v4 manually.

### 3.2 Install Tailwind CSS v4 (CSS-first, no config file)

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

Create `postcss.config.mjs` in root:
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

Replace `app/globals.css` entirely — Tailwind v4 uses `@import` not `@tailwind` directives:
```css
/* app/globals.css */
@import "tailwindcss";

/* All custom theme tokens go here using @theme — NO tailwind.config.js needed */
@theme {
  /* === FONTS === */
  --font-cormorant: 'Cormorant Garamond', serif;
  --font-dm-sans: 'DM Sans', sans-serif;

  /* === BRAND COLORS === */
  --color-gold-light:    #F5E6C8;
  --color-gold:          #C9922A;
  --color-gold-deep:     #A67318;
  --color-ivory:         #FDFAF4;
  --color-pearl:         #F9F6EF;
  --color-charcoal:      #2C2A27;
  --color-charcoal-light:#4A4743;
  --color-warm:          #7A7670;
  --color-jet:           #111010;

  /* === FONT SIZES (custom scale) === */
  --text-display-xl: 4.5rem;
  --text-display-xl--line-height: 1.1;
  --text-display-xl--letter-spacing: -0.02em;

  --text-display-lg: 3.5rem;
  --text-display-lg--line-height: 1.15;
  --text-display-lg--letter-spacing: -0.015em;

  --text-display-md: 2.5rem;
  --text-display-md--line-height: 1.2;
  --text-display-md--letter-spacing: -0.01em;

  --text-heading: 1.75rem;
  --text-heading--line-height: 1.3;

  --text-subheading: 1.25rem;
  --text-subheading--line-height: 1.4;

  --text-body-lg: 1.0625rem;
  --text-body-lg--line-height: 1.75;

  --text-body: 0.9375rem;
  --text-body--line-height: 1.7;

  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.6;

  /* === SPACING (extend Tailwind defaults) === */
  --spacing-section:    6rem;
  --spacing-section-lg: 8rem;
}

/* === UTILITY CLASSES (Tailwind v4 uses @utility instead of @layer utilities) === */
@utility btn-primary {
  background-color: var(--color-gold);
  color: var(--color-jet);
  padding: 0.75rem 2rem;
  font-family: var(--font-dm-sans);
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
}

@utility btn-primary:hover {
  background-color: var(--color-gold-deep);
}

@utility btn-secondary {
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  padding: 0.75rem 2rem;
  font-family: var(--font-dm-sans);
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

@utility btn-secondary:hover {
  background-color: var(--color-gold);
  color: var(--color-jet);
}

/* Ken Burns animation for hero image */
@keyframes kenburns {
  0%   { transform: scale(1); }
  100% { transform: scale(1.08); }
}

.animate-kenburns {
  animation: kenburns 12s ease-in-out infinite alternate;
}

/* Gold divider reveal */
@keyframes scaleX-reveal {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

### 3.3 Install All Dependencies

```bash
# Animation (Motion — formerly Framer Motion)
npm install motion

# State management
npm install zustand

# Forms + validation
npm install react-hook-form zod @hookform/resolvers

# PDF generation (client-side)
npm install jspdf jspdf-autotable

# Email (server-side)
npm install resend

# Google Fonts (next/font — built into Next.js, no install needed)
```

> **⚠️ IMPORTANT:** Do NOT install `framer-motion`. The package is now `motion`.
> Import from `"motion/react"` not `"framer-motion"`.

### 3.4 Google Fonts Setup (next/font — built-in)

```typescript
// app/layout.tsx
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-dm-sans bg-ivory text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
```

### 3.5 Next.js 16 Config (`next.config.ts`)

```typescript
// next.config.ts  (native TypeScript — no .js needed in Next.js 16)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React Compiler (stable in Next.js 16 — opt-in)
  reactCompiler: true,

  // Turbopack is the default in Next.js 16 — no flag needed
  // turbopack: true,  ← this is now the default

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    // PPR is now Cache Components in Next.js 16 — no flag needed
    // ppr: true,  ← removed in Next.js 16
  },
};

export default nextConfig;
```

### 3.6 Next.js 16 Breaking Changes to Know

```typescript
// ❌ OLD (Next.js 14/15): Synchronous params
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>
}

// ✅ NEW (Next.js 16): Params are async — ALWAYS await them
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return <h1>{slug}</h1>
}

// Run this codemod to auto-migrate:
// npx @next/codemod@latest async-params .
```

---

## 4. DESIGN SYSTEM

### 4.1 Color Palette

Derived from the Sachi Jewellery logo — gold monogram on black, charcoal script.

```
Color Name       Tailwind Class          Hex         Usage
──────────────────────────────────────────────────────────────────
Gold Light       bg-gold-light           #F5E6C8     Champagne tint, backgrounds
Gold (Primary)   bg-gold                 #C9922A     CTAs, borders, accents
Gold Deep        bg-gold-deep            #A67318     Hover states
Ivory            bg-ivory                #FDFAF4     Page background
Pearl            bg-pearl                #F9F6EF     Card surfaces
Charcoal         bg-charcoal             #2C2A27     Headings, primary text
Charcoal Light   bg-charcoal-light       #4A4743     Body text
Warm Gray        bg-warm                 #7A7670     Secondary / muted text
Jet Black        bg-jet                  #111010     Dark sections, footer, hero
```

> In Tailwind v4, classes like `bg-gold`, `text-gold`, `border-gold` are auto-generated
> from the `--color-gold` token defined in `@theme` in `globals.css`.

### 4.2 Typography

```
Role              Font                        Weights       Usage
─────────────────────────────────────────────────────────────────────────
Display/Headings  Cormorant Garamond (serif)  300, 400, 500, 600  H1–H4, section titles
Body/UI           DM Sans (sans-serif)        300, 400, 500  Nav, body, buttons, labels
Italic/Accents    Cormorant Garamond italic   300, 400  Taglines, pull quotes
```

**Why these fonts?**
Cormorant Garamond is used by several luxury houses (Cartier, Vogue) — it carries inherent jewellery-sector weight. DM Sans is the ideal B2B pairing: legible at small sizes, modern without being generic.

**Tailwind v4 font usage:**
```html
<!-- Heading -->
<h1 class="font-[--font-cormorant] text-display-xl text-charcoal">
  Crafted in Jaipur.
</h1>

<!-- Body -->
<p class="font-[--font-dm-sans] text-body text-charcoal-light">
  Fine jewellery manufacturing...
</p>
```

### 4.3 Animation Principles (Motion v12)

```typescript
// Motion v12 — NEW import path (no longer "framer-motion")
import { motion, AnimatePresence } from "motion/react";
// NOT: import { motion } from "framer-motion";  ← this is outdated

// Standard scroll-reveal variant
export const revealVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Stagger container
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// Gold line reveal (width 0 → full)
export const lineReveal = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
};
```

All scroll-triggered animations use `whileInView` with `viewport={{ once: true }}`.
No springs, no bounce — all easing is smooth cubic-bezier for luxury feel.

### 4.4 Component Tokens (as Tailwind classes)

```
Element               Classes
──────────────────────────────────────────────────────────────────────────────
Primary Button        btn-primary (custom utility from globals.css)
Secondary Button      btn-secondary (custom utility)
Section Padding       py-24 lg:py-32
Container             max-w-7xl mx-auto px-6 lg:px-12
Section Label         text-gold text-xs tracking-[0.25em] uppercase font-[--font-dm-sans]
Section Heading       font-[--font-cormorant] text-display-md text-charcoal
Gold Divider          h-px w-16 bg-gold (Motion: lineReveal variant)
Card                  bg-pearl border border-gold/20 rounded-none  (no rounding — jewellery feel)
```

---

## 5. SITE ARCHITECTURE & NAVIGATION

### 5.1 Pages

```
/                   Home Page
/products           All Products (filters + grid)
/process            Our Process
/certificates       Certificates
/contact            Contact Us
```

### 5.2 Navigation Component

```typescript
// components/layout/Navbar.tsx
// 'use client' — uses scroll state

'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
      ${scrolled
        ? 'bg-ivory/95 backdrop-blur-sm border-b border-gold/20'
        : 'bg-transparent'
      }`}
    >
      {/* ... logo, nav links, CTA button */}
    </nav>
  );
}
```

**Nav Structure:**
```
[Logo]                    [Company ▾] [Products] [Our Process] [Certificates] [Contact]    [Request a Quote →]

Company dropdown links (all anchor to homepage sections):
  → About Us        /#about
  → What We Do      /#what-we-do
  → Why Choose Us   /#why-choose-us
  → Our Values      /#values
```

**States:**
- Transparent nav on dark hero → `text-ivory`
- Scrolled / light sections → `text-charcoal` with pearl background
- Active link: gold underline `border-b border-gold`

---

## 6. HOME PAGE — Section-by-Section Specification

### SECTION 1 — HERO (Split-Screen)

**Layout:** `min-h-screen`, 2 columns 50/50, no gap.

**Left column — Image:**
```typescript
// components/home/HeroSection.tsx
// Left: full-height image with Ken Burns CSS animation

<div className="relative h-screen overflow-hidden">
  <Image
    src="/images/hero/hero-jewellery.jpg"  {/* Unsplash: "jewellery gold gemstone luxury" */}
    alt="Sachi Jewellery — Fine Craftsmanship"
    fill
    className="object-cover animate-kenburns"  {/* defined in globals.css */}
    priority  {/* LCP image — always set priority */}
    sizes="50vw"
  />
  {/* Gradient fade toward right for text-side blend */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-jet/60" />
</div>
```

**Right column — Content:**
```
Background:          bg-jet
Layout:              flex flex-col justify-center px-16 py-20
Section label:       "Jaipur, India — Est. in Craftsmanship"
                     text-gold text-xs tracking-[0.3em] uppercase mb-6
H1:                  "Crafted in Jaipur.\nTrusted Worldwide."
                     font-[--font-cormorant] text-display-xl text-ivory leading-tight mb-6
Subtext:             "Fine jewellery manufacturing, wholesale & export.
                      Gold · Silver · Brass · Gemstones."
                     font-[--font-dm-sans] text-warm text-body-lg mb-10
CTA Group:           gap-4, flex-row
  - "Explore Collections"   → /products     (btn-primary)
  - "Request a Quote"       → /contact#quote (btn-secondary gold-on-transparent)
```

**Motion — stagger on mount (React 19 compatible):**
```typescript
// Use motion/react — NOT framer-motion
import { motion } from 'motion/react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25,0.1,0.25,1] } }
};
```

**Mobile:** Stack — image `h-[45vh]` on top, jet bg text section below.

---

### SECTION 2 — LIVE METAL PRICE TICKER

**Layout:** Full width strip, `bg-jet border-y border-gold/30`, `h-[52px]`.

**Metal Prices API Route (Next.js 16 Route Handler):**
```typescript
// app/api/metal-prices/route.ts
// In Next.js 16, all dynamic code runs at request time by default

import { NextResponse } from 'next/server';

const GOLD_PURITY: Record<string, number> = {
  '24K': 1,
  '22K': 22 / 24,
  '18K': 18 / 24,
  '14K': 14 / 24,
  '10K': 10 / 24,
  '9K':  9  / 24,
};

export async function GET() {
  try {
    // GoldAPI.io — free tier: https://www.goldapi.io
    // Sign up for free API key
    const res = await fetch(
      'https://www.goldapi.io/api/XAU/INR',
      {
        headers: { 'x-access-token': process.env.GOLD_API_KEY! },
        next: { revalidate: 3600 }, // Cache 1 hour
      }
    );
    const data = await res.json();
    const gold24kPerGram = data.price / 31.1035; // troy oz → grams

    // Silver
    const silverRes = await fetch(
      'https://www.goldapi.io/api/XAG/INR',
      {
        headers: { 'x-access-token': process.env.GOLD_API_KEY! },
        next: { revalidate: 3600 },
      }
    );
    const silverData = await silverRes.json();
    const silver999PerGram = silverData.price / 31.1035;

    return NextResponse.json({
      gold: Object.fromEntries(
        Object.entries(GOLD_PURITY).map(([karat, ratio]) => [
          karat, Math.round(gold24kPerGram * ratio)
        ])
      ),
      silver: {
        '999': Math.round(silver999PerGram),
        '925': Math.round(silver999PerGram * 0.925),
      },
      updatedAt: new Date().toISOString(),
    });
  } catch {
    // Fallback static prices if API fails — never crash the UI
    return NextResponse.json({
      gold: { '24K': 7200, '22K': 6600, '18K': 5400, '14K': 4200, '10K': 3000, '9K': 2700 },
      silver: { '999': 85, '925': 79 },
      updatedAt: null,
      fallback: true,
    });
  }
}
```

**Ticker Component:**
```typescript
// components/home/MetalTicker.tsx — Server Component
// Fetches on server, passes data to client ticker

async function getMetalPrices() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/metal-prices`, { next: { revalidate: 3600 } });
  return res.json();
}

export default async function MetalTicker() {
  const prices = await getMetalPrices();

  const items = [
    `Gold 24K  ₹${prices.gold['24K'].toLocaleString('en-IN')}/g`,
    `Gold 22K  ₹${prices.gold['22K'].toLocaleString('en-IN')}/g`,
    `Gold 18K  ₹${prices.gold['18K'].toLocaleString('en-IN')}/g`,
    `Gold 14K  ₹${prices.gold['14K'].toLocaleString('en-IN')}/g`,
    `Gold 10K  ₹${prices.gold['10K'].toLocaleString('en-IN')}/g`,
    `Silver 925  ₹${prices.silver['925'].toLocaleString('en-IN')}/g`,
    `Silver 999  ₹${prices.silver['999'].toLocaleString('en-IN')}/g`,
  ];

  return <TickerClient items={items} updatedAt={prices.updatedAt} />;
}
```

**Ticker Display:** Auto-scrolling CSS marquee — all items in one long row, `animation: scroll 30s linear infinite`.

---

### SECTION 3 — ABOUT US (`#about`)

**Layout:** 2-col 55/45. `bg-ivory`. `py-32`.

**Left — Layered Image Frame:**
```html
<div class="relative ml-8 mt-8">
  <div class="absolute inset-0 -ml-8 -mt-8 border border-gold/30 z-0" />
  <Image
    src="/images/about/artisan-workshop.jpg"
    alt="Sachi Jewellery craftsmen"
    width={560} height={700}
    class="relative z-10 object-cover w-full"
  />
</div>
```

**Right — Content:**
```
Section label:   "About Sachi Jewellery Co."
Heading:         "A Legacy of Craftsmanship From the Heart of Jaipur"
Body:            2 paragraphs from ABOUT_COMPANY.md

Stat row (3 items, count-up animation on scroll):
  150+    Skilled Craftsmen
  8+      Global Markets
  4       Metal Specialisations

CTA:  "Learn More About Our Story →"  (ghost — text-gold underline hover)
```

**Count-up animation:** Use `motion` `useInView` + custom counter hook:
```typescript
import { useInView, useMotionValue, useSpring } from 'motion/react';
// useInView replaces IntersectionObserver boilerplate
```

---

### SECTION 4 — WHAT WE DO (`#what-we-do`)

**Layout:** `bg-pearl`. `py-32`. Full width.

**Header:** Centered. Label + heading: "End-to-End Fine Jewellery Manufacturing"

**6-card grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`

Each card:
```html
<div class="bg-ivory border border-gold/20 p-8 group hover:border-gold transition-colors duration-300">
  <div class="w-10 h-10 text-gold mb-6"><!-- SVG icon --></div>
  <h3 class="font-[--font-cormorant] text-heading text-charcoal mb-3">Title</h3>
  <p class="text-body text-warm leading-relaxed">Description</p>
</div>
```

**Cards:**
1. OEM / ODM Manufacturing
2. Color Gemstone Expertise
3. Gold & Silver Crafting
4. Beads & Pearl Jewellery
5. Bulk & Custom Orders
6. Global SEZ Export

---

### SECTION 5 — WHY CHOOSE US (`#why-choose-us`)

**Layout:** `bg-jet`. `py-32`. Dark section.

**Header:** Centered. Label in gold. Heading in ivory.

**2-column feature list:**
```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
  <!-- Each item -->
  <div class="flex gap-6">
    <span class="font-[--font-cormorant] text-4xl text-gold/40 leading-none">01</span>
    <div>
      <h4 class="text-ivory font-[--font-cormorant] text-subheading mb-2">In-House Production</h4>
      <p class="text-warm text-body">150 craftsmen under one roof, end-to-end control.</p>
    </div>
  </div>
</div>
```

**6 items:** In-House Production / Gemstone Expertise / Sustainability / CAD Precision / Scalable Mfg. / Trusted Partnerships

---

### SECTION 6 — FEATURED PRODUCTS (`#products`)

**Layout:** `bg-ivory`. `py-32`.

**Header:** Centered. Label: "Our Collections". Heading: "Handpicked From Our Catalogue"

**Grid:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4` — 5×2 = 10 products

**Product Card:**
```typescript
// components/products/ProductCard.tsx
'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useQuoteCart } from '@/store/quoteCart';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useQuoteCart((s) => s.addItem);

  return (
    <motion.div
      className="group relative bg-pearl border border-gold/10 overflow-hidden
                 hover:border-gold/40 transition-colors duration-300"
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden relative">
        <Image
          src={product.images[0] ?? '/images/placeholder-jewellery.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
        {/* Add to Quote button — appears on hover */}
        <button
          onClick={() => addItem(product, product.karats?.[0] ?? '925')}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100
                     transition-opacity duration-300 bg-jet/80 text-gold p-2"
          aria-label="Add to quote"
        >
          {/* Cart icon SVG */}
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-caption text-warm uppercase tracking-widest">
          {product.metal === 'gold' ? product.karats?.[0] ?? '18K' : product.purity?.[0] ?? '925'}
        </span>
        <h3 className="font-[--font-cormorant] text-subheading text-charcoal mt-1">
          {product.name}
        </h3>
        {product.gemstone && (
          <p className="text-caption text-warm mt-1">{product.gemstone}</p>
        )}
      </div>
    </motion.div>
  );
}
```

**Below grid:** `View All Products →` primary button → `/products`

---

### SECTION 7 — PROCESS TEASER

**Layout:** `bg-pearl`. `py-32`.

**Header:** "From Concept to Creation"

**6-step horizontal timeline:**
```
Design Consultation → CAD Modelling → Casting & Forming → Gemstone Setting → QC → Export
```

Each step: gold circle + number + icon + title + 1-line description.

Connecting line: `h-px bg-gold/30` between steps, animated `scaleX: 0 → 1` on scroll.

**CTA:** "See Our Full Process →" → `/process`

---

### SECTION 8 — TESTIMONIALS

**Layout:** `bg-jet`. `py-32`.

**Header:** "Trusted by Buyers Worldwide" (ivory)

**Carousel component:**
```typescript
// components/home/Testimonials.tsx — 'use client'
// Auto-play: 5s interval, manual arrow controls
// Shows 1 testimonial on mobile, 2 on desktop (CSS grid + overflow)
// Use React state — NOT a heavy carousel library
```

**Dummy testimonials (3 cards):**
```
1. "Sachi has been our manufacturing partner for 3 years. Consistent quality, timely delivery."
   — Sarah Mitchell, Wholesale Buyer, UK

2. "The gemstone matching precision is unparalleled. Our customers love every piece."
   — Dmitri Volkov, Jewellery Chain Owner, Russia

3. "From design to delivery, Sachi's process is seamless. Highly recommended."
   — Marie Dupont, Brand Director, France
```

---

### SECTION 9 — FACTORY BENTO GRID

**Layout:** `bg-ivory`. `py-32`.

**Header:** "Inside Our Workshop — 150 Craftsmen, One Vision"

**CSS Grid (bento layout):**
```css
/* Tailwind v4: use inline grid or custom grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(3, 280px);
  gap: 12px;
}
.bento-wide    { grid-column: span 8; }
.bento-tall    { grid-column: span 4; grid-row: span 2; }
.bento-small   { grid-column: span 4; }
.bento-full    { grid-column: span 12; height: 320px; }
```

**Hover effect:** `group-hover:scale-105` on inner image + `border border-transparent group-hover:border-gold/60`.

**Stock image queries (Unsplash):**
- `jewellery workshop artisan jaipur`
- `goldsmith hands setting stone`
- `CAD jewellery ring design`
- `gemstone polishing workshop`
- `fine jewellery collection display`

---

### SECTION 10 — CONTACT CTA STRIP

**Layout:** `bg-gold`. `py-20`. 2-column.

**Left:** "Ready to Start Your Next Collection?" heading + subtext. CTA → `/contact`

**Right:** Inline mini-form: Name + Email + Message. Submits to `/api/contact`.

---

### SECTION 11 — FOOTER

**Layout:** `bg-jet`. `pt-20 pb-10`.

```
Column 1: Logo + tagline + social icons (LinkedIn, Instagram, WhatsApp)
Column 2: Company — About, Process, Certificates, Sustainability
Column 3: Products — Gold, Silver, Brass Jewellery
Column 4: Contact — Address, Email, Phone, WhatsApp link

Bottom bar: border-t border-gold/20 pt-8
  © 2026 Sachi Jewellery Co. All rights reserved.
  Sitapura Industrial Area (SEZ-II), Jaipur, Rajasthan, India
```

---

## 7. PRODUCTS PAGE — `/products`

### Masthead
```
bg-jet, py-32, centered
Heading: "Our Collections"
Subtext: "Gold · Silver · Brass · Gemstones"
```

### Filter Bar (sticky)
```typescript
// 'use client' — filter state lives here
'use client';
import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const METALS = ['All', 'Gold', 'Silver', 'Brass'];
const CATEGORIES = ['All', 'Rings', 'Earrings', 'Pendants', 'Bracelets', 'Bangles', 'Necklaces'];

// AND logic: both filters must match
const filtered = useMemo(() =>
  products.filter(p => {
    const metalMatch = activeMetal === 'All' || p.metal === activeMetal.toLowerCase();
    const catMatch   = activeCategory === 'All' || p.category === activeCategory.toLowerCase();
    return metalMatch && catMatch;
  }),
  [activeMetal, activeCategory]
);
```

**Filter pill style:**
- Active: `bg-gold text-jet`
- Inactive: `border border-gold/30 text-charcoal-light hover:border-gold`
- Transition: `transition-all duration-200`

### Product Grid with AnimatePresence
```typescript
// AnimatePresence from "motion/react" (NOT framer-motion)
<AnimatePresence mode="popLayout">
  {filtered.map((product) => (
    <motion.div
      key={product.id}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <ProductCard product={product} />
    </motion.div>
  ))}
</AnimatePresence>
```

**Grid:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`

---

## 8. QUOTE CART SYSTEM

### Zustand v5 Store

```typescript
// store/quoteCart.ts
// Zustand v5 — create API is unchanged, fully React 19 compatible

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuoteItem {
  product: Product;
  selectedKarat: string;
  quantity: number;
}

interface QuoteCartStore {
  items: QuoteItem[];
  isOpen: boolean;
  addItem:        (product: Product, karat: string, qty?: number) => void;
  removeItem:     (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart:      () => void;
  openCart:       () => void;
  closeCart:      () => void;
}

export const useQuoteCart = create<QuoteCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, karat, qty = 1) => {
        const existing = get().items.find(
          i => i.product.id === product.id && i.selectedKarat === karat
        );
        if (existing) {
          set(s => ({
            items: s.items.map(i =>
              i.product.id === product.id && i.selectedKarat === karat
                ? { ...i, quantity: i.quantity + qty }
                : i
            )
          }));
        } else {
          set(s => ({ items: [...s.items, { product, selectedKarat: karat, quantity: qty }] }));
        }
      },

      removeItem: (productId) =>
        set(s => ({ items: s.items.filter(i => i.product.id !== productId) })),

      updateQuantity: (productId, qty) =>
        set(s => ({
          items: s.items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
        })),

      clearCart:  () => set({ items: [] }),
      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
    }),
    {
      name: 'sachi-quote-cart',
      // Zustand v5 persist works with localStorage
    }
  )
);
```

### Quotation Calculation

```typescript
// lib/quotation.ts

export interface MetalPrices {
  gold: Record<string, number>;   // e.g. { '18K': 5400, '14K': 4200, ... }
  silver: Record<string, number>; // e.g. { '925': 79, '999': 85 }
}

const MAKING_CHARGE_RATE    = 0.25;  // 25% of metal cost  — PLACEHOLDER, replace with client value
const GEMSTONE_FLAT_CHARGE  = 500;   // ₹ per piece        — PLACEHOLDER, replace with client value
const BRASS_PRICE_PER_GRAM  = 0.65;  // ₹/g                — relatively stable commodity price

export function getMetalPricePerGram(
  metal: string,
  karat: string,
  prices: MetalPrices
): number {
  if (metal === 'gold') return prices.gold[karat] ?? prices.gold['18K'];
  if (metal === 'silver') return prices.silver[karat] ?? prices.silver['925'];
  if (metal === 'brass') return BRASS_PRICE_PER_GRAM;
  return 0;
}

export function calculateItemPrice(
  item: QuoteItem,
  prices: MetalPrices
): number {
  const metalRate   = getMetalPricePerGram(item.product.metal, item.selectedKarat, prices);
  const metalCost   = metalRate * item.product.weightGrams;
  const making      = metalCost * MAKING_CHARGE_RATE;
  const gemstone    = item.product.gemstone ? GEMSTONE_FLAT_CHARGE : 0;
  const unitPrice   = metalCost + making + gemstone;
  return Math.round(unitPrice * item.quantity);
}

export function calculateQuoteTotal(items: QuoteItem[], prices: MetalPrices): number {
  return items.reduce((sum, item) => sum + calculateItemPrice(item, prices), 0);
}

// ⚠️ NOTE: Formula uses PLACEHOLDER rates.
// Client will provide: exact making charge %, wastage %, gemstone pricing table.
// Replace the constants above — no structural changes needed.
```

### PDF Generation (jsPDF v3 + jsPDF-autotable v5)

```typescript
// lib/generateQuotePDF.ts  — runs entirely client-side (browser only)

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateQuotePDF(
  items: QuoteItem[],
  prices: MetalPrices,
  companyInfo: { name: string; address: string; email: string; phone: string }
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const now = new Date();
  const quoteRef = `SJ-Q-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SACHI JEWELLERY CO.', 14, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(companyInfo.address, 14, 29);
  doc.text(`${companyInfo.email}  |  ${companyInfo.phone}`, 14, 34);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', 150, 22);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref: ${quoteRef}`, 150, 29);
  doc.text(`Date: ${now.toLocaleDateString('en-IN')}`, 150, 34);

  // Horizontal rule
  doc.setLineWidth(0.5);
  doc.line(14, 40, 196, 40);

  // Table
  autoTable(doc, {
    startY: 46,
    head: [['Sr.', 'Product', 'SKU', 'Metal / Karat', 'Wt. (g)', 'Qty', 'Unit (₹)', 'Total (₹)']],
    body: items.map((item, i) => {
      const unit  = Math.round(calculateItemPrice({ ...item, quantity: 1 }, prices));
      const total = calculateItemPrice(item, prices);
      return [
        i + 1,
        item.product.name,
        item.product.sku,
        `${item.product.metal.charAt(0).toUpperCase() + item.product.metal.slice(1)} ${item.selectedKarat}`,
        item.product.weightGrams.toFixed(1),
        item.quantity,
        `₹${unit.toLocaleString('en-IN')}`,
        `₹${total.toLocaleString('en-IN')}`,
      ];
    }),
    foot: [[
      '', '', '', '', '', '',
      'TOTAL',
      `₹${calculateQuoteTotal(items, prices).toLocaleString('en-IN')}`,
    ]],
    headStyles: { fillColor: [201, 146, 42], textColor: [17, 16, 16], fontStyle: 'bold' },
    footStyles: { fillColor: [249, 246, 239], textColor: [44, 42, 39], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Disclaimer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(
    `Prices based on live metal rates as of ${now.toLocaleString('en-IN')}. This is an indicative quotation only.`,
    14, finalY
  );
  doc.text('Final prices subject to written confirmation from Sachi Jewellery Co.', 14, finalY + 5);

  doc.save(`Sachi_Quote_${quoteRef}.pdf`);
}
```

---

## 9. OUR PROCESS PAGE — `/process`

**Hero:** `bg-jet py-40`. Centered. Heading: "From Concept to Creation". Subtext about manufacturing.

**6 alternating sections (image left/right alternates):**
Each section: `py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center`

```
Step 1  Design Consultation    — Understanding vision, mood boards, samples
Step 2  CAD Modelling          — 3D CAD, rendering, client approval loop
Step 3  Casting & Forming      — Lost-wax casting, metal working, rough shaping
Step 4  Gemstone Setting       — Color matching, hand setting (prong/bezel/pavé)
Step 5  Finishing & Polishing  — Polishing, rhodium plating, QC inspection
Step 6  Export & Delivery      — Packaging, certification, SEZ export, global shipping
```

Each step has: large gold step numeral (Cormorant, `text-8xl text-gold/20`), step title, 2–3 paragraph description, 3 highlight bullets.

**Bottom CTA:** "Ready to Begin Your Collection?" → `/contact`

---

## 10. CERTIFICATES PAGE — `/certificates`

**Header:** "Quality Certifications & Compliance"

**Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`

Each certificate card:
```typescript
<div className="bg-pearl border border-gold/20 p-6 group cursor-pointer
                hover:border-gold transition-colors"
     onClick={() => setActiveCert(cert)}>
  <div className="aspect-[4/3] bg-ivory border border-gold/10 mb-4 relative overflow-hidden">
    <Image src={cert.thumbnail} alt={cert.name} fill className="object-contain p-4" />
  </div>
  <h3 className="font-[--font-cormorant] text-heading text-charcoal">{cert.name}</h3>
  <p className="text-caption text-warm mt-1">{cert.issuingBody}</p>
</div>
```

**Lightbox Modal:**
```typescript
// components/ui/Lightbox.tsx — 'use client'
// Render with AnimatePresence from "motion/react"
// Full-screen overlay: bg-jet/95 backdrop-blur-sm
// Centered image + close button + prev/next arrows
// ESC key closes via useEffect keyboard listener
// ⚠️ No position: fixed in Motion widgets (only in real pages it is fine)
```

**Placeholder certificates:** BIS Hallmark / SEZ Registration / Export House / ISO Quality / GST Registration

---

## 11. CONTACT PAGE — `/contact`

**Layout:** 2-col on desktop (`grid grid-cols-1 lg:grid-cols-2 gap-20`). `bg-ivory py-32`.

**Left — Info:**
- Heading: "Let's Build Something Beautiful Together"
- Address, Email, Phone, WhatsApp
- Google Maps static embed (replace with actual embed)

**Right — Tabs (General Inquiry / Request a Quote):**

```typescript
// components/forms/InquiryForm.tsx
// 'use client'
// react-hook-form v7 + zod v4

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';  // ← IMPORTANT: import from "zod/v4" not "zod"

const inquirySchema = z.object({
  fullName:    z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name required'),
  country:     z.string().min(1, 'Please select your country'),
  email:       z.email('Invalid email address'),
  phone:       z.string().optional(),
  subject:     z.enum(['General Inquiry', 'Partnership', 'Sample Request', 'Other']),
  message:     z.string().min(10, 'Message must be at least 10 characters'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function InquiryForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<InquiryFormData>({ resolver: zodResolver(inquirySchema) });

  const onSubmit = async (data: InquiryFormData) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ ...data, type: 'inquiry' }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) { /* show success toast */ }
  };

  return (/* form JSX */);
}
```

**Contact API Route (Resend):**
```typescript
// app/api/contact/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = await request.json();

  await resend.emails.send({
    from:    'website@sachijewellery.com',
    to:      'contact@sachijewellery.com',
    subject: `New ${body.type === 'inquiry' ? 'Inquiry' : 'Quote Request'} — ${body.companyName}`,
    html:    `
      <h2>New ${body.type} from ${body.fullName}</h2>
      <p><strong>Company:</strong> ${body.companyName}</p>
      <p><strong>Country:</strong> ${body.country}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone ?? '—'}</p>
      <p><strong>Subject:</strong> ${body.subject}</p>
      <p><strong>Message:</strong><br>${body.message}</p>
    `,
  });

  return NextResponse.json({ success: true });
}
```

---

## 12. TYPES FILE

```typescript
// types/index.ts

export interface Product {
  id:          string;
  name:        string;
  sku:         string;
  metal:       'gold' | 'silver' | 'brass';
  category:    'rings' | 'earrings' | 'pendants' | 'bracelets' | 'bangles' | 'necklaces';
  karats?:     ('9K' | '10K' | '14K' | '18K' | '22K' | '24K')[];   // for gold
  purity?:     ('925' | '999')[];                                     // for silver
  gemstone?:   string;
  weightGrams: number;
  images:      string[];
  description: string;
  featured:    boolean;
}

export interface MetalPrices {
  gold:   Record<string, number>;
  silver: Record<string, number>;
  updatedAt: string | null;
}

export interface QuoteItem {
  product:       Product;
  selectedKarat: string;
  quantity:      number;
}

export interface Certificate {
  id:          string;
  name:        string;
  issuingBody: string;
  thumbnail:   string;
  fullImage:   string;
  validity?:   string;
}
```

---

## 13. FULL FILE & FOLDER STRUCTURE

```
sachi-jewellery/
├── app/
│   ├── layout.tsx                   # Root layout — fonts, metadata, floating buttons
│   ├── page.tsx                     # Home (Server Component — imports home sections)
│   ├── globals.css                  # Tailwind v4 @import + @theme + @utility
│   ├── products/
│   │   └── page.tsx                 # 'use client' — filters + AnimatePresence
│   ├── process/
│   │   └── page.tsx                 # Server Component
│   ├── certificates/
│   │   └── page.tsx                 # 'use client' — lightbox state
│   ├── contact/
│   │   └── page.tsx                 # Server Component (forms are client components)
│   └── api/
│       ├── metal-prices/
│       │   └── route.ts             # GoldAPI fetch + revalidate 3600
│       └── contact/
│           └── route.ts             # Resend email handler
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx               # 'use client' — scroll state
│   │   ├── Footer.tsx               # Server Component
│   │   ├── FloatingWhatsApp.tsx     # 'use client' — fixed bottom-left
│   │   └── FloatingQuoteCart.tsx    # 'use client' — Zustand, fixed bottom-right
│   │
│   ├── home/
│   │   ├── HeroSection.tsx          # 'use client' — Motion stagger on mount
│   │   ├── MetalTicker.tsx          # Server Component (async data fetch)
│   │   ├── TickerClient.tsx         # 'use client' — CSS marquee animation
│   │   ├── AboutSection.tsx         # 'use client' — scroll reveal + count-up
│   │   ├── WhatWeDoSection.tsx      # 'use client' — card stagger
│   │   ├── WhyChooseUsSection.tsx   # 'use client' — scroll reveal
│   │   ├── FeaturedProducts.tsx     # Server Component (static data) + ProductCard
│   │   ├── ProcessTeaser.tsx        # 'use client' — timeline animation
│   │   ├── Testimonials.tsx         # 'use client' — carousel state
│   │   ├── FactoryBento.tsx         # 'use client' — hover effects
│   │   └── ContactCTAStrip.tsx      # 'use client' — inline mini-form
│   │
│   ├── products/
│   │   ├── ProductCard.tsx          # 'use client' — Zustand addItem
│   │   ├── ProductFilters.tsx       # Part of products/page.tsx
│   │   └── ProductModal.tsx         # 'use client' — product detail modal
│   │
│   ├── quote/
│   │   ├── QuoteCartDrawer.tsx      # 'use client' — slide-in, Zustand
│   │   ├── QuoteItemRow.tsx         # Child of drawer
│   │   └── QuoteSummary.tsx         # Live price breakdown
│   │
│   ├── ui/
│   │   ├── ScrollReveal.tsx         # Motion whileInView wrapper
│   │   ├── Lightbox.tsx             # 'use client' — certificates
│   │   ├── GoldDivider.tsx          # Animated h-px w-16 bg-gold
│   │   ├── SectionLabel.tsx         # Gold uppercase label
│   │   └── CountUp.tsx              # Animated number counter (motion/react useSpring)
│   │
│   └── forms/
│       ├── InquiryForm.tsx          # 'use client' — RHF + Zod v4
│       └── QuoteRequestForm.tsx     # 'use client' — RHF + Zod v4 + PDF download
│
├── store/
│   └── quoteCart.ts                 # Zustand v5 + persist
│
├── lib/
│   ├── quotation.ts                 # Price calc (placeholder formula)
│   ├── generateQuotePDF.ts          # jsPDF v3 + autotable v5 (client-side)
│   └── metalPrices.ts               # Fetch helpers + types
│
├── data/
│   └── products.ts                  # Static product array (20 items)
│
├── types/
│   └── index.ts                     # Product, QuoteItem, MetalPrices, Certificate
│
├── public/
│   ├── logo.png                     # Sachi logo (provided)
│   └── images/
│       ├── hero/
│       ├── about/
│       ├── factory/
│       ├── process/
│       ├── products/                # Product images (filename = sku.jpg)
│       └── certificates/
│
├── next.config.ts                   # (TypeScript — native in Next.js 16)
├── postcss.config.mjs               # @tailwindcss/postcss plugin
├── tsconfig.json
├── package.json
└── .env.local
```

---

## 14. PRODUCT MOCK DATA (20 Items — Starter Catalogue)

```typescript
// data/products.ts
import type { Product } from '@/types';

export const products: Product[] = [
  // === GOLD — RINGS ===
  { id: 'gr-001', name: 'Sapphire Solitaire Ring', sku: 'SJ-GR-001',
    metal: 'gold', category: 'rings', karats: ['14K', '18K'],
    gemstone: 'Blue Sapphire', weightGrams: 4.2,
    images: ['/images/products/SJ-GR-001.jpg'],
    description: 'Classic blue sapphire in four-prong gold setting.', featured: true },

  { id: 'gr-002', name: 'Twisted Band Ring', sku: 'SJ-GR-002',
    metal: 'gold', category: 'rings', karats: ['10K', '14K', '18K'],
    weightGrams: 3.8, images: [],
    description: 'Minimalist twisted gold band in multiple karats.', featured: true },

  // === GOLD — EARRINGS ===
  { id: 'ge-001', name: 'Emerald Drop Earrings', sku: 'SJ-GE-001',
    metal: 'gold', category: 'earrings', karats: ['18K'],
    gemstone: 'Created Emerald', weightGrams: 5.1, images: [],
    description: 'Cascading emerald drops in 18K gold.', featured: true },

  { id: 'ge-002', name: 'White Topaz Stud Earrings', sku: 'SJ-GE-002',
    metal: 'gold', category: 'earrings', karats: ['14K', '18K'],
    gemstone: 'White Topaz', weightGrams: 2.4, images: [],
    description: 'Round-cut white topaz studs — timeless.', featured: false },

  // === GOLD — PENDANTS ===
  { id: 'gp-001', name: 'Amethyst Teardrop Pendant', sku: 'SJ-GP-001',
    metal: 'gold', category: 'pendants', karats: ['14K', '18K'],
    gemstone: 'Amethyst', weightGrams: 3.2, images: [],
    description: 'Delicate amethyst teardrop in bezel setting.', featured: true },

  // === GOLD — NECKLACE ===
  { id: 'gn-001', name: 'Citrine Station Necklace', sku: 'SJ-GN-001',
    metal: 'gold', category: 'necklaces', karats: ['14K'],
    gemstone: 'Citrine', weightGrams: 12.5, images: [],
    description: 'Delicate gold chain with citrine station stones.', featured: true },

  // === SILVER — RINGS ===
  { id: 'sr-001', name: 'Moonstone Stackable Ring', sku: 'SJ-SR-001',
    metal: 'silver', category: 'rings', purity: ['925'],
    gemstone: 'Rainbow Moonstone', weightGrams: 3.0, images: [],
    description: 'Dainty moonstone ring, stackable.', featured: true },

  { id: 'sr-002', name: 'Labradorite Wide Band', sku: 'SJ-SR-002',
    metal: 'silver', category: 'rings', purity: ['925'],
    gemstone: 'Labradorite', weightGrams: 5.5, images: [],
    description: 'Statement wide band with labradorite cabochon.', featured: false },

  // === SILVER — EARRINGS ===
  { id: 'se-001', name: 'Turquoise Hoop Earrings', sku: 'SJ-SE-001',
    metal: 'silver', category: 'earrings', purity: ['925'],
    gemstone: 'Turquoise', weightGrams: 6.0, images: [],
    description: 'Oxidised silver hoops with turquoise inlay.', featured: true },

  // === SILVER — NECKLACE ===
  { id: 'sn-001', name: 'Pearl Station Necklace', sku: 'SJ-SN-001',
    metal: 'silver', category: 'necklaces', purity: ['925'],
    gemstone: 'Freshwater Pearl', weightGrams: 8.5, images: [],
    description: 'Delicate silver chain with pearl stations.', featured: true },

  // === SILVER — BRACELET ===
  { id: 'sb-001', name: 'Garnet Tennis Bracelet', sku: 'SJ-SB-001',
    metal: 'silver', category: 'bracelets', purity: ['925'],
    gemstone: 'Red Garnet', weightGrams: 9.2, images: [],
    description: 'Classic prong-set garnet tennis bracelet.', featured: true },

  // === SILVER — PENDANT ===
  { id: 'sp-001', name: 'Lapis Lazuli Oval Pendant', sku: 'SJ-SP-001',
    metal: 'silver', category: 'pendants', purity: ['925'],
    gemstone: 'Lapis Lazuli', weightGrams: 4.8, images: [],
    description: 'Bold oval lapis pendant in silver bezel.', featured: false },

  // === SILVER — BANGLE ===
  { id: 'sbg-001', name: 'Chalcedony Bangle', sku: 'SJ-SBG-001',
    metal: 'silver', category: 'bangles', purity: ['925'],
    gemstone: 'Blue Chalcedony', weightGrams: 14.0, images: [],
    description: 'Light blue chalcedony set in adjustable silver bangle.', featured: false },

  // === BRASS — EARRINGS ===
  { id: 'bre-001', name: 'Lapis Chandelier Earrings', sku: 'SJ-BRE-001',
    metal: 'brass', category: 'earrings',
    gemstone: 'Lapis Lazuli', weightGrams: 7.8, images: [],
    description: 'Gold-plated chandelier earrings with lapis drops.', featured: false },

  // === BRASS — BANGLE ===
  { id: 'brb-001', name: 'Malachite Cuff Bangle', sku: 'SJ-BRB-001',
    metal: 'brass', category: 'bangles',
    gemstone: 'Malachite', weightGrams: 18.0, images: [],
    description: 'Bold malachite inlay on gold-plated brass cuff.', featured: false },

  // === BRASS — PENDANT ===
  { id: 'brp-001', name: 'Onyx Geometric Pendant', sku: 'SJ-BRP-001',
    metal: 'brass', category: 'pendants',
    gemstone: 'Black Onyx', weightGrams: 5.5, images: [],
    description: 'Modern geometric black onyx pendant on brass.', featured: false },

  // === BRASS — RING ===
  { id: 'brr-001', name: 'Tiger Eye Cocktail Ring', sku: 'SJ-BRR-001',
    metal: 'brass', category: 'rings',
    gemstone: "Tiger's Eye", weightGrams: 8.0, images: [],
    description: "Statement cocktail ring with tiger's eye cab.", featured: false },

  // === BRASS — NECKLACE ===
  { id: 'brn-001', name: 'Howlite Layering Necklace', sku: 'SJ-BRN-001',
    metal: 'brass', category: 'necklaces',
    gemstone: 'White Howlite', weightGrams: 10.0, images: [],
    description: 'Boho layering necklace with howlite stones.', featured: false },

  // === GOLD — BRACELET ===
  { id: 'gbr-001', name: 'Ruby Charm Bracelet', sku: 'SJ-GBR-001',
    metal: 'gold', category: 'bracelets', karats: ['14K', '18K'],
    gemstone: 'Created Ruby', weightGrams: 7.6, images: [],
    description: 'Elegant ruby charm bracelet in gold.', featured: true },

  // === GOLD — BANGLE ===
  { id: 'gbg-001', name: 'Diamond-Cut Gold Bangle', sku: 'SJ-GBG-001',
    metal: 'gold', category: 'bangles', karats: ['18K', '22K'],
    weightGrams: 16.0, images: [],
    description: 'Classic diamond-cut bangle in 18K/22K gold.', featured: true },
];

export const featuredProducts = products.filter(p => p.featured).slice(0, 10);
```

---

## 15. ENVIRONMENT VARIABLES

```bash
# .env.local  — NEVER commit this file

# === METAL PRICE API ===
GOLD_API_KEY=your_goldapi_io_key
# Sign up free at: https://www.goldapi.io
# Free tier: 100 requests/month (sufficient with 1h caching)

# === EMAIL ===
RESEND_API_KEY=your_resend_key
# Sign up at: https://resend.com (free: 3,000 emails/month)

# === CONTACT ===
NEXT_PUBLIC_WHATSAPP_NUMBER=919XXXXXXXXX     # country code, no +

# === COMPANY (public — safe to expose) ===
NEXT_PUBLIC_COMPANY_NAME="Sachi Jewellery Co."
NEXT_PUBLIC_COMPANY_ADDRESS="Sitapura Industrial Area (SEZ-II), Jaipur, Rajasthan, India"
NEXT_PUBLIC_COMPANY_EMAIL=contact@sachijewellery.com
NEXT_PUBLIC_COMPANY_PHONE=+91-XXXXXXXXXX

# === APP URL (used for server-side API calls) ===
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Change to https://sachijewellery.com in production
```

---

## 16. SEO METADATA

```typescript
// app/layout.tsx
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#C9922A',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sachijewellery.com'),
  title: {
    default: 'Sachi Jewellery Co. — Fine Jewellery Manufacturer & Exporter, Jaipur',
    template: '%s | Sachi Jewellery Co.',
  },
  description:
    'Sachi Jewellery Co. — Leading fine jewellery manufacturer, wholesaler and exporter from Jaipur, India. Gold, Silver & Brass jewellery with color gemstones. OEM/ODM partner for global brands.',
  keywords: [
    'jewellery manufacturer India', 'gold jewellery wholesaler Jaipur',
    'silver jewellery exporter', 'gemstone jewellery OEM', 'fine jewellery manufacturer',
    'SEZ jewellery exporter', 'colour gemstone jewellery', 'jewellery ODM India',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Sachi Jewellery Co.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};
```

Per-page metadata example:
```typescript
// app/products/page.tsx
export const metadata: Metadata = {
  title: 'Our Collections',
  description: 'Browse our full catalogue of gold, silver and brass jewellery with gemstones.',
};
```

---

## 17. PERFORMANCE NOTES

| Topic | Guidance |
|---|---|
| Images | Always use `next/image` with `sizes` prop. Set `priority` on hero image only. Use `loading="lazy"` on everything else (default). |
| Fonts | `next/font/google` handles subsetting + preloading. Never import fonts from `<link>` tags. |
| Metal prices cache | `next: { revalidate: 3600 }` in the fetch call. Falls back to static values on failure. |
| Motion bundle | `motion/react` is tree-shakable. Only import what you use. Avoid importing the full package. |
| React Compiler | Enabled in `next.config.ts` — auto-memoises components. Remove manual `useMemo`/`useCallback` where redundant. |
| Product data | Starts as static JSON — zero DB overhead. When catalogue grows, migrate to Sanity CMS or a simple JSON API. |
| PDF generation | jsPDF runs entirely in the browser — no server load. Import dynamically: `const { generateQuotePDF } = await import('@/lib/generateQuotePDF')` |
| Tailwind v4 | No `purge`/`content` config needed — auto content detection. No `tailwind.config.js` needed. |

---

## 18. IMPLEMENTATION ORDER (30-Step Sequence)

```
╔══════════════════════════════════════════════════╗
║  PHASE 1 — FOUNDATION (do this first, entirely)  ║
╚══════════════════════════════════════════════════╝
 1. Create Next.js 16 app (no --tailwind flag)
 2. Install Tailwind v4 + postcss.config.mjs
 3. Write globals.css (@import, @theme, @utility, @keyframes)
 4. next.config.ts (reactCompiler, images)
 5. Root layout.tsx (fonts, metadata, viewport)
 6. Types file (types/index.ts)
 7. Product mock data (data/products.ts — 20 items)
 8. Navbar component (transparent → scrolled)
 9. Footer component
10. FloatingWhatsApp + FloatingQuoteCart buttons
11. ScrollReveal wrapper (motion/react whileInView)

╔══════════════════════════════════════════════════╗
║  PHASE 2 — HOME PAGE                            ║
╚══════════════════════════════════════════════════╝
12. HeroSection (split-screen, Ken Burns, stagger)
13. /api/metal-prices route + MetalTicker + TickerClient
14. AboutSection (layered frame, count-up)
15. WhatWeDoSection (6-card grid, stagger)
16. WhyChooseUsSection (dark bg, feature list)
17. FeaturedProducts (5×2 grid, ProductCard stub)
18. ProcessTeaser (timeline animation)
19. Testimonials (carousel)
20. FactoryBento (bento grid, hover effects)
21. ContactCTAStrip (gold bg, mini form)

╔══════════════════════════════════════════════════╗
║  PHASE 3 — QUOTE SYSTEM + PRODUCTS              ║
╚══════════════════════════════════════════════════╝
22. Zustand v5 quote cart store (with persist)
23. ProductCard (full version with Add-to-Quote)
24. Products page (/products) with filters + AnimatePresence
25. QuoteCartDrawer (slide-in panel)
26. lib/quotation.ts (price calculation)
27. lib/generateQuotePDF.ts (jsPDF v3)

╔══════════════════════════════════════════════════╗
║  PHASE 4 — INNER PAGES                          ║
╚══════════════════════════════════════════════════╝
28. /process page (6 alternating sections)
29. /certificates page + Lightbox
30. /contact page + InquiryForm + QuoteRequestForm + /api/contact

╔══════════════════════════════════════════════════╗
║  PHASE 5 — POLISH                               ║
╚══════════════════════════════════════════════════╝
 31. Audit all Motion animations (once: true, no jank)
 32. Mobile responsiveness pass (desktop-first, fix breakpoints)
 33. SEO per-page metadata
 34. next/image sizes audit (correct sizes prop on every image)
 35. Environment variable check (all keys in .env.local)
```

---

## 19. CRITICAL NOTES FOR AI CODING ASSISTANTS

1. **Motion import:** ALWAYS use `import { motion, AnimatePresence, useInView } from "motion/react"`. NEVER `from "framer-motion"` — that package is outdated.

2. **Tailwind v4:** NO `tailwind.config.js`. All theme tokens in `globals.css` under `@theme {}`. Use `@utility` instead of `@layer utilities`. Color classes are auto-generated from `--color-*` tokens.

3. **Next.js 16 async params:** ALL page `params` and `searchParams` are Promises. Always `await props.params`.

4. **Zod v4:** Import `from 'zod/v4'` not `from 'zod'` — some APIs changed (e.g., `.email()` instead of `.string().email()`).

5. **React Compiler:** Don't add manual `memo()`, `useMemo()`, `useCallback()` unless profiling shows a specific problem. The compiler handles this.

6. **Server vs Client Components:**
   - Pages with static/fetched data → Server Components (default)
   - Anything with `useState`, `useEffect`, `motion`, Zustand → must be `'use client'`
   - Data-fetching components (MetalTicker) → Server Component that passes data to a `'use client'` child

7. **PDF generation is browser-only.** Import `generateQuotePDF` dynamically to avoid SSR errors:
   ```typescript
   const { generateQuotePDF } = await import('@/lib/generateQuotePDF');
   ```

8. **Z-index layers:**
   ```
   Navbar:            z-50
   Quote Drawer:      z-40
   Lightbox:          z-40
   Floating buttons:  z-30
   ```

9. **No `position: fixed` inside Motion-rendered iframes** — this only matters for the design/artifact previews, not the real website. Real pages can use `position: fixed` normally.

10. **The quotation formula uses placeholder values.** The constants in `lib/quotation.ts` (`MAKING_CHARGE_RATE`, `GEMSTONE_FLAT_CHARGE`) will be replaced by the client. Do not hardcode these anywhere else.

---

*Document Version 2.0 — Updated for Next.js 16.2 · Tailwind CSS v4 · React 19.2 · Motion v12 · Zustand v5 · Zod v4*
*All placeholder data (prices, contacts, product images, certificates) to be replaced by client before launch.*
*Prepared for Sachi Jewellery Co. Website Development — April 2026*
