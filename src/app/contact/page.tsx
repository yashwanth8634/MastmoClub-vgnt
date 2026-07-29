import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import type { ITeamMember } from "@/models/TeamMember";
import type { Metadata } from "next";
import type { Types } from "mongoose";
import { Mail, Instagram, Users } from "lucide-react";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the MASTMO Club team, faculty board, and core council members.",
};

const getCachedContactMembers = unstable_cache(
  async () => {
    await dbConnect();

    type LeanTeamMember = ITeamMember & { _id: Types.ObjectId };

    const members = (await TeamMember.find({
      category: { $in: ["faculty", "core"] },
    })
      .select("name role category socials order")
      .lean()) as LeanTeamMember[];

    return members.map((member) => ({
      _id: member._id.toString(),
      name: member.name,
      role: member.role,
      category: member.category,
      email: member.socials?.email || "",
      instagram: member.socials?.instagram || "",
    }));
  },
  ["contact-members"],
  { revalidate: 300, tags: ["team"] }
);

export default async function ContactPage() {
  const allMembers = await getCachedContactMembers();

  // Helper to map and sort exactly as requested:
  // 1. Dr. G. Y. Sagar
  // 2. President
  // 3. Vice President
  // 4. Treasurer
  // 5. Secretary
  // 6. General Secretary
  // 7. Technical Head
  // 8. Outreach Lead
  const getOrderIndex = (name: string, role: string) => {
    if (name.toLowerCase().includes("sagar")) return 0;
    const roleLower = role.toLowerCase().trim();
    if (roleLower === "president") return 1;
    if (roleLower === "vice-president" || roleLower === "vice president") return 2;
    if (roleLower === "treasurer") return 3;
    if (roleLower === "secretary") return 4;
    if (roleLower === "general secretary") return 5;
    if (roleLower === "technical head" || roleLower === "technicalhead") return 6;
    if (roleLower === "outreachlead" || roleLower === "outreach lead") return 7;
    return -1; // Exclude others
  };

  const filteredAndSortedMembers = allMembers
    .map(m => ({ ...m, orderIndex: getOrderIndex(m.name, m.role) }))
    .filter(m => m.orderIndex !== -1)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  // Helper to format role-based email if not present
  const getDisplayEmail = (role: string, dbEmail: string) => {
    if (dbEmail) return dbEmail;
    
    const roleLower = role.toLowerCase().replace(/[^a-z]/g, "");
    const validRoles = [
      "president",
      "vicepresident",
      "secretary",
      "treasurer",
      "generalsecretary",
      "technicalhead",
      "outreachlead"
    ];
    
    if (validRoles.includes(roleLower)) {
      return `${roleLower}@mastmovgnt.in`;
    }
    
    return "support@mastmovgnt.in";
  };

  return (
    <main className="relative min-h-screen bg-transparent font-sans text-white selection:bg-[#00f0ff]/30">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00f0ff]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
            Get in <span className="text-[#00f0ff]">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Reach out to the official student coordinators, core council, and faculty board of the MASTMO Club.
          </p>
        </div>

        {/* Contacts Table Section */}
        <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 bg-black/40">
              <h2 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-[#00f0ff]" /> Key Core & Faculty Contacts
              </h2>
            </div>
            
            <div className="overflow-x-auto bg-black">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6 text-center w-20">S.No</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4 pr-6">Email Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm sm:text-base">
                  {filteredAndSortedMembers.map((member, index) => {
                    const email = getDisplayEmail(member.role, member.email);
                    return (
                      <tr 
                        key={member._id}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="p-4 pl-6 text-center font-mono text-gray-500 group-hover:text-[#00f0ff] transition-colors">
                          {index + 1}
                        </td>
                        <td className="p-4 font-semibold text-white group-hover:text-[#00f0ff] transition-colors">
                          {member.name}
                        </td>
                        <td className="p-4 text-gray-300">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-purple-300">
                            {member.role}
                          </span>
                        </td>
                        <td className="p-4 pr-6">
                          <a 
                            href={`mailto:${email}`} 
                            className="font-mono text-gray-400 hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
                          >
                            <Mail className="w-4 h-4 text-gray-500 group-hover:text-[#00f0ff] transition-colors" /> {email}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAndSortedMembers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">
                        No official contacts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* General Support & Social Card */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Support Card */}
            <div className="flex items-start gap-4 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-[#00f0ff]/30 transition-all group">
              <div className="p-4 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] group-hover:bg-[#00f0ff]/20 transition-all">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">General Support</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  For any general questions, partnerships, or official club inquiries, send us a mail.
                </p>
                <a 
                  href="mailto:support@mastmovgnt.in" 
                  className="inline-flex items-center gap-2 text-[#00f0ff] hover:underline font-semibold"
                >
                  support@mastmovgnt.in &rarr;
                </a>
              </div>
            </div>

            {/* Instagram Support Card */}
            <div className="flex items-start gap-4 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-purple-500/30 transition-all group">
              <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-all">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Instagram DM</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Get fast replies and updates by messaging our official Instagram page.
                </p>
                <a 
                  href="https://instagram.mastmovgnt.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-purple-400 hover:underline font-semibold"
                >
                  @mastmo_vgnt &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// Simple custom component to render user-icon
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
