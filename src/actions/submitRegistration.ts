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

    // ---------------------------------------------------------
    // 1. FACULTY REGISTRATION
    // ---------------------------------------------------------
    if (type === "faculty") {
      const email = formData.get("email") as string;
      const fullName = formData.get("fullName") as string;
      
      const existing = await Registration.findOne({ 
        "members.email": email, 
        eventName: "Faculty Membership" 
      });
      if (existing) return { success: false, message: "Email already registered." };

      await Registration.create({
        eventName: "Faculty Membership",
        eventId: null,
        members: [{ 
          fullName, 
          email, 
          phone: formData.get("phone"), 
          branch: formData.get("department"), 
          section: formData.get("branch"),    
          rollNo: "FACULTY" 
        }],
        status: "pending"
      });

      const { subject, html } = emailTemplates.membershipPending(fullName);
      await sendEmail(email, subject, html);

      return { success: true, message: "Faculty Application Submitted!" };
    }

    // ---------------------------------------------------------
    // 2. STUDENT MEMBERSHIP
    // ---------------------------------------------------------
    if (type === "membership") {
      const email = formData.get("email") as string;
      const rollNo = (formData.get("rollNo") as string).toUpperCase();
      const fullName = formData.get("fullName") as string;
      const branch = formData.get("branch") as string;

      const emailExists = await Registration.findOne({ "members.email": email, eventName: "General Membership" });
      if (emailExists) return { success: false, message: "Email already registered" };

      const rollExists = await Registration.findOne({ "members.rollNo": rollNo, eventName: "General Membership" });
      if (rollExists) return { success: false, message: "Roll Number already registered" };

      const rollError = validateRollNo(rollNo, branch);
      if (rollError) return { success: false, message: rollError };

      await Registration.create({
        eventName: "General Membership",
        members: [{ 
          fullName, rollNo, branch, 
          section: formData.get("section"), 
          email, phone: formData.get("phone") 
        }],
        status: "pending" 
      });

      const { subject, html } = emailTemplates.membershipPending(fullName);
      await sendEmail(email, subject, html);

      return { success: true, message: "Membership Application Submitted!" };
    }

    // ---------------------------------------------------------
    // 3. EVENT REGISTRATION
    // ---------------------------------------------------------
    const eventId = formData.get("eventId") as string;
    
    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) return { success: false, message: "Event not found" };

      if (!event.registrationOpen) return { success: false, message: "Registration closed." };
      if (event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations) {
        return { success: false, message: "Event is full." };
      }

      // Parse Members
      const members = [];
      const memberCount = parseInt(formData.get("memberCount") as string) || 1;

      if (event.isTeamEvent) {
        for (let i = 0; i < memberCount; i++) {
          const name = formData.get(`member_${i}_fullName`) as string;
          const roll = formData.get(`member_${i}_rollNo`) as string;
          if (name && roll) {
            members.push({
              fullName: name,
              email: formData.get(`member_${i}_email`),
              rollNo: roll.toUpperCase(),
              phone: formData.get(`member_${i}_phone`),
              branch: formData.get(`member_${i}_branch`),
              section: formData.get(`member_${i}_section`),
            });
          }
        }
      } else {
        members.push({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          rollNo: (formData.get("rollNo") as string).toUpperCase(),
          phone: formData.get("phone"),
          branch: formData.get("branch"),
          section: formData.get("section"),
        });
      }

      // Verify Membership
      for (const m of members) {
        const isMember = await Registration.exists({
          eventName: "General Membership",
          "members.rollNo": m.rollNo,
          status: "approved"
        });
        if (!isMember) return { success: false, message: `Roll No ${m.rollNo} is not a Club Member.` };
        
        const isRegistered = await Registration.exists({ eventId, "members.rollNo": m.rollNo });
        if (isRegistered) return { success: false, message: `Roll No ${m.rollNo} already registered.` };
      }

      // Create
      await Registration.create({
        eventName: event.title,
        eventId,
        teamName: formData.get("teamName"),
        members,
        status: "approved"
      });

      // Update Stats
      await Event.findByIdAndUpdate(eventId, { $inc: { currentRegistrations: 1 } });

      // Send Email
      for (const m of members) {
        const { subject, html } = emailTemplates.eventRegistrationApproved(m.fullName as string, event.title);
        await sendEmail(m.email as string, subject, html);
      }

      revalidatePath(`/events/${eventId}`);
      return { success: true, message: "Registration Successful!" };
    }

    return { success: false, message: "Invalid form type" };

  } catch (error: any) {
    console.error("Submission Error:", error);
    return { success: false, message: "Server Error: " + error.message };
  }
}