"use server";

import dbConnect from "@/lib/db";
import ClubRegistration from "@/models/ClubRegistration";
import { verifyAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { validateRollNo } from "@/lib/validator";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";
import { revalidatePath } from "next/cache";
import { failureResult, getErrorMessage, successResult, type ActionResult } from "@/lib/actionState";
import { logger } from "@/lib/logger";

export async function submitClubRegistration(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await dbConnect();

    // 0. Rate Limit Check (5 requests per minute)
    const isAllowed = await rateLimit(5, 60000);
    if (!isAllowed) {
      return failureResult("Too many requests. Please try again later.");
    }
    
    // 1. Extract Data
    const type = formData.get("type") as "student" | "faculty";
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const department = formData.get("department") as string;
    const rollNo = formData.get("rollNo") ? (formData.get("rollNo") as string).toUpperCase() : undefined;
    const branch = formData.get("branch") as string;
    const section = formData.get("section") as string;
    const year = formData.get("year") as string;

    // 2. Manual Validation
    if (!fullName || fullName.length < 2) return failureResult("Name is required (min 2 chars).");
    if (!email || !email.includes("@")) return failureResult("Invalid email address.");
    if (!phone || phone.length < 10) return failureResult("Invalid phone number.");

    // ---------------------------------------------------------
    // A. FACULTY LOGIC
    // ---------------------------------------------------------
    if (type === "faculty") {
      if (!department) return failureResult("Department is required for Faculty.");

      // Check Duplicate Email
      const existingEmail = await ClubRegistration.findOne({ "member.email": email });
      if (existingEmail) {
        return failureResult("This email is already registered.");
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
        status: "pending",
        notificationSent: false,
      });

      // Send Email
      const { subject, html } = emailTemplates.membershipPending(fullName);
      await sendEmail(email, subject, html);

      revalidatePath("/admin/dashboard-group/members");
      return successResult("Faculty Application Submitted! Pending Approval.");
    }

    // ---------------------------------------------------------
    // B. STUDENT LOGIC
    // ---------------------------------------------------------
    if (type === "student") {
      if (!rollNo || !branch || !section || !year) {
        return failureResult("All fields (Roll No, Branch, Section, Year) are required.");
      }

      // 1. Check Duplicate Email
      const existingEmail = await ClubRegistration.findOne({ "member.email": email });
      if (existingEmail) {
        return failureResult("This email is already registered.");
      }

      // 2. Check Duplicate Roll No
      const existingRoll = await ClubRegistration.findOne({ "member.rollNo": rollNo });
      if (existingRoll) {
        return failureResult("This Roll Number is already registered.");
      }

      // 3. Validate Roll No Format (Using your lib/validator)
      const rollError = validateRollNo(rollNo, branch);
      if (rollError) {
        return failureResult(rollError);
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
        status: "pending",
        notificationSent: false,
      });

      // Send Email
      const { subject, html } = emailTemplates.membershipPending(fullName);
      await sendEmail(email, subject, html);

      revalidatePath("/admin/dashboard-group/members");
      return successResult("Student Membership Submitted! Pending Approval.");
    }

    return failureResult("Invalid registration type.");

  } catch (error: unknown) {
    logger.error("Club registration submission failed", error);
    return failureResult(getErrorMessage(error, "Failed to submit application."));
  }
}

export async function deleteMember(memberId: string) {

  try {
    await verifyAdmin();
    await dbConnect();

    // 1. Attempt to find and delete the member by their MongoDB _ID
    const deletedMember = await ClubRegistration.findByIdAndDelete(memberId);

    if (!deletedMember) {
      return failureResult("Member not found or already deleted.");
    }

    // 2. Revalidate the dashboard so the table updates immediately
    revalidatePath("/admin/dashboard-group/members");

    return successResult("Member deleted successfully.");

  } catch (error: unknown) {
    logger.error("Delete member action failed", error, { memberId });
    return failureResult("Failed to delete member.");
  }
}
