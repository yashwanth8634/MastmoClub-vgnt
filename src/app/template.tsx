"use client";

import React from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";

type TemplateProps = {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  disableAnimation?: boolean;
  variants?: Variants;
};

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.995,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      opacity: { duration: 0.45, ease: [0.22, 0.1, 0.36, 1] },
      y: { duration: 0.6, ease: [0.22, 0.1, 0.36, 1] },
      filter: { duration: 0.6, ease: [0.22, 0.1, 0.36, 1] },
      scale: { duration: 0.6, ease: [0.22, 0.1, 0.36, 1] },
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    filter: "blur(4px)",
    transition: { duration: 0.35, ease: [0.22, 0.1, 0.36, 1] },
  },
};

const Template = React.memo(
  React.forwardRef<HTMLDivElement, TemplateProps>(function Template(
    {
      children,
      className = "",
      duration = 0.6,
      delay = 0,
      disableAnimation = false,
      variants,
    },
    ref
  ) {
    const prefersReduced = useReducedMotion();
    const reduceMotion = prefersReduced || disableAnimation;

    const mergedVariants: Variants = variants
  ? {
      hidden: {
        ...defaultVariants.hidden,
        ...(variants.hidden as any),
      },
      visible: {
        ...defaultVariants.visible,
        ...(variants.visible as any),
        transition: {
          ...(defaultVariants.visible as any).transition,
          ...(variants.visible ? (variants.visible as any).transition : {}),
        },
      },
      exit: {
        ...defaultVariants.exit,
        ...(variants.exit as any),
      },
    }
  : defaultVariants;

    if (reduceMotion) {
      return (
        <div
          ref={ref}
          className={className}
          style={{
            opacity: 1,
            transform: "translateY(0px) scale(1)",
            filter: "blur(0px)",
            willChange: "auto",
          }}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={mergedVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration,
          delay,
          ease: [0.22, 0.1, 0.36, 1],
        }}
        style={{
          willChange: "opacity, transform, filter",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </motion.div>
    );
  })
);

export default Template;