import Link from "next/link";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { Plus, Trash2, User, Pencil } from "lucide-react"; // Combined imports
import DeleteMemberButton from "@/components/admin/DeleteMemberButton";

export default async function TeamManager() {
  await dbConnect();

  // Fetch all members sorted by order (rank)
  const members = await TeamMember.find({}).sort({ order: 1 });

  // ✅ FIX: Add "patron" to this list so the loop renders them
  const categories = ["patron", "faculty", "core", "coordinator", "support"];

  // Helper to make titles look nice
  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case "patron": return "Patrons & Guests";
      case "faculty": return "Faculty Board";
      case "core": return "Core Council";
      case "coordinator": return "Coordinators & Leads";
      case "support": return "Supporting Team";
      default: return cat.toUpperCase();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Team</h1>
        <Link
          href="/admin/dashboard-group/team/new"
          className="bg-[#00f0ff] text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={20} /> Add Member
        </Link>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => {
          // Filter members belonging to this category
          const catMembers = members.filter((m) => m.category === cat);
          
          // Hide section if empty
          if (catMembers.length === 0) return null;

          return (
            <div
              key={cat}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#00f0ff] uppercase tracking-widest">
                  {getCategoryTitle(cat)}
                </h2>
                <span className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">
                  {catMembers.length} Members
                </span>
              </div>
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-white/10">
                  {catMembers.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 pl-6 w-16">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 overflow-hidden">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={18} />
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white">
                        {member.name}
                        <div className="text-xs text-gray-500 font-normal">
                          {member.role}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-400 font-mono hidden md:table-cell">
                        {member.details || "-"}
                      </td>
                      <td className="p-4 text-right pr-6 flex justify-end gap-2">
                        <Link
                          href={`/admin/dashboard-group/team/${member._id}/edit`}
                          className="p-2 text-gray-500 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteMemberButton id={member._id.toString()} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {members.length === 0 && (
          <div className="text-center text-gray-500 py-10 border border-dashed border-white/10 rounded-2xl">
            <p>No team members found.</p>
            <p className="text-sm mt-2">Click "Add Member" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}