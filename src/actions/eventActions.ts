"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";
import { emailTemplates } from "@/lib/emailTemplates";
import { sendEmail } from "@/lib/email";

// Helper: Convert date strings to IST Date objects
function toISTDate(dateString: any) {
  if (!dateString) return null;
  return new Date(`${dateString}+05:30`);
}

// 1. CREATE EVENT
export async function createEvent(formData: FormData) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; }
  await dbConnect();

  try {
    const title = formData.get("title") as string;
    const dateStr = formData.get("date") as string;

    // ✅ Fix: Parse Gallery JSON if it exists during creation
    const galleryRaw = formData.get("galleryJSON") as string;
    let gallery = [];
    try { gallery = galleryRaw ? JSON.parse(galleryRaw) : []; } catch (e) {}
    
    // 1. Create the Event
    const newEvent = await Event.create({
      title,
      description: formData.get("description"),
      location: formData.get("location"),
      category: formData.get("category"),
      time: formData.get("time"),
      imageUrl: formData.get("imageUrl"), // ✅ Added: Don't lose the cover image!
      gallery: gallery,                   // ✅ Added: Save gallery on creation too
      date: toISTDate(dateStr),
      deadline: toISTDate(formData.get("deadline")),
      maxRegistrations: parseInt(formData.get("maxRegistrations") as string) || 0,
      isTeamEvent: formData.get("isTeamEvent") === "on",
      minTeamSize: parseInt(formData.get("minTeamSize") as string) || 1,
      maxTeamSize: parseInt(formData.get("maxTeamSize") as string) || 1,
      rules: (formData.get("rules") as string)?.split("\n").filter(r => r.trim()) || [],
      currentRegistrations: 0,
      registrationOpen: true
    });

    // ---------------------------------------------------------
    // 📧 AUTOMATIC EMAIL NOTIFICATION
    // ---------------------------------------------------------
    try {
      // ✅ Optimization: Use .lean() for faster read
      const members = await Registration.find({ 
        eventName: "General Membership", 
        status: "approved" 
      })
      .select("members.email")
      .lean();

      const emailList = members
        .map((reg: any) => reg.members?.[0]?.email)
        .filter((email): email is string => !!email && email.includes("@"));

      if (emailList.length > 0) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const eventLink = `${baseUrl}/events/${newEvent._id}`;
        
        const { subject, html } = emailTemplates.newEventAnnouncement(
          title, 
          dateStr, 
          eventLink
        );

        // Send (BCC list hidden from recipients)
        await sendEmail("mastmovgnt@gmail.com", subject, html, emailList);
      }
    } catch (emailErr) {
      console.error("⚠️ Event created, but emails failed:", emailErr);
    }

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/events");
    return { success: true };

  } catch (error: any) {
    console.error("Create Event Error:", error);
    return { success: false, message: "Failed: " + error.message };
  }
}

// 2. DELETE EVENT
export async function deleteEvent(id: string) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; }
  await dbConnect();
  
  try {
    await Event.findByIdAndDelete(id);
    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete event" };
  }
}

// 3. TOGGLE STATUS
export async function toggleEventStatus(id: string, currentStatus: boolean) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; }
  await dbConnect();

  try {
    await Event.findByIdAndUpdate(id, { isPast: !currentStatus });
    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update status" };
  }
}

// 4. UPDATE EVENT
export async function updateEvent(id: string, formData: FormData) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; }
  await dbConnect();

  const galleryRaw = formData.get("galleryJSON") as string;
  let gallery = [];
  try { gallery = galleryRaw ? JSON.parse(galleryRaw) : []; } catch (e) {}

  try {
    const rules = (formData.get("rules") as string)?.split("\n").filter(r => r.trim()) || [];
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      category: formData.get("category"),
      time: formData.get("time"),
      imageUrl: formData.get("imageUrl"), // Ensure image updates work
      gallery: gallery,
      date: toISTDate(formData.get("date")),
      deadline: toISTDate(formData.get("deadline")),
      maxRegistrations: Number(formData.get("maxRegistrations")) || 0,
      isTeamEvent: formData.get("isTeamEvent") === "on", 
      minTeamSize: Number(formData.get("minTeamSize")) || 1,
      maxTeamSize: Number(formData.get("maxTeamSize")) || 1,
      rules: rules,
    };

    await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    
    // Revalidate all necessary paths
    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/admin/dashboard-group/events/${id}/edit`);
    revalidatePath("/events");
    revalidatePath(`/events/${id}`); 
    revalidatePath("/gallery");
    
    return { success: true, message: "Event updated successfully" };
  } catch (error: any) { 
    return { success: false, message: "Failed: " + error.message }; 
  }
}