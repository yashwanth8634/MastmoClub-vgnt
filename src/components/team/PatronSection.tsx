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
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {patrons.map((patron) => (
          <div 
            key={patron._id} 
            className="bg-black border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 "
          >
            <h3 className="text-xl font-bold text-white mb-1">{patron.name}</h3>
            <span className="text-gray-400 text-sm">
              {patron.role}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}