"use server";

import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import { validateRollNo } from "@/lib/validator"; // Ensure this path is correct
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";

export async function submitRegistration(prevState: any, formData: FormData) {
  await dbConnect();

  try {
    const type = formData.get("type") as string;
    
    // ---------------------------------------------------------
    // CASE A: MEMBERSHIP APPLICATION (Join Club)
    // ---------------------------------------------------------
    if (type === "membership") {
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const fullName = formData.get("fullName") as string;
      const rawRollNo = formData.get("rollNo") as string;
      const branch = formData.get("branch") as string;
      const section = formData.get("section") as string;

      const rollNo = rawRollNo.toUpperCase();

      // 1. Check for Duplicates (Email, Phone, RollNo)
      const emailExists = await Registration.findOne({ "members.email": email, eventName: "General Membership" });
      if (emailExists) return { success: false, message: "This email is already registered" };

      const phoneExists = await Registration.findOne({ "members.phone": phone, eventName: "General Membership" });
      if (phoneExists) return { success: false, message: "This phone number is already registered" };

      const rollExists = await Registration.findOne({ "members.rollNo": rollNo, eventName: "General Membership" });
      if (rollExists) return { success: false, message: "This roll number is already registered" };

      // 2. Validate Roll Number Format
      const rollError = validateRollNo(rollNo, branch);
      if (rollError) return { success: false, message: rollError };

      // 3. Create Registration (Status: Pending)
      await Registration.create({
        eventName: "General Membership",
        teamName: null,
        members: [{ fullName, rollNo, branch, section, email, phone }],
        status: "pending" // ✅ Admin must approve this
      });

      // 4. Send Confirmation Email
      const { subject, html } = emailTemplates.membershipPending(fullName);
      await sendEmail(email, subject, html);

      return { success: true, message: "Application Pending" };
    }

    // ---------------------------------------------------------
    // CASE B: EVENT REGISTRATION
    // ---------------------------------------------------------
    const eventId = formData.get("eventId") as string;
    const teamName = formData.get("teamName") as string;
    const memberCount = parseInt(formData.get("memberCount") as string) || 1;

    // 1. Fetch Event & Validate Existence
    const event = await Event.findById(eventId);
    if (!event) return { success: false, message: "Event not found" };

    // 2. LOGIC CHECKS: Date, Deadline, Capacity
    const now = new Date();
    
    // Check if event is manually closed
    if (!event.registrationOpen) {
      return { success: false, message: "Registration is currently closed." };
    }

    // Check if Deadline Passed
    if (event.deadline && now > new Date(event.deadline)) {
      return { success: false, message: "Registration deadline has passed." };
    }

    // Check if Event is Over
    if (now > new Date(event.date)) {
      return { success: false, message: "This event has already ended." };
    }

    // Check Capacity
    if (event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations) {
      return { success: false, message: "Event is full. Registration closed." };
    }

    // 3. Parse Members
    const members = [];
    
    if (event.isTeamEvent) {
      // Loop through dynamic team inputs
      for (let i = 0; i < memberCount; i++) {
        // Look for inputs named member_0_fullName, member_1_email, etc.
        const name = formData.get(`member_${i}_fullName`) as string;
        const email = formData.get(`member_${i}_email`) as string;
        const roll = formData.get(`member_${i}_rollNo`) as string;
        const phone = formData.get(`member_${i}_phone`) as string;
        const branch = formData.get(`member_${i}_branch`) as string;
        const section = formData.get(`member_${i}_section`) as string;

        if (name && email && roll) {
          members.push({
            fullName: name,
            email: email,
            rollNo: roll.toUpperCase(),
            phone: phone,
            branch: branch,
            section: section
          });
        }
      }

      // Validate Team Size
      if (members.length < event.minTeamSize || members.length > event.maxTeamSize) {
        return { success: false, message: `Team must have ${event.minTeamSize}-${event.maxTeamSize} members` };
      }

      // Check for duplicates within the team itself
      const rollSet = new Set(members.map(m => m.rollNo));
      if (rollSet.size !== members.length) return { success: false, message: "Duplicate roll numbers in team" };

    } else {
      // Individual Event
      members.push({
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        rollNo: (formData.get("rollNo") as string).toUpperCase(),
        phone: formData.get("phone") as string,
        branch: formData.get("branch") as string,
        section: formData.get("section") as string,
      });
    }

    // 4. Check Database for Existing Registrations (Prevent Double Registering)
    for (const member of members) {
      const existingReg = await Registration.findOne({
        eventId,
        "members.rollNo": member.rollNo
      });
      if (existingReg) {
        return { success: false, message: `${member.fullName} (${member.rollNo}) is already registered.` };
      }
    }

    // 5. Create Registration (Auto-Approved)
    await Registration.create({
      eventName: event.title,
      eventId,
      teamName: event.isTeamEvent ? teamName : null,
      members,
      status: "approved"
    });

    // 6. Update Event Stats (Atomic Increment)
    await Event.findByIdAndUpdate(eventId, { 
      $inc: { currentRegistrations: 1 } 
    });

    // 7. Send Emails (To all team members)
    for (const member of members) {
      const { subject, html } = emailTemplates.eventRegistrationConfirmed(
        member.fullName, 
        event.title,
        event.isTeamEvent ? teamName : undefined
      );
      await sendEmail(member.email, subject, html);
    }

    revalidatePath(`/events/${eventId}`);
    revalidatePath("/events");

    return { success: true, message: "Registration successful!" };

  } catch (error: any) {
    console.error("Registration Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}