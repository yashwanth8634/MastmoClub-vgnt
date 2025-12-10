"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { ArrowRight, Brain, Calculator, Code2, Sigma } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- COMPONENTS FOR EACH SECTION ---

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6 snap-start">
      <div className="text-center max-w-4xl mx-auto mt-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-6 px-4 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10"
        >
          <span className="text-[#00f0ff] text-xs font-bold tracking-[0.2em] uppercase">
            VGNT Campus Chapter
          </span>
        </motion.div>

        {/* Big Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6"
        >
          MASTMO<span className="text-[#00f0ff]">.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#00f0ff] text-lg md:text-xl font-mono tracking-widest uppercase mb-10"
        >
          Mathematical & Statistical Modeling
        </motion.p>
        <p className="block md:hidden text-gray-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed font-light">
          We code the equations that define the future. Bridging abstract math
          with real-world engineering at Vignan.
        </p>

        {/* DESKTOP VERSION */}
        <p className="hidden md:block text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          We are the architects of logic at Vignan.{" "}
          <strong className="text-gray-200">MASTMO</strong> bridges the gap
          between abstract theorems and real-world engineering challenges. From
          complex algorithms to statistical data science, we code the equations
          that define the future.
        </p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <Link
            href="/events"
            className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-[#00f0ff] transition-all duration-300 flex items-center gap-2"
          >
            Explore Events <ArrowRight size={20} />
          </Link>
          <Link
            href="/join"
            className="px-10 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Become a Member
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-500 md:hidden">
            Scroll to Explore
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#00f0ff] to-transparent md:hidden"></div>
        </motion.div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 snap-start">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Big Typography */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            We don't just solve problems. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-purple-500">
              We model reality.
            </span>
          </h2>
          <div className="h-1 w-20 bg-[#00f0ff] mb-8"></div>
        </motion.div>

        {/* Right: Glass Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-black border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm"
        >
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            <strong className="text-white">MASTMO</strong> is the intersection
            where pure mathematics meets computer science. We exist to decode
            the patterns of the universe using code.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            From <strong>Graph Theory</strong> to{" "}
            <strong>Neural Networks</strong>, we provide a platform for students
            to apply abstract theorems to real-world engineering challenges.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const DomainsSection = () => {
  const domains = [
    {
      icon: Calculator,
      title: "Pure Mathematics",
      desc: "Calculus, Linear Algebra, and Number Theory.",
    },
    {
      icon: Code2,
      title: "Algorithmic Logic",
      desc: "Data Structures, Competitive Programming, and Optimization.",
    },
    {
      icon: Brain,
      title: "Machine Learning",
      desc: "Statistical Modeling, Neural Nets, and Predictive AI.",
    },
    {
      icon: Sigma,
      title: "Data Science",
      desc: "Big Data Analysis, Probability, and Visualization.",
    },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 py-20 snap-start">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Domains</h2>
          <p className="text-gray-400">The four pillars of the club.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-black border border-white/10 p-8 rounded-2xl hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 transition-all group"
            >
              <d.icon
                size={40}
                className="text-gray-500 group-hover:text-[#00f0ff] mb-6 transition-colors"
              />
              <h3 className="text-xl font-bold text-white mb-2">{d.title}</h3>
              <p className="text-gray-400 text-sm">{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FooterSection = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/10 bg-black/90 backdrop-blur-xl snap-end">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        {/* Left Side: Branding & Supported By */}
        <div className="text-center md:text-left flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white tracking-widest">
            MASTMO CLUB
          </h2>

          {/* Replaced Text with Logo Block */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              Supported By
            </span>
            <div className="relative w-32 h-10 opacity-90">
              <Image
                src="/vgnt-logo.png"
                alt="VGNT Logo"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
              />
            </div>
          </div>
        </div>

        {/* Center: Links */}
        <div className="flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <Link href="/events" className="hover:text-[#00f0ff]">
            Events
          </Link>
          <Link href="/team" className="hover:text-[#00f0ff]">
            Team
          </Link>
          <Link href="/join" className="hover:text-[#00f0ff]">
            Join
          </Link>
        </div>

        {/* Right: Copyright */}
        <div className="text-xs text-gray-600">
          © 2025 MASTMO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  return (
    <main className="relative bg-transparent text-white font-sans selection:bg-[#00f0ff]/30">
      <Navbar />

      {/* The content is now divided into clear "Screens" (Sections).
        The global StarField in layout.tsx will be visible behind all of this.
      */}
      <div className="flex flex-col gap-0">
        <HeroSection />
        <AboutSection />
        <DomainsSection />
        <FooterSection />
      </div>
    </main>
  );
}
