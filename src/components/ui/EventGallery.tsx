"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
// import { cn } from "@/lib/utils"; // Ensure you have utils, or remove cn and use standard strings

// Define the shape of an image object
export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export default function EventGallery({ images }: { images: GalleryImage[] }) {
  // Default to the middle image being active
  const [activeImage, setActiveImage] = useState<number | null>(Math.floor(images.length / 2));

  if (!images || images.length === 0) return null;

  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="relative w-full max-w-7xl">
        <div className="flex w-full items-center justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 hover:border-[#00f0ff]/50 transition-colors ${
                activeImage === index ? "shadow-[0_0_30px_rgba(0,240,255,0.2)]" : ""
              }`}
              // Animation Logic
              initial={{ width: "4rem", height: "16rem" }} // Mobile default
              animate={{
                width: activeImage === index ? "24rem" : "4rem", // Expand active
                height: "18rem", // Fixed height for consistency
                opacity: activeImage === index ? 1 : 0.6, // Dim inactive ones
              }}
              // Responsive adjustments for larger screens
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              onClick={() => setActiveImage(index)}
              onMouseEnter={() => setActiveImage(index)}
            >
              {/* Overlay Gradient for Text */}
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"
                  />
                )}
              </AnimatePresence>

              {/* Caption Text */}
              <AnimatePresence>
                {activeImage === index && image.caption && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-0 left-0 w-full p-4 z-20"
                  >
                    <p className="text-sm font-bold text-[#00f0ff] uppercase tracking-widest">
                      {image.caption}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Image */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}