"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const symbols = ["∞", "π", "∑", "∫", "√", "≠", "≈", "∆"];

export default function MathLoader({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % symbols.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "w-6 h-6 text-lg",
    md: "w-10 h-10 text-2xl",
    lg: "w-20 h-20 md:w-24 md:h-24 text-5xl md:text-7xl",
  };

  return (
    <div
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: index === 0 ? 1 : 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center font-bold text-math-cyan"
        >
          {symbols[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
