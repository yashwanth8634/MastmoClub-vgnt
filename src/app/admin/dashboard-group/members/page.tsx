import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import { Check, X, Download } from "lucide-react";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";
import DeleteClubMemberButton from "@/components/admin/DeleteClubMemberButton";
import MemberExportButton from "@/components/admin/MemberExportButton";

// Server Action to Approve/Reject with Email sending
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

    // ✅ FIX: Send emails for BOTH Students AND Faculty
    if (
      registration.eventName === "General Membership" || 
      registration.eventName === "Faculty Membership"
    ) {
      const member = registration.members[0];
      
      if (member && member.email) {
        if (status === "approved") {
          const { subject, html } = emailTemplates.membershipApproved(member.fullName);
          await sendEmail(member.email, subject, html);
        } else if (status === "rejected") {
          const { subject, html } = emailTemplates.membershipRejected(member.fullName);
          await sendEmail(member.email, subject, html);
        }
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
  const pendingStudents = await Registration.find({ eventName: "General Membership", status: "pending" }).lean();
  const activeStudents = await Registration.find({ eventName: "General Membership", status: "approved" }).lean();

  // 2. Fetch Faculty
  const pendingFaculty = await Registration.find({ eventName: "Faculty Membership", status: "pending" }).lean();
  const activeFaculty = await Registration.find({ eventName: "Faculty Membership", status: "approved" }).lean();

  // Prepare Data for Student Export
  const studentExportData = activeStudents.map((reg: any) => ({
    name: reg.members[0].fullName,
    rollNumber: reg.members[0].rollNo,
    email: reg.members[0].email,
    phone: reg.members[0].phone || "N/A",
    branch: reg.members[0].branch || "N/A",
    year: reg.members[0].year || "N/A",
    section: reg.members[0].section || "N/A"
  }));

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
               {pendingFaculty.map((req: any) => (
                 <div key={req._id.toString()} className="bg-white/5 border border-purple-500/30 p-4 rounded-xl flex justify-between items-center">
                   <div>
                     <h4 className="font-bold text-white">{req.members[0].fullName}</h4>
                     <p className="text-xs text-gray-400">{req.members[0].branch} • {req.members[0].section}</p>
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
               ))}
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
                <th className="p-4">Designation</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {activeFaculty.map((mem: any) => (
                <tr key={mem._id.toString()}>
                  <td className="p-4 font-bold">{mem.members[0].fullName}</td>
                  <td className="p-4">{mem.members[0].branch}</td>
                  <td className="p-4">{mem.members[0].section}</td>
                  <td className="p-4 text-gray-400">
                    <div>{mem.members[0].email}</div>
                    <div className="text-xs">{mem.members[0].phone}</div>
                  </td>
                  <td className="p-4 text-center">
                    <DeleteClubMemberButton memberId={mem._id.toString()} />
                  </td>
                </tr>
              ))}
              {activeFaculty.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No active faculty members.</td></tr>}
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
                {pendingStudents.map((req: any) => (
                  <div key={req._id.toString()} className="bg-white/5 border border-white/10 p-5 rounded-xl flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white">{req.members[0].fullName}</h3>
                      <p className="text-sm text-gray-400">{req.members[0].rollNo} • {req.members[0].branch}</p>
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
                ))}
             </div>
          </div>
        )}

        {/* Student Active Table */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-4 gap-4">
          <h2 className="text-lg font-bold text-gray-300">Active Students ({activeStudents.length})</h2>
          <MemberExportButton members={studentExportData} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-gray-400">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Class</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {activeStudents.map((mem: any) => (
                <tr key={mem._id.toString()}>
                  <td className="p-4">{mem.members[0].fullName}</td>
                  <td className="p-4 font-mono">{mem.members[0].rollNo}</td>
                  <td className="p-4">
                    {mem.members[0].branch} 
                    {mem.members[0].year ? ` - ${mem.members[0].year}` : ""}
                    {mem.members[0].section ? ` (${mem.members[0].section})` : ""}
                  </td>
                  <td className="p-4 text-gray-400">{mem.members[0].email}</td>
                  <td className="p-4 text-center">
                    <DeleteClubMemberButton memberId={mem._id.toString()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}