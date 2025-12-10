"use server";

import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event"; // ✅ Required to check Event Title
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

// UPDATE STATUS (Approve/Reject with Resend Email)
export async function updateStatus(id: string, status: string) {
  await dbConnect();
  
  try {
    // 1. Update status
    const registration = await Registration.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    );

    if (!registration) {
      return { success: false, message: "Registration not found" };
    }

    // ✅ FIX: Fetch the Event details using the ID stored in registration
    const event = await Event.findById(registration.eventId);

    // 3. Check if this is the "General Membership" event
    // (We check event.title because registration doesn't store the name)
    if (event && event.title === "General Membership") {
      
      const member = registration.members[0];
      
      if (member && member.email) {
        // Prepare email content
        let emailData;
        
        if (status === "approved") {
          emailData = emailTemplates.membershipApproved(member.fullName);
        } else if (status === "rejected") {
          emailData = emailTemplates.membershipRejected(member.fullName);
        }

        // ✅ SEND EMAIL (Resend handles this automatically)
        if (emailData) {
           await sendEmail(member.email, emailData.subject, emailData.html);
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

// DELETE MEMBER
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