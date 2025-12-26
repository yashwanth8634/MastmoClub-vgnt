import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  _id: string;
}

export default function PatronSection({ patrons }: { patrons: TeamMember[] }) {
  if (!patrons || patrons.length === 0) return null;

  return (
    <section className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Our Patrons</h2>
        <div className="h-px flex-1 bg-white/40"></div>
      </div>

      {/* ✅ FIX: Changed to Grid Layout (2 Columns) to match your diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {patrons.map((patron) => (
          <div 
            key={patron._id} 
            className="bg-black border border-white/10 p-8 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] group"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
              {patron.name}
            </h3>
            <span className="text-gray-400 text-sm uppercase tracking-wide">
              {patron.role}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}