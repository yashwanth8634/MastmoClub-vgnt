"use server";

import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import { validateRollNo } from "@/lib/validator";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";

export async function submitRegistration(prevState: any, formData: FormData) {
  await dbConnect();

  try {
    const type = formData.get("type") as string;
    
    // CASE A: MEMBERSHIP APPLICATION
    if (type === "membership") {
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const fullName = formData.get("fullName") as string;
      const rollNo = (formData.get("rollNo") as string).toUpperCase();
      const branch = formData.get("branch") as string;
      
      // Check for duplicate email
      const emailExists = await Registration.findOne({ 
        "members.email": email,
        eventName: "General Membership" 
      });
      if (emailExists) {
        return { success: false, message: "This email is already registered" };
      }

      // Check for duplicate phone
      const phoneExists = await Registration.findOne({ 
        "members.phone": phone,
        eventName: "General Membership" 
      });
      if (phoneExists) {
        return { success: false, message: "This phone number is already registered" };
      }

      // Check for duplicate roll number
      const rollExists = await Registration.findOne({ 
        "members.rollNo": rollNo,
        eventName: "General Membership" 
      });
      if (rollExists) {
        return { success: false, message: "This roll number is already registered" };
      }

      // Validate Roll format
      const rollError = validateRollNo(rollNo, branch);
      if (rollError) return { success: false, message: rollError };

      const registration = await Registration.create({
        eventName: "General Membership", // Fixed name for club joining
        teamName: null,
        members: [{
          fullName,
          rollNo,
          branch,
          section: formData.get("section"),
          email,
          phone,
        }],
        status: "pending" // ✅ Requires Admin Approval
      });

      // Send confirmation email
      const { subject, html } = emailTemplates.membershipPending(fullName);
      await sendEmail(email, subject, html);

      return { success: true, message: "Application Pending" };
    }

    // CASE B: EVENT REGISTRATION
    const eventId = formData.get("eventId") as string;
    const teamName = formData.get("teamName") as string;
    const event = await Event.findById(eventId);
    
    if (!event) return { success: false, message: "Event not found" };
    
    // Check if registration is closed (deadline passed or capacity reached)
    const now = new Date();
    const deadline = event.deadline ? new Date(event.deadline) : null;
    const isClosed = !event.registrationOpen || (deadline && now > deadline);
    
    if (isClosed) {
      return { success: false, message: "Registrations for this event are closed" };
    }

    // Parse members from form
    const isTeamEvent = event.isTeamEvent;
    const members = [];

    if (isTeamEvent) {
      // Team event: collect multiple members
      for (let i = 0; i < 10; i++) {
        const name = formData.get(`member_${i}_name`) as string;
        if (!name) break;
        members.push({
          fullName: name,
          email: formData.get(`member_${i}_email`) as string,
          rollNo: (formData.get(`member_${i}_rollNo`) as string).toUpperCase(),
        });
      }
    } else {
      // Individual event
      members.push({
        fullName: formData.get("name") as string,
        email: formData.get("email") as string,
        rollNo: (formData.get("rollNo") as string).toUpperCase(),
      });
    }

    if (members.length === 0) {
      return { success: false, message: "No members provided" };
    }

    // Check for duplicate registrations (same person in same event)
    for (const member of members) {
      const existingReg = await Registration.findOne({
        eventId,
        "members.rollNo": member.rollNo
      });
      if (existingReg) {
        return { success: false, message: `${member.fullName} is already registered for this event` };
      }
    }

    // Check for duplicate roll numbers within the team
    const rollNos = members.map(m => m.rollNo);
    const uniqueRollNos = new Set(rollNos);
    if (uniqueRollNos.size !== rollNos.length) {
      return { success: false, message: "Duplicate roll numbers in team members" };
    }

    // Check for duplicate emails within the team
    const emails = members.map(m => m.email);
    const uniqueEmails = new Set(emails);
    if (uniqueEmails.size !== emails.length) {
      return { success: false, message: "Duplicate emails in team members" };
    }

    // Validate team size for team events
    if (isTeamEvent) {
      if (members.length < event.minTeamSize || members.length > event.maxTeamSize) {
        return { 
          success: false, 
          message: `Team must have ${event.minTeamSize}-${event.maxTeamSize} members` 
        };
      }
    }

    // Check if registration capacity is reached (before creating)
    if (event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations) {
      return { success: false, message: "Event registration is full" };
    }

    const registration = await Registration.create({
      eventName: event.title,
      eventId,
      teamName: isTeamEvent ? teamName : null,
      members,
      status: "approved" // ✅ Auto-approved for events
    });

    // Increment registration count and check if capacity is now reached
    const registrationCount = event.currentRegistrations + 1;
    const updateData: any = { currentRegistrations: registrationCount };
    
    // Auto-close registration if max capacity reached
    if (event.maxRegistrations > 0 && registrationCount >= event.maxRegistrations) {
      updateData.registrationOpen = false;
    }
    
    await Event.findByIdAndUpdate(eventId, updateData);

    // Send confirmation email to all members
    const eventName = event.title;
    for (const member of members) {
      const { subject, html } = emailTemplates.eventRegistrationConfirmed(
        member.fullName, 
        eventName,
        isTeamEvent ? teamName : undefined
      );
      await sendEmail(member.email, subject, html);
    }

    revalidatePath(`/events/${eventId}`);
    revalidatePath("/events");

    return { success: true, message: "Registered successfully!" };

  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, message: error.message };
  }
}