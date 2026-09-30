import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import SiteTheme from "@/components/layout/SiteTheme";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-next",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans-next",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#C9922A",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default:
      "Sachi Jaipur — Fine Jewellery Manufacturer, Jaipur",
    template: "%s | Sachi Jaipur",
  },
  description:
    "Sachi Jaipur — Leading fine jewellery manufacturer and wholesaler from Jaipur, India.",
  keywords: [
    "jewellery manufacturer India",
    "gold jewellery wholesaler Jaipur",
    "silver jewellery Jaipur",
    "gemstone jewellery OEM",
    "fine jewellery manufacturer",
    "colour gemstone jewellery",
    "jewellery ODM India",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sachi Jaipur",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <SiteTheme />
      </head>
      <body className="font-sans antialiased bg-ivory text-charcoal">
        {children}
      </body>
    </html>
  );
}
