"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useQuoteCart } from "@/store/quoteCart";
import { Product } from "@/types";
import { normalizeR2Image } from "@/lib/r2/config";

interface Props {
  product: Product;
  isGuest?: boolean;
  onGuestAction?: () => void;
}

function productHref(product: Product) {
  const key = product.sku?.trim() || product.id;
  return `/products/${encodeURIComponent(key)}`;
}

export default function ProductCard({ product, isGuest = false, onGuestAction }: Props) {
  const addItem = useQuoteCart((s) => s.addItem);
  const imgSrc  = normalizeR2Image(product.images?.[0]) ?? "/image.png";
  const href    = productHref(product);

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isGuest) {
      onGuestAction?.();
      return;
    }
    const karat = product.purityOptions?.[0] ?? "925";
    const metal = product.metalColorOptions?.[0] ?? "Yellow Gold";
    const stone = product.availableStones?.[0] ?? "None";
    addItem(product, karat, metal, stone, 1);
  };

  return (
    <motion.div
      className="group relative bg-pearl border border-gold/10 overflow-hidden hover:border-gold/40 transition-colors duration-300 flex flex-col h-full"
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
    >
      <Link
        href={href}
        className="block relative w-full aspect-square bg-ivory overflow-hidden"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </Link>

      {/* Add to Quote button */}
      <button
        onClick={handleAddToQuote}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300 bg-jet/80 text-gold p-2 hover:bg-jet hover:text-gold-light"
        aria-label={isGuest ? "Login to add to quote" : "Add to quote"}
        title={isGuest ? "Login to add to quote" : "Add to quote"}
      >
        {isGuest ? (
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        ) : (
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        )}
      </button>

      {/* Info */}
      <div className="p-4 grow flex flex-col">
        <span className="text-caption text-warm uppercase tracking-widest">
          {product.purityOptions?.[0] ?? product.baseMetal}
        </span>
        <Link href={href} className="hover:text-gold transition-colors">
          <h3 className="font-dm-sans text-sm font-medium text-charcoal mt-1 line-clamp-1 uppercase tracking-tight">
            {product.name}
          </h3>
        </Link>
        {product.primaryGemstone && (
          <p className="text-caption text-warm mt-1 line-clamp-1">{product.primaryGemstone}</p>
        )}
      </div>
    </motion.div>
  );
}
