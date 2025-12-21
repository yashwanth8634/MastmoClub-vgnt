"use client";

import React from 'react';
import { FileText, Users, Award, AlertCircle, Ban, Mail, CheckCircle, Instagram } from 'lucide-react';

export default function TermsOfService() {
  return (
    // ✅ Added pt-32 to prevent Navbar overlap
    <div className="min-h-screen text-white py-20 pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 rounded-full bg-[#00f0ff]/10 mb-6">
            <FileText className="w-12 h-12 text-[#00f0ff]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Terms of <span className="text-[#00f0ff]">Service</span>
          </h1>
          <div className="h-1 w-24 bg-[#00f0ff] mx-auto rounded-full mb-6 shadow-[0_0_10px_#00f0ff]"></div>
          <p className="text-gray-400">Last updated: December 21, 2025</p>
        </div>

        {/* Introduction */}
        <section className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 mb-12 hover:border-[#00f0ff]/30 transition-colors">
          <p className="text-gray-300 leading-relaxed text-lg">
            Welcome to MASTMO Club! By joining our club or using our services, you agree to these 
            Terms of Service. Please read them carefully. These terms govern your membership and 
            participation in all club activities at Vignan Institute of Technology and Science (VGNT).
          </p>
        </section>

        <div className="space-y-12">

          {/* Membership */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">Membership Eligibility & Rules</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-8">
              <div>
                <h3 className="font-bold text-lg mb-3 text-[#00f0ff] flex items-center gap-2">
                    1. Eligibility
                </h3>
                <ul className="text-gray-300 space-y-2 ml-4 border-l-2 border-[#00f0ff]/20 pl-4">
                  <li>• Must be a current student of VGNT.</li>
                  <li>• Open to all branches (CSE, IT, ECE, etc.) and years.</li>
                  <li>• Must maintain good academic standing and discipline.</li>
                  <li>• Alumni may participate as mentors or guest speakers.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3 text-[#00f0ff] flex items-center gap-2">
                    2. Member Responsibilities
                </h3>
                <ul className="text-gray-300 space-y-2 ml-4 border-l-2 border-[#00f0ff]/20 pl-4">
                  <li>• Provide accurate details (Roll No, Email) during registration.</li>
                  <li>• Attend at least 60% of events to be eligible for active member certificates.</li>
                  <li>• Respect club guidelines and follow the Code of Conduct.</li>
                  <li>• Use club resources (Labs, Drives) for educational purposes only.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Event Participation */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">Event Participation</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2 text-white">Registration & Slots</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Registration is mandatory for all events. Slots are often limited and allocated on a 
                  <strong> first-come, first-served basis</strong>.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2 text-white">Cancellation Policy</h3>
                <ul className="text-gray-300 space-y-2 ml-4 list-disc pl-4 marker:text-[#00f0ff]">
                  <li>Cancel at least <strong>24 hours</strong> before the event if you cannot attend.</li>
                  <li>Repeated "No-Shows" without notice may lead to a ban from future events.</li>
                </ul>
              </div>

              <div className="p-4 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded-xl">
                <h3 className="font-bold text-[#00f0ff] mb-2">🎓 Certificates</h3>
                <p className="text-gray-300 text-sm mb-2">Issued based on:</p>
                <ul className="text-gray-400 text-sm space-y-1 ml-4 list-disc">
                  <li>Minimum attendance (usually 60-75%).</li>
                  <li>Completion of assigned tasks/projects.</li>
                  <li>Active participation, not just login/entry.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code of Conduct */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">Code of Conduct</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
              <p className="text-gray-300 mb-4">We expect all members to:</p>
              <ul className="text-gray-300 space-y-2 ml-4 list-disc pl-4 marker:text-[#00f0ff]">
                <li>Treat fellow members, organizers, and faculty with respect.</li>
                <li>Communicate professionally in WhatsApp groups and Discord.</li>
                <li>Avoid plagiarism in Hackathons and Coding Competitions.</li>
                <li>Refrain from harassment, hate speech, or bullying.</li>
              </ul>
              
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-200">
                  <strong className="text-red-400">Zero Tolerance:</strong> Any form of harassment, cheating, or 
                  misconduct will result in <strong>immediate removal</strong> from the club and reporting to the college administration.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">Intellectual Property</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2 text-[#00f0ff]">Club Materials</h3>
                <ul className="text-gray-300 space-y-2 ml-4 list-disc pl-4">
                  <li>Workshop slides, code repositories, and recordings are for <strong>personal educational use only</strong>.</li>
                  <li>Do not sell or redistribute club materials without permission.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2 text-[#00f0ff]">Your Projects</h3>
                <p className="text-gray-300 text-sm">
                  Projects you create remain yours. By submitting them to club competitions, 
                  you grant us permission to showcase them (with credit) on our website or social media.
                </p>
              </div>
            </div>
          </section>

          {/* Liability */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Ban className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">Limitation of Liability</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00f0ff] mt-1">•</span>
                  <span>MASTMO is a student-run body. We provide guidance but do not guarantee job placements or exam results.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00f0ff] mt-1">•</span>
                  <span>We are not responsible for personal injuries during offline events (please follow campus safety rules).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00f0ff] mt-1">•</span>
                  <span>External links shared are for reference; we do not control their content.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact (INSTAGRAM REDIRECT) */}
          <section className="relative overflow-hidden bg-gradient-to-r from-[#00f0ff]/10 to-transparent border border-[#00f0ff]/30 rounded-2xl p-10 text-center group">
            <div className="absolute inset-0 bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <Instagram className="w-12 h-12 text-[#00f0ff] mx-auto mb-4" />
            <h3 className="font-bold text-2xl mb-3 text-white">Questions?</h3>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              If you have any doubts about these Terms, DM us on Instagram.
            </p>
            
            <a 
              href="https://www.instagram.com/mastmo_vgnt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#00f0ff] text-black font-bold rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              <Instagram size={20} />
              Contact Support
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}