import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import { Check, X } from "lucide-react";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";
import DeleteClubMemberButton from "@/components/admin/DeleteClubMemberButton";

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

    if (!registration) {
      return;
    }

    // Send approval/rejection emails for membership applications
    if (registration.eventName === "General Membership") {
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
  
  // Fetch Membership requests only - use lean() to convert to plain objects
  const pending = await Registration.find({ eventName: "General Membership", status: "pending" }).lean();
  const active = await Registration.find({ eventName: "General Membership", status: "approved" }).lean();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Club Membership</h1>

      {/* PENDING REQUESTS */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Pending Requests ({pending.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pending.map((req) => (
            <div key={req._id.toString()} className="bg-white/5 border border-white/10 p-5 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">{req.members[0].fullName}</h3>
                <p className="text-sm text-gray-400">{req.members[0].rollNo} • {req.members[0].branch}</p>
                <p className="text-xs text-gray-500">{req.members[0].email}</p>
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
          {pending.length === 0 && <p className="text-gray-500">No pending requests.</p>}
        </div>
      </div>

      {/* ACTIVE MEMBERS LIST */}
      <div>
        <h2 className="text-xl font-bold text-math-cyan mb-4">Active Members ({active.length})</h2>
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-gray-400">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Branch</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {active.map((mem) => (
                <tr key={mem._id.toString()}>
                  <td className="p-4">{mem.members[0].fullName}</td>
                  <td className="p-4 font-mono">{mem.members[0].rollNo}</td>
                  <td className="p-4">{mem.members[0].branch}</td>
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