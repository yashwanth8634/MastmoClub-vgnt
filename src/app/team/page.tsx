import TeamCard from "@/components/ui/TeamCard";
import PatronSection from "@/components/team/PatronSection";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the Core Council, Faculty Board, and Coordinators behind the Mathematical & Statistical Modeling Club at VGNT.",
  openGraph: {
    title: "Meet the MASTMO Team",
    description: "The minds and hearts behind the club.",
    images: ["/images/team-banner.png"], 
  },
};

export default async function TeamPage() {
  await dbConnect();

  // 1. FETCH MEMBERS
  const allMembers = await TeamMember.find({}).sort({ order: 1 }).lean();

  const serialize = (members: any[]) => members.map(m => ({
    ...m,
    _id: m._id.toString(),
    socials: m.socials || {} 
  }));

  const serializedMembers = serialize(allMembers);

  // ---------------------------------------------------------
  // ✅ FIX: FILTER BY ROLE (Not Category)
  // ---------------------------------------------------------
  
  // 1. Find anyone whose ROLE contains "Patron" (case insensitive)
  const patrons = serializedMembers.filter(m => 
  m.category === "patron" || (m.role && m.role.toLowerCase().includes("patron"))
);
  // 2. Filter other categories, but EXCLUDE anyone we already identified as a Patron
  // (This prevents them from appearing twice)
  const isPatron = (id: string) => patrons.some(p => p._id === id);

  const faculty = serializedMembers.filter(m => 
    m.category === "faculty" && !isPatron(m._id)
  );
  
  const core = serializedMembers.filter(m => m.category === "core");
  const coordinators = serializedMembers.filter(m => m.category === "coordinator");
  const support = serializedMembers.filter(m => m.category === "support");

  return (
    <main className="relative min-h-screen bg-transparent font-sans text-white selection:bg-[#00f0ff]/30">
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
            Meet the <span className="text-[#00f0ff]">Minds</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The visionaries, builders, and problem solvers behind MASTMO.
          </p>
        </div>


        {/* FACULTY SECTION */}
        {faculty.length > 0 && (
          <section className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-75">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Faculty Board</h2>
              <div className="h-px flex-1 bg-white/50"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center optimize-visibility">
              {faculty.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* 👑 PATRON SECTION (Based on Role) */}
        {patrons.length > 0 && (
           <PatronSection patrons={patrons} />
        )}
        {/* CORE COUNCIL */}
        {core.length > 0 && (
          <section className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Core Council</h2>
              <div className="h-px flex-1 bg-white/20"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {core.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* COORDINATORS */}
        {coordinators.length > 0 && (
          <section className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Leads & Coordinators</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
              {coordinators.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* SUPPORT */}
        {support.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Supporting Team</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
              {support.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}