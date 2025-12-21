"use client";

import React from 'react';
import { Shield, Mail, Lock, Eye, UserCheck, Calendar, Camera, Instagram } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    // ✅ Added pt-32 to prevent Navbar overlap
    <div className="min-h-screen text-white py-20 pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 rounded-full bg-[#00f0ff]/10 mb-6">
            <Shield className="w-12 h-12 text-[#00f0ff]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Privacy <span className="text-[#00f0ff]">Policy</span>
          </h1>
          <div className="h-1 w-24 bg-[#00f0ff] mx-auto rounded-full mb-6 shadow-[0_0_10px_#00f0ff]"></div>
          <p className="text-gray-400">Last updated: December 21, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          
          {/* Introduction */}
          <section className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-[#00f0ff]/30 transition-colors">
            <p className="text-gray-300 leading-relaxed text-lg">
              MASTMO Club at Vignan Institute of Technology and Science ("we," "us," or "our") 
              is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, and safeguard your information when you interact with our club, website, and events.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Eye className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">Information We Collect</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-8">
              <div>
                <h3 className="font-bold text-lg mb-3 text-[#00f0ff] flex items-center gap-2">
                    1. Personal Information
                </h3>
                <ul className="text-gray-300 space-y-2 ml-4 border-l-2 border-[#00f0ff]/20 pl-4">
                  <li>• Name and Student ID (Roll Number)</li>
                  <li>• Email address (Institutional & Personal)</li>
                  <li>• Department, Year, and Section</li>
                  <li>• Mobile Number (for WhatsApp Groups/Alerts)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3 text-[#00f0ff] flex items-center gap-2">
                    2. Activity & Technical Data
                </h3>
                <ul className="text-gray-300 space-y-2 ml-4 border-l-2 border-[#00f0ff]/20 pl-4">
                  <li>• Event attendance and Workshop participation</li>
                  <li>• Hackathon project submissions (Code, PPTs)</li>
                  <li>• Quiz scores and competition rankings</li>
                  <li>• Device info and Website usage analytics</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-[#00f0ff] flex items-center gap-2">
                    <Camera size={20} /> 3. Media & Photography
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                    Since we maintain a public Gallery:
                </p>
                <ul className="text-gray-300 space-y-2 ml-4 border-l-2 border-[#00f0ff]/20 pl-4">
                  <li>• Photos/Videos taken during offline events</li>
                  <li>• Group photos of winners and participants</li>
                  <li>• <em>(You may request removal of specific photos by contacting us)</em></li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">How We Use Your Information</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
              <ul className="text-gray-300 space-y-4">
                <li className="flex items-start gap-3 group">
                  <span className="text-[#00f0ff] mt-1 group-hover:scale-125 transition-transform">✓</span>
                  <span><strong>Event Management:</strong> To organize teams, verify student status, and generate certificates.</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-[#00f0ff] mt-1 group-hover:scale-125 transition-transform">✓</span>
                  <span><strong>Communication:</strong> To send updates via Email or WhatsApp about upcoming hackathons and meetups.</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-[#00f0ff] mt-1 group-hover:scale-125 transition-transform">✓</span>
                  <span><strong>Recognition:</strong> To display winners and contributors on our "Team" and "Gallery" pages.</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-[#00f0ff] mt-1 group-hover:scale-125 transition-transform">✓</span>
                  <span><strong>College Reporting:</strong> To submit activity reports to the HOD/Principal as part of official club duties.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">Data Sharing & Security</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <h3 className="font-bold text-red-400 mb-2">⛔ We DO NOT:</h3>
                <ul className="text-gray-400 space-y-1 ml-4 list-disc">
                  <li>Sell your data to third parties or advertisers.</li>
                  <li>Share personal contacts publicly without permission.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-[#00f0ff] mb-2">✅ We MAY share data with:</h3>
                <ul className="text-gray-300 space-y-2 ml-4 list-disc pl-4">
                  <li><strong>Core Team Leads:</strong> For organizing events and coordination.</li>
                  <li><strong>VGNT Administration:</strong> For official attendance and record-keeping.</li>
                  <li><strong>Event Sponsors:</strong> (Only winner details, if prizes are involved).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-[#00f0ff]" size={28} />
              <h2 className="text-2xl font-bold">Your Rights</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
              <p className="text-gray-300 mb-4">As a member, you have the right to:</p>
              <ul className="text-gray-300 space-y-2 ml-4 list-disc pl-4 marker:text-[#00f0ff]">
                <li>Request access to the data we hold about you.</li>
                <li>Ask to remove your photo from the website Gallery.</li>
                <li>Unsubscribe from non-essential club emails.</li>
              </ul>
              
              <div className="mt-6 p-4 bg-[#00f0ff]/5 border border-[#00f0ff]/30 rounded-xl flex items-center gap-4">
                <Mail className="text-[#00f0ff] shrink-0" />
                <p className="text-sm text-gray-300">
                  To exercise these rights, email us at:{" "}
                  <a href="mailto:mastmo.vgnt@gmail.com" className="text-[#00f0ff] font-bold hover:underline cursor-pointer">
                    mastmo.vgnt@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Contact (INSTAGRAM REDIRECT) */}
          <section className="relative overflow-hidden bg-gradient-to-r from-[#00f0ff]/10 to-transparent border border-[#00f0ff]/30 rounded-2xl p-10 text-center group">
            <div className="absolute inset-0 bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <Instagram className="w-12 h-12 text-[#00f0ff] mx-auto mb-4" />
            <h3 className="font-bold text-2xl mb-3 text-white">Have Questions?</h3>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              If you have any doubts about this policy or club operations, DM us on Instagram.
            </p>
            
            {/* ✅ UPDATED LINK: Redirects to Instagram */}
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