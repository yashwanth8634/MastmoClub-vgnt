import dbConnect from "@/lib/db";
import Registration from "@/models/ClubRegistration";
import { CheckCircle, GraduationCap, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic"; // Ensure real-time data

export default async function Dashboard() {
  await dbConnect();

  // 🚀 OPTIMIZATION: Use Promise.all to fetch data in parallel
  const [
    studentPending,
    studentApproved,
    facultyPending,
    facultyApproved,
    recentPending
  ] = await Promise.all([
    Registration.countDocuments({ type: "student", status: "pending" }),
    Registration.countDocuments({ type: "student", status: "approved" }),
    Registration.countDocuments({ type: "faculty", status: "pending" }),
    Registration.countDocuments({ type: "faculty", status: "approved" }),
    // Fetch top 5 recent pending requests
    Registration.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  ]);

  // Derived Totals
  const totalPending = studentPending + facultyPending;
  const totalMembers = studentApproved + facultyApproved;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* ---------------------------------------------------------------------- */}
      {/* 1. KEY METRICS (HERO CARDS) */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Total Members Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 rounded-3xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
             <GraduationCap size={120} />
          </div>
          <div>
            <p className="text-gray-400 font-medium mb-2">Total Club Members</p>
            <h3 className="text-5xl font-bold text-white mb-2">{totalMembers}</h3>
            <div className="flex gap-4 text-sm text-gray-400 mt-4">
               <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                 {facultyApproved} Faculty
               </span>
               <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                 {studentApproved} Students
               </span>
            </div>
          </div>
        </div>

        {/* Pending Approvals Card (Glows if > 0) */}
        <div className={`
          relative p-8 rounded-3xl border flex items-center justify-between overflow-hidden transition-all
          ${totalPending > 0 
            ? "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)]" 
            : "bg-white/5 border-white/10"}
        `}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <CheckCircle size={120} />
          </div>
          
          <div className="z-10 w-full">
            <p className={`font-medium mb-2 ${totalPending > 0 ? "text-yellow-400" : "text-gray-400"}`}>
              Pending Approvals
            </p>
            <h3 className={`text-5xl font-bold mb-4 ${totalPending > 0 ? "text-yellow-400" : "text-white"}`}>
              {totalPending}
            </h3>
            
            {totalPending > 0 ? (
              <Link 
                href="/admin/dashboard-group/members"
                className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-colors"
              >
                Review Requests <ArrowRight size={18} />
              </Link>
            ) : (
              <p className="text-green-400 flex items-center gap-2">
                <CheckCircle size={18} /> All caught up!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. RECENT PENDING REQUESTS (Actionable Table) */}
      {/* ---------------------------------------------------------------------- */}
      {recentPending.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-[#00f0ff]" /> Recently Applied
            </h3>
            <Link href="/admin/dashboard-group/members" className="text-sm text-gray-400 hover:text-[#00f0ff] transition-colors">
              View All &rarr;
            </Link>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 text-gray-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Branch/Dept</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentPending.map((req: any) => {
                // Safe access to member object
                const m = req.member; 
                return (
                  <tr key={req._id.toString()} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{m?.fullName || "Unknown"}</td>
                    <td className="p-4">
                      {req.type === "faculty" ? (
                        <span className="text-purple-400 text-xs bg-purple-400/10 px-2 py-1 rounded border border-purple-500/20">Faculty</span>
                      ) : (
                        <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-1 rounded border border-blue-500/20">Student</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-300">{m?.branch || "N/A"}</td>
                    <td className="p-4 text-right text-gray-500">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}