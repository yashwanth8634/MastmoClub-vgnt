"use server";

import dbConnect from "@/lib/db";
import ClubRegistration from "@/models/ClubRegistration";
import { validateRollNo } from "@/lib/validator"; // Your existing validator
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";
import { revalidatePath } from "next/cache";

export async function submitClubRegistration(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    
    // 1. Identify the Type (Sent from hidden input in form)
    const type = formData.get("type") as "student" | "faculty";
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const fullName = formData.get("fullName") as string;

    // ---------------------------------------------------------
    // A. FACULTY LOGIC
    // ---------------------------------------------------------
    if (type === "faculty") {
      const department = formData.get("department") as string; // Mapped to 'branch' in DB

      // Check Duplicate Email
      const existingEmail = await ClubRegistration.findOne({ "member.email": email });
      if (existingEmail) {
        return { success: false, message: "This email is already registered." };
      }

      // Create Record
      await ClubRegistration.create({
        type: "faculty",
        member: {
          fullName,
          email,
          phone,
          branch: department, // Storing Department in 'branch' field
          // rollNo, section, year are intentionally undefined/null
        },
        status: "pending"
      });

      // Send Email
      const { subject, html } = emailTemplates.membershipPending(fullName);
      await sendEmail(email, subject, html);

      revalidatePath("/admin/dashboard-group/members");
      return { success: true, message: "Faculty Application Submitted! Pending Approval." };
    }

    // ---------------------------------------------------------
    // B. STUDENT LOGIC
    // ---------------------------------------------------------
    if (type === "student") {
      const rollNo = (formData.get("rollNo") as string).toUpperCase();
      const branch = formData.get("branch") as string;
      const section = formData.get("section") as string;
      const year = formData.get("year") as string;

      // 1. Check Duplicate Email
      const existingEmail = await ClubRegistration.findOne({ "member.email": email });
      if (existingEmail) {
        return { success: false, message: "This email is already registered." };
      }

      // 2. Check Duplicate Roll No
      const existingRoll = await ClubRegistration.findOne({ "member.rollNo": rollNo });
      if (existingRoll) {
        return { success: false, message: "This Roll Number is already registered." };
      }

      // 3. Validate Roll No Format (Using your lib/validator)
      const rollError = validateRollNo(rollNo, branch);
      if (rollError) {
        return { success: false, message: rollError };
      }

      // 4. Create Record
      await ClubRegistration.create({
        type: "student",
        member: {
          fullName,
          email,
          phone,
          rollNo,
          branch,
          section,
          year
        },
        status: "pending"
      });

      // Send Email
      const { subject, html } = emailTemplates.membershipPending(fullName);
      await sendEmail(email, subject, html);

      revalidatePath("/admin/dashboard-group/members");
      return { success: true, message: "Student Membership Submitted! Pending Approval." };
    }

    return { success: false, message: "Invalid registration type." };

  } catch (error: any) {
    console.error("Club Registration Error:", error);
    return { success: false, message: error.message || "Failed to submit application." };
  }
}

export async function deleteMember(memberId: string) {
  try {
    await dbConnect();

    // 1. Attempt to find and delete the member by their MongoDB _ID
    const deletedMember = await ClubRegistration.findByIdAndDelete(memberId);

    if (!deletedMember) {
      return { success: false, message: "Member not found or already deleted." };
    }

    // 2. Revalidate the dashboard so the table updates immediately
    revalidatePath("/admin/dashboard-group/members");

    return { success: true, message: "Member deleted successfully." };

  } catch (error: any) {
    console.error("Delete Member Error:", error);
    return { success: false, message: "Failed to delete member." };
  }
}