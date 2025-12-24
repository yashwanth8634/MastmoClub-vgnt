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
    await verifyAdmin();
    await dbConnect();
    
    // 1. Fetch the registration first
    const registration = await Registration.findById(id);
    if (!registration) return { success: false, message: "Not found" };

    const isMembership = 
      registration.eventName === "General Membership" || 
      registration.eventName === "Faculty Membership";

    const member = registration.members[0];

    // =========================================================
    // CASE: REJECTION (Hard Delete)
    // =========================================================
    if (status === "rejected") {
      // Send Rejection Email (Optional: Remove if you don't want to notify)
      if (isMembership && member && member.email) {
        const emailData = emailTemplates.membershipRejected(member.fullName);
        await sendEmail(member.email, emailData.subject, emailData.html);
      }

      // 🛑 PERMANENTLY DELETE RECORD
      await Registration.findByIdAndDelete(id);

      revalidatePath("/admin/dashboard-group/registrations");
      revalidatePath("/admin/dashboard-group/members");
      return { success: true, message: "Application Rejected & Deleted" };
    }

    // =========================================================
    // CASE: APPROVAL (Update Status)
    // =========================================================
    if (status === "approved") {
      // Send Approval Email
      if (isMembership && member && member.email) {
        const emailData = emailTemplates.membershipApproved(member.fullName);
        await sendEmail(member.email, emailData.subject, emailData.html);
      }

      // Update Database
      await Registration.findByIdAndUpdate(id, { status: "approved" });

      revalidatePath("/admin/dashboard-group/registrations");
      revalidatePath("/admin/dashboard-group/members");
      return { success: true, message: "Application Approved" };
    }
    
  } catch (error: any) {
    console.error("Status update error:", error);
    return { success: false, message: error.message };
  }
  
  return { success: false, message: "Invalid action" };
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