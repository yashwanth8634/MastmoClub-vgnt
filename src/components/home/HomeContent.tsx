"use client"; // 👈 Keeps the animations working!

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Brain, Calculator, Code2, Sigma } from "lucide-react";
import { motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";

// --- HERO SECTION ---
const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6 snap-start">
      <div className="text-center max-w-4xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-6 px-4 py-1 rounded-full border border-[#00f0ff]/50 bg-[#00f0ff]/10"
        >
          <span className="text-[#00f0ff] text-xs font-bold tracking-[0.2em] uppercase">
            VGNT Campus Chapter
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6"
        >
          MASTMO<span className="text-[#00f0ff]">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#00f0ff] text-lg md:text-xl font-mono tracking-widest uppercase mb-10"
        >
          Mathematical & Statistical Modeling
        </motion.p>
        
             <p className="block md:hidden text-gray-300 text-sm max-w-xs mx-auto mb-8 leading-relaxed font-light">
          We code the equations that define the future. Bridging abstract math
          with real-world engineering at Vignan.
        </p>

        {/* DESKTOP VERSION */}
        <p className="hidden md:block text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          We are the architects of logic at Vignan.{" "}
          <strong className="text-gray-200">MASTMO</strong> bridges the gap
          between abstract theorems and real-world engineering challenges. From
          complex algorithms to statistical data science, we code the equations
          that define the future.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <Link
            href="/events"
            className="px-10 py-4 bg-white text-black font-bold rounded-full border-white/80 hover:bg-[#00f0ff] transition-all duration-300 flex items-center gap-2"
          >
            Explore Events <ArrowRight size={20} />
          </Link>
          <Link
            href="/join"
            className="px-10 py-4 border border-white/80 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Become a Member
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// --- ABOUT SECTION ---
const AboutSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 snap-start">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-black border border-white/40 p-8 md:p-12 rounded-3xl backdrop-blur-sm"
        >
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            <strong className="text-white">MASTMO</strong> is the intersection
            where pure mathematics meets computer science. We exist to decode
            the patterns of the universe using code.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// --- DOMAINS SECTION ---
const DomainsSection = () => {
  const domains = [
    { icon: Calculator, title: "Pure Mathematics", desc: "Calculus, Linear Algebra, and Number Theory." },
    { icon: Code2, title: "Algorithmic Logic", desc: "Data Structures, Competitive Programming, and Optimization." },
    { icon: Brain, title: "Machine Learning", desc: "Statistical Modeling, Neural Nets, and Predictive AI." },
    { icon: Sigma, title: "Data Science", desc: "Big Data Analysis, Probability, and Visualization." },
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
          <p className="text-gray-300">The four pillars of the club.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-black border border-white/40 p-8 rounded-2xl hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 transition-all group"
            >
              <d.icon size={40} className="text-gray-500 group-hover:text-[#00f0ff] mb-6 transition-colors" />
              <h3 className="text-xl font-bold text-white mb-2">{d.title}</h3>
              <p className="text-gray-300 text-sm">{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- FOOTER SECTION ---
// --- ENHANCED FOOTER SECTION ---
const FooterSection = () => {
  return (
    <footer className="py-12 md:py-20 px-4 sm:px-6 border-t border-white/40 bg-black/90 backdrop-blur-xl snap-end">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10 lg:gap-16 mb-10">
          
          {/* Left Section - Club Info */}
          <div className="text-center lg:text-left flex flex-col gap-6 w-full lg:w-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-widest">
              MASTMO CLUB
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xs mx-auto lg:mx-0">
              Mathematical & Statistical Modeling at Vignan Institute of Technology and Science
            </p>
            
            {/* Vignan Logo */}
            <div className="flex flex-col items-center lg:items-start gap-3 mt-2">
              <span className="text-xs sm:text-[15px] text-gray-200 uppercase tracking-widest">
                Supported By
              </span>
              <Link 
                href="https://vignanits.ac.in" 
                target="_blank"
                className="relative w-28 sm:w-32 h-9 sm:h-10 opacity-90 hover:opacity-100 transition-opacity"
              >
                <Image 
                  src="/vgnt-logo.png" 
                  alt="VGNT Logo" 
                  fill 
                  className="object-contain" 
                  priority={true} 
                />
              </Link>
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="text-center lg:text-left w-full lg:w-auto">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3 text-sm sm:text-base">
              <li>
                <Link 
                  href="/events" 
                  className="text-gray-300 hover:text-[#00f0ff] transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/team" 
                  className="text-gray-300 hover:text-[#00f0ff] transition-colors"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link 
                  href="/join" 
                  className="text-gray-300 hover:text-[#00f0ff] transition-colors"
                >
                  Join Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-gray-300 hover:text-[#00f0ff] transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section - Contact */}
          <div className="text-center lg:text-left w-full lg:w-auto">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 tracking-wide">
              Get In Touch
            </h3>
            <ul className="flex flex-col gap-3 text-sm sm:text-base text-gray-300">
              <li>
                <a 
                  href="mailto:mastmo.vgnt@gmail.com" 
                  className="hover:text-[#00f0ff] transition-colors break-all"
                >
                  mastmo.vgnt@gmail.com
                </a>
              </li>
              <li className="max-w-xs mx-auto lg:mx-0">
                Vignan Institute of Technology<br />
                Deshmukhi, Telangana
              </li>
              {/* Social Links */}
              <li className="flex gap-4 justify-center lg:justify-start mt-2">
                <a 
                  href="mailto:mastmo.vgnt@gmail.com"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/40 flex items-center justify-center hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all group"
                  aria-label="Email"
                >
                  <Mail size={18} className="text-gray-300 group-hover:text-[#00f0ff] transition-colors" />
                </a>
                <a 
                  href="https://www.instagram.com/mastmo_vgnt/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/40 flex items-center justify-center hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all group"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="text-gray-300 group-hover:text-[#00f0ff] transition-colors" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-400">
          <p className="text-center sm:text-left">
            © 2025 MASTMO. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-[#00f0ff] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#00f0ff] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
// --- EXPORT MAIN CONTENT ---
export default function HomeContent() {
  return (
    <div className="flex flex-col gap-0">
      <HeroSection />
      <AboutSection />
      <DomainsSection />
      <FooterSection />
    </div>
  );
}