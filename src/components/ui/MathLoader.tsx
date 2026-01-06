"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const symbols = ["∞", "π", "∑", "∫", "√", "≠", "≈", "∆"];

export default function MathLoader({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % symbols.length);
    }, 800); // Slower animation (800ms)
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "text-lg w-6 h-6",
    md: "text-2xl w-10 h-10",
    lg: "text-5xl md:text-7xl w-20 h-20 md:w-24 md:h-24" // Responsive size
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
        transition={{ duration: 0.2 }}
        className={`font-bold text-[#00f0ff] flex items-center justify-center ${sizeClasses[size]}`}
      >
        {symbols[index]}
      </motion.div>
    </div>
  );
}
