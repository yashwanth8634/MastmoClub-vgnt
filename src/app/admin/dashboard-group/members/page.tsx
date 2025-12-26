import dbConnect from "@/lib/db";
import Registration from "@/models/ClubRegistration";
import { Check, X } from "lucide-react";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";
import DeleteClubMemberButton from "@/components/admin/DeleteClubMemberButton";
import MemberExportButton from "@/components/admin/MemberExportButton";

// ✅ 1. ROBUST YEAR CALCULATOR (Handles Regular vs Lateral)
const getYearFromRoll = (rollNo: string) => {
  if (!rollNo || rollNo.length < 10) return "N/A";

  const joinYear = parseInt(rollNo.substring(0, 2)); // e.g., "24"
  const typeCode = rollNo.substring(4, 6); // e.g., "1A" (Regular) or "5A" (Lateral)
  
  // 🗓️ Calculate "Academic" Year
  // If today is Jan-May 2026, we are still in the 2025 academic batch cycle.
  // If today is Aug-Dec 2025, we are in the 2025 academic batch cycle.
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = Jan, 11 = Dec
  let currentAcadYear = parseInt(now.getFullYear().toString().slice(-2));
  
  // If currently Jan to June, subtract 1 to get the academic start year
  if (currentMonth < 6) {
    currentAcadYear -= 1;
  }

  const yearDiff = currentAcadYear - joinYear;

  // 🚀 LATERAL ENTRY LOGIC (5A)
  // They join directly in 2nd Year.
  // Batch 25 (Joined 2025) -> Diff 0 -> 2nd Year
  // Batch 24 (Joined 2024) -> Diff 1 -> 3rd Year
  if (typeCode === "5A") {
    if (yearDiff === 0) return "2nd";
    if (yearDiff === 1) return "3rd";
    if (yearDiff === 2) return "4th";
    return "Alumni"; 
  } 
  
  // 🚶 REGULAR LOGIC (1A, 1B, etc.)
  // Batch 25 (Joined 2025) -> Diff 0 -> 1st Year
  // Batch 24 (Joined 2024) -> Diff 1 -> 2nd Year
  if (yearDiff === 0) return "1st";
  if (yearDiff === 1) return "2nd";
  if (yearDiff === 2) return "3rd";
  if (yearDiff === 3) return "4th";
  
  return "Alumni"; 
};

// Server Action to Approve/Reject
async function handleMembershipAction(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  
  await dbConnect();
  
  try {
    const registration = await Registration.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    );

    if (!registration) return;

    // Send Email
    // Using optional chaining just in case data structure varies
    const member = registration.member || registration.members?.[0];

    if (member && member.email) {
      if (status === "approved") {
        const { subject, html } = emailTemplates.membershipApproved(member.fullName);
        await sendEmail(member.email, subject, html);
      } else if (status === "rejected") {
        const { subject, html } = emailTemplates.membershipRejected(member.fullName);
        await sendEmail(member.email, subject, html);
      }
    }
  } catch (error) {
    console.error("Error updating membership status:", error);
  }
  
  revalidatePath("/admin/dashboard-group/members");
}

export default async function MembersPage() {
  await dbConnect();
  
  // 1. Fetch Students
  // Using .lean() for faster read-only data
  const pendingStudents = await Registration.find({ type: "student", status: "pending" }).lean();
  const activeStudents = await Registration.find({ type: "student", status: "approved" }).lean();

  // 2. Fetch Faculty
  const pendingFaculty = await Registration.find({ type: "faculty", status: "pending" }).lean();
  const activeFaculty = await Registration.find({ type: "faculty", status: "approved" }).lean();

  // ✅ 3. PREPARE DATA FOR EXPORT
  const studentExportData = activeStudents.map((reg: any) => {
    const mem = reg.member || reg.members?.[0]; // Handle both schema possibilities safely
    return {
      name: mem?.fullName || "Unknown",
      rollNumber: mem?.rollNo || "N/A",
      email: mem?.email || "N/A",
      phone: mem?.phone || "N/A",
      branch: mem?.branch || "N/A",
      year: getYearFromRoll(mem?.rollNo), 
      section: mem?.section || "N/A"
    };
  });

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold mb-8">Club Membership Database</h1>

      {/* ---------------------------------------------------------------------- */}
      {/* 🎓 FACULTY SECTION */}
      {/* ---------------------------------------------------------------------- */}
      <div className="mb-16 border-b border-white/10 pb-12">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">Faculty Members</h2>

        {/* Faculty Pending */}
        {pendingFaculty.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">Pending Approvals ({pendingFaculty.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {pendingFaculty.map((req: any) => {
                 const m = req.member || req.members?.[0];
                 return (
                   <div key={req._id.toString()} className="bg-white/5 border border-purple-500/30 p-4 rounded-xl flex justify-between items-center">
                     <div>
                       <h4 className="font-bold text-white">{m?.fullName}</h4>
                       <p className="text-xs text-gray-400">{m?.branch}</p>
                     </div>
                     <div className="flex gap-2">
                        <form action={handleMembershipAction}>
                          <input type="hidden" name="id" value={req._id.toString()} />
                          <input type="hidden" name="status" value="approved" />
                          <button className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20"><Check size={18} /></button>
                        </form>
                        <form action={handleMembershipAction}>
                          <input type="hidden" name="id" value={req._id.toString()} />
                          <input type="hidden" name="status" value="rejected" />
                          <button className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><X size={18} /></button>
                        </form>
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
        )}

        {/* Faculty Active Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-purple-900/20 text-purple-200">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {activeFaculty.map((doc: any) => {
                const mem = doc.member || doc.members?.[0];
                return (
                  <tr key={doc._id.toString()}>
                    <td className="p-4 font-bold">{mem?.fullName}</td>
                    <td className="p-4">{mem?.branch}</td>
                    <td className="p-4 text-gray-400">
                      <div>{mem?.email}</div>
                      <div className="text-xs">{mem?.phone}</div>
                    </td>
                    <td className="p-4 text-center">
                      <DeleteClubMemberButton memberId={doc._id.toString()} />
                    </td>
                  </tr>
                );
              })}
              {activeFaculty.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No active faculty members.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 🧑‍🎓 STUDENTS SECTION */}
      {/* ---------------------------------------------------------------------- */}
      <div>
        <h2 className="text-2xl font-bold text-[#00f0ff] mb-6">Student Members</h2>

        {/* Student Pending */}
        {pendingStudents.length > 0 && (
          <div className="mb-8">
             <h3 className="text-lg font-bold text-yellow-400 mb-3">Pending Requests ({pendingStudents.length})</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingStudents.map((req: any) => {
                  const m = req.member || req.members?.[0];
                  return (
                    <div key={req._id.toString()} className="bg-white/5 border border-white/10 p-5 rounded-xl flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-white">{m?.fullName}</h3>
                        <p className="text-sm text-gray-400">{m?.rollNo} • {m?.branch}</p>
                      </div>
                      <div className="flex gap-2">
                         <form action={handleMembershipAction}>
                           <input type="hidden" name="id" value={req._id.toString()} />
                           <input type="hidden" name="status" value="approved" />
                           <button className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20"><Check size={20} /></button>
                         </form>
                         <form action={handleMembershipAction}>
                           <input type="hidden" name="id" value={req._id.toString()} />
                           <input type="hidden" name="status" value="rejected" />
                           <button className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><X size={20} /></button>
                         </form>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {/* Student Active Table */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-4 gap-4">
          <h2 className="text-lg font-bold text-gray-300">Active Students ({activeStudents.length})</h2>
          
          <MemberExportButton 
            members={studentExportData} 
            title="MASTMO CLUB MEMBERSHIP LIST"
            fileName="Mastmo_Members_List"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-gray-400">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Year / Branch</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {activeStudents.map((doc: any) => {
                const mem = doc.member || doc.members?.[0];
                return (
                  <tr key={doc._id.toString()}>
                    <td className="p-4 font-bold text-white">{mem?.fullName}</td>
                    <td className="p-4 font-mono text-gray-300">{mem?.rollNo}</td>
                    <td className="p-4">
                      {/* 🟢 DYNAMIC YEAR DISPLAY */}
                      <span className="text-[#00f0ff] font-bold">
                          {getYearFromRoll(mem?.rollNo)} Year
                      </span> 
                      <span className="text-gray-400">
                          {" - " + mem?.branch}
                          {mem?.section ? ` (${mem?.section})` : ""}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{mem?.email}</td>
                    <td className="p-4 text-center">
                      <DeleteClubMemberButton memberId={doc._id.toString()} />
                    </td>
                  </tr>
                );
              })}
              {activeStudents.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No active student members.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}