"use server";

import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";

// DELETE REGISTRATION
export async function deleteRegistration(id: string) {
  try {
    await dbConnect();
    await Registration.findByIdAndDelete(id);
    revalidatePath("/admin/dashboard-group/registrations");
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}

// UPDATE STATUS (Approve/Reject with Email - for membership applications only)
export async function updateStatus(id: string, status: string) {
  await dbConnect();
  
  try {
    const registration = await Registration.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    );

    if (!registration) {
      return { success: false, message: "Registration not found" };
    }

    // Only send approval/rejection emails for membership applications (not events)
    if (registration.eventName === "General Membership") {
      if (status === "approved") {
        const member = registration.members[0];
        if (member && member.email) {
          const { subject, html } = emailTemplates.membershipApproved(member.fullName);
          await sendEmail(member.email, subject, html);
        }
      } else if (status === "rejected") {
        const member = registration.members[0];
        if (member && member.email) {
          const { subject, html } = emailTemplates.membershipRejected(member.fullName);
          await sendEmail(member.email, subject, html);
        }
      }
    }

    revalidatePath("/admin/dashboard-group/registrations");
    return { success: true, message: `Registration ${status}` };
  } catch (error: any) {
    console.error("Status update error:", error);
    return { success: false, message: error.message };
  }
}

// DELETE MEMBER (Club membership)
export async function deleteMember(id: string) {
  try {
    await dbConnect();
    await Registration.findByIdAndDelete(id);
    revalidatePath("/admin/dashboard-group/members");
    return { success: true, message: "Member deleted successfully" };
  } catch (error: any) {
    console.error("Delete member error:", error);
    return { success: false, message: "Failed to delete member" };
  }
}
