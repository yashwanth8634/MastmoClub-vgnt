"use client";

import React, { useState } from 'react';
import { BookOpen, Code, Brain, BarChart3, Wrench, Trophy } from 'lucide-react';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const domains = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'math', name: 'Mathematics', icon: BookOpen },
    { id: 'coding', name: 'Coding & DSA', icon: Code },
    { id: 'ml', name: 'Machine Learning', icon: Brain },
    { id: 'data', name: 'Data Science', icon: BarChart3 },
  ];

  const resources = [
    // --- CODING ---
    {
      category: 'coding',
      title: 'Striver A2Z DSA Sheet',
      author: 'takeUforward',
      type: 'Course / Sheet',
      link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
      level: 'All Levels',
    },
    {
      category: 'coding',
      title: 'Sheryians Coding School (Web Dev)',
      author: 'Sheryians',
      type: 'YouTube Channel',
      link: 'https://www.youtube.com/@SheryiansCodingSchool',
      level: 'Beginner',
    },
    {
      category: 'coding',
      title: 'LeetCode',
      author: 'Practice Platform',
      type: 'Platform',
      link: 'https://leetcode.com/',
      level: 'All Levels',
    },
    {
      category: 'coding',
      title: 'Codeforces',
      author: 'Competitive Programming',
      type: 'Platform',
      link: 'https://codeforces.com/',
      level: 'Intermediate',
    },
    {
      category: 'coding',
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Cormen, Leiserson, Rivest, Stein',
      type: 'Book',
      link: '#',
      level: 'Advanced',
    },

    // --- ML / AI ---
    {
      category: 'ml',
      title: 'Sheryians AI School',
      author: 'Sheryians',
      type: 'YouTube Channel',
      link: 'https://www.youtube.com/@sheryians_ai_school',
      level: 'Beginner',
    },
    {
      category: 'ml',
      title: 'Machine Learning by Andrew Ng',
      author: 'Coursera',
      type: 'Course',
      link: 'https://www.coursera.org/learn/machine-learning',
      level: 'Beginner',
    },
    {
      category: 'ml',
      title: 'Fast.ai - Practical Deep Learning',
      author: 'Jeremy Howard',
      type: 'Course',
      link: 'https://www.fast.ai/',
      level: 'Intermediate',
    },
    {
      category: 'ml',
      title: 'StatQuest with Josh Starmer',
      author: 'YouTube',
      type: 'Video Series',
      link: 'https://www.youtube.com/c/joshstarmer',
      level: 'Beginner',
    },

    // --- MATH ---
    {
      category: 'math',
      title: 'Introduction to Linear Algebra',
      author: 'Gilbert Strang (MIT)',
      type: 'Book',
      link: 'https://math.mit.edu/~gs/linearalgebra/',
      level: 'Beginner',
    },
    {
      category: 'math',
      title: '3Blue1Brown - Essence of Linear Algebra',
      author: 'Grant Sanderson',
      type: 'Video Series',
      link: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
      level: 'Beginner',
    },
    {
      category: 'math',
      title: 'MIT OpenCourseWare - Calculus',
      author: 'MIT',
      type: 'Course',
      link: 'https://ocw.mit.edu/courses/mathematics/',
      level: 'Intermediate',
    },

    // --- DATA SCIENCE ---
    {
      category: 'data',
      title: 'Python for Data Analysis',
      author: 'Wes McKinney',
      type: 'Book',
      link: '#',
      level: 'Beginner',
    },
    {
      category: 'data',
      title: 'Kaggle Learn',
      author: 'Kaggle',
      type: 'Platform',
      link: 'https://www.kaggle.com/learn',
      level: 'All Levels',
    },
    {
      category: 'data',
      title: 'The Art of Statistics',
      author: 'David Spiegelhalter',
      type: 'Book',
      link: '#',
      level: 'Intermediate',
    },
  ];

  const tools = [
    { name: 'Python', desc: 'Programming Language', link: 'https://www.python.org/' },
    { name: 'NumPy', desc: 'Numerical Computing', link: 'https://numpy.org/' },
    { name: 'Pandas', desc: 'Data Analysis', link: 'https://pandas.pydata.org/' },
    { name: 'MATLAB', desc: 'Mathematical Computing', link: 'https://www.mathworks.com/' },
    { name: 'LaTeX', desc: 'Document Preparation', link: 'https://www.overleaf.com/' },
    { name: 'Jupyter', desc: 'Interactive Notebooks', link: 'https://jupyter.org/' },
  ];

  const filteredResources = activeTab === 'all' 
    ? resources 
    : resources.filter(r => r.category === activeTab);

  return (
    // ✅ Added pt-32 to push content down below fixed Navbar
    <div className="min-h-screen text-white py-20 pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Learning <span className="text-[#00f0ff]">Resources</span>
          </h1>
          <div className="h-1 w-24 bg-[#00f0ff] mx-auto rounded-full mb-6 shadow-[0_0_10px_#00f0ff]"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Curated materials to help you master mathematics, coding, and data science.
          </p>
        </div>

        {/* Domain Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveTab(domain.id)}
                className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 border ${
                  activeTab === domain.id
                    ? 'bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-[#00f0ff]/50 hover:text-[#00f0ff]'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{domain.name}</span>
                <span className="sm:hidden">{domain.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredResources.map((resource, idx) => (
            <div
              key={idx}
              className="group relative bg-[#0a0a0a] border border-white/10 rounded-xl p-6 hover:border-[#00f0ff]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-3 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/20">
                  {resource.level}
                </span>
                <span className="text-xs text-gray-400 font-mono border border-white/10 px-2 py-0.5 rounded">
                    {resource.type}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors line-clamp-2">
                {resource.title}
              </h3>
              
              <p className="text-sm text-gray-400 mb-6 italic">by {resource.author}</p>
              
              {resource.link !== '#' ? (
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-bold text-[#00f0ff] hover:text-white transition-colors gap-1"
                >
                  Access Resource 
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              ) : (
                <span className="text-sm text-gray-600 cursor-not-allowed">Available in Library</span>
              )}
            </div>
          ))}
        </div>

        {/* Tools Section */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-[#00f0ff]/10 rounded-xl text-[#00f0ff]">
                <Wrench size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white">Essential Tools</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tools.map((tool, idx) => (
              <a
                key={idx}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-center hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 transition-all group"
              >
                <h4 className="font-bold text-gray-200 group-hover:text-[#00f0ff] mb-1 transition-colors">{tool.name}</h4>
                <p className="text-xs text-gray-500 group-hover:text-gray-400">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Project Ideas */}
        <div className="border-t border-white/10 pt-16 mt-16">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-3 bg-[#00f0ff]/10 rounded-xl text-[#00f0ff]">
                <Trophy size={32} />
             </div>
            <h2 className="text-3xl font-bold text-white">Project Ideas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Beginner Card */}
            <div className="relative overflow-hidden border border-white/10 rounded-2xl p-8 group bg-[#0a0a0a]">
               <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
               <h3 className="relative text-xl font-bold mb-4 text-[#00f0ff]">Beginner Projects</h3>
               <ul className="relative text-gray-300 space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-[#00f0ff] mt-1">•</span> Build a Calculator using Python</li>
                <li className="flex items-start gap-2"><span className="text-[#00f0ff] mt-1">•</span> Visualize COVID-19 data with Matplotlib</li>
                <li className="flex items-start gap-2"><span className="text-[#00f0ff] mt-1">•</span> Create a Simple Linear Regression model</li>
                <li className="flex items-start gap-2"><span className="text-[#00f0ff] mt-1">•</span> Solve 50 LeetCode Easy problems</li>
              </ul>
            </div>
            
            {/* Advanced Card */}
            <div className="relative overflow-hidden border border-white/10 rounded-2xl p-8 group bg-[#0a0a0a]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-30 group-hover:opacity-60 transition-opacity" />
              <h3 className="relative text-xl font-bold mb-4 text-white group-hover:text-[#00f0ff] transition-colors">Advanced Projects</h3>
              <ul className="relative text-gray-300 space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-white/50 mt-1">•</span> Implement a Neural Network from scratch</li>
                <li className="flex items-start gap-2"><span className="text-white/50 mt-1">•</span> Kaggle Competition participation</li>
                <li className="flex items-start gap-2"><span className="text-white/50 mt-1">•</span> Research paper implementation</li>
                <li className="flex items-start gap-2"><span className="text-white/50 mt-1">•</span> Competitive Programming (Codeforces Div 2)</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}