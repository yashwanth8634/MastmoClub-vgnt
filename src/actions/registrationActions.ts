"use server";

import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";
import { verifyAdmin } from "@/lib/auth"; // ✅ Protected

// 1. DELETE REGISTRATION (Any type)
export async function deleteRegistration(id: string) {
  try { 
    await verifyAdmin(); // Security Check
    await dbConnect();
    await Registration.findByIdAndDelete(id);
    
    revalidatePath("/admin/dashboard-group/registrations");
    revalidatePath("/admin/dashboard-group/members");
    
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}

// 2. UPDATE STATUS (Approve/Reject + Email)
export async function updateStatus(id: string, status: string) {
  try { 
    await verifyAdmin(); // Security Check
    await dbConnect();
    
    // Update DB
    const registration = await Registration.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    );

    if (!registration) return { success: false, message: "Not found" };

    // Check if we need to send Membership Emails
    // Covers both "General Membership" (Students) and "Faculty Membership"
    const isMembership = 
      registration.eventName === "General Membership" || 
      registration.eventName === "Faculty Membership";

    if (isMembership) {
      const member = registration.members[0];
      if (member && member.email) {
        let emailData;
        
        if (status === "approved") {
          emailData = emailTemplates.membershipApproved(member.fullName);
        } else if (status === "rejected") {
          emailData = emailTemplates.membershipRejected(member.fullName);
        }

        if (emailData) {
           await sendEmail(member.email, emailData.subject, emailData.html);
        }
      }
    }

    revalidatePath("/admin/dashboard-group/registrations");
    revalidatePath("/admin/dashboard-group/members");
    
    return { success: true, message: `Registration ${status}` };
    
  } catch (error: any) {
    console.error("Status update error:", error);
    return { success: false, message: error.message };
  }
}

// 3. DELETE MEMBER (Specific for Members page)
export async function deleteMember(id: string) {
  try { 
    await verifyAdmin(); // Security Check
    await dbConnect();
    await Registration.findByIdAndDelete(id);
    
    revalidatePath("/admin/dashboard-group/members");
    return { success: true, message: "Member deleted successfully" };
  } catch (error: any) {
    return { success: false, message: "Failed to delete member" };
  }
}