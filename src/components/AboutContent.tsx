"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Target, Lightbulb, Zap, Brain, Rocket, Globe, ArrowRight, Quote } from "lucide-react";
import type { Metadata } from "next";

// --- LEADERSHIP DATA ---
const VISIONARIES = [
  {
    name: "Dr. N. Dinesh Kumar",
    role: "Principal, VGNT",
    desc: "The driving force behind MASTMO. It was his visionary initiative to establish a dedicated club that bridges the gap between raw mathematical theory and modern engineering applications.",
  },
  {
    name: "Prof. Dr. G. Y. Sagar",
    role: "Chairman & Faculty Advisor",
    desc: "With over 22 years of distinguished expertise in Statistics and Mathematical Modeling, he brings unparalleled depth to MASTMO. His career spans 14 years as a Professor at Gambella University, Ethiopia, and 8 years of industry experience. He ensures our curriculum maintains the highest standards of mathematical rigor while bridging theory with real-world applications.",
  }
];

// Data from Proposal
const OBJECTIVES = [
  {
    icon: Lightbulb,
    title: "Bridge The Gap",
    desc: "Connecting theoretical mathematics with practical engineering applications."
  },
  {
    icon: Brain,
    title: "Analytical Thinking",
    desc: "Cultivating quantitative reasoning and complex problem-solving skills."
  },
  {
    icon: Zap,
    title: "Software Competence",
    desc: "Hands-on mastery of Python (NumPy, Pandas), R, and MATLAB."
  },
  {
    icon: Rocket,
    title: "Innovation",
    desc: "Encouraging participation in national research and modeling competitions."
  }
];

const THEMES = [
  {
    title: "Deep Learning Foundations",
    desc: "Advanced linear algebra (tensors), optimization algorithms (SGD, Adam), and probability distributions."
  },
  {
    title: "Model Validation",
    desc: "Rigorous statistical testing, causal inference, and building trustworthy AI systems."
  }
];


export default function AboutContent() {
  return (
    <main className="relative min-h-screen bg-transparent font-sans text-white selection:bg-[#00f0ff]/30">
      

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* 1. HERO SECTION */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 px-4 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10"
          >
            <span className="text-[#00f0ff] text-xs font-bold tracking-[0.2em] uppercase">
              Our Mission
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter"
          >
            The Mathematical <br />
            <span className="text-[#00f0ff]">Engine of Modern AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Data Science and Engineering problems are increasingly solved using models that simulate real-world phenomena. 
            <strong className="text-gray-100"> MASTMO</strong> exists to master the mathematics that underpins these technologies.
          </motion.p>
        </div>

        {/* 2. THE VISIONARIES (New Section) */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Our Visionaries</h2>
            <div className="h-px flex-1 bg-white/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-transparent">
            {VISIONARIES.map((person, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-black border border-white/40 hover:border-[#00f0ff]/30 transition-all duration-300 bg-black"
              >
                <Quote className="text-[#00f0ff] mb-4 opacity-50" size={24} />
                <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                <p className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest mb-4">
                  {person.role}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {person.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. THE RATIONALE */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="bg-black border border-white/40 p-10 rounded-3xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6">Why MASTMO?</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Most engineering curricula emphasize theory without sufficient application. We bridge that gap. 
              Whether it is structural analysis, machine learning, or operations research, 
              <strong> mathematics is the universal language.</strong>
            </p>
            <div className="flex flex-col gap-4">
              {THEMES.map((theme, i) => (
                <div key={i} className="pl-4 border-l-3 border-[#00f0ff]">
                  <h4 className="font-bold text-white">{theme.title}</h4>
                  <p className="text-sm text-gray-400">{theme.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden border border-white/40 bg-black/50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/20 to-purple-500/20 blur-3xl"></div>
            <div className="relative text-center p-8">
              <Globe size={64} className="text-[#00f0ff] mx-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">From Theory</h3>
              <div className="w-0.5 h-8 bg-white mx-auto my-2"></div>
              <h3 className="text-2xl font-bold text-[#00f0ff]">To Application</h3>
            </div>
          </div>
        </motion.section>

        {/* 4. OBJECTIVES GRID */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Core Objectives</h2>
            <div className="h-px flex-1 bg-white/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-transparent">
            {OBJECTIVES.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-black border border-white/40 hover:border-[#00f0ff]/30  transition-all duration-300 bg-black"
                
              >
                
                <obj.icon className="text-gray-500 group-hover:text-[#00f0ff] mb-6 transition-colors" size={32} />
                <h3 className="text-xl font-bold text-white mb-3">{obj.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{obj.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. CALL TO ACTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/40 bg-black"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to solve the impossible?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Join a community of thinkers, builders, and innovators. 
            The future is written in code, but defined by math.
          </p>
          <Link 
            href="/join" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#00f0ff] text-black font-bold rounded-full hover:bg-white transition-all duration-300"
          >
            Become a Member <ArrowRight size={20} />
          </Link>
        </motion.div>

      </div>
    </main>
  );
}

