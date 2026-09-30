"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square relative overflow-hidden bg-ivory border border-gold/10 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex] ?? "/images/products/placeholder.jpg"}
              alt={productName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`aspect-square relative overflow-hidden border transition-colors ${currentIndex === idx ? "border-gold" : "border-gold/10 hover:border-gold/40"}`}
            >
              <Image
                src={img}
                alt={`${productName} view ${idx + 1}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
