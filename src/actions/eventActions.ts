"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";
import { emailTemplates } from "@/lib/emailTemplates";
import { sendEmail } from "@/lib/email";
import { deleteFilesFromUT } from "@/lib/utapi-server";

// Helper: Convert date strings to IST Date objects
function toISTDate(dateString: any) {
  if (!dateString) return null;
  return new Date(`${dateString}+05:30`);
}

const getFileKey = (url: string) => {
  if (!url || !url.includes("utfs.io")) return null;
  return url.split("/").pop();
};

// ---------------------------------------------------------
// 🛠️ HELPER: ROBUST GALLERY PARSER
// ---------------------------------------------------------
function parseGalleryFromFormData(formData: FormData): string[] {
  // 1. Check if the frontend used a specific JSON key
  const jsonRaw = formData.get("galleryJSON");
  if (jsonRaw) {
    try { return JSON.parse(jsonRaw as string); } catch (e) { return []; }
  }

  // 2. Check standard 'gallery' key
  const galleryEntries = formData.getAll("gallery");

  if (galleryEntries.length === 0) return [];

  // Case: Multiple files appended (formData.append('gallery', url1); formData.append('gallery', url2))
  if (galleryEntries.length > 1) {
    return galleryEntries.map(entry => entry.toString()).filter(url => url.includes("utfs.io"));
  }

  // Case: Single entry (Could be one URL OR a JSON string)
  const singleEntry = galleryEntries[0].toString();
  if (singleEntry.startsWith("[")) {
    try { return JSON.parse(singleEntry); } catch (e) { return []; }
  }
  
  // Case: Just one URL string
  return [singleEntry];
}


// 1. CREATE EVENT
export async function createEvent(formData: FormData) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; }
  await dbConnect();

  try {
    const title = formData.get("title") as string;
    const dateStr = formData.get("date") as string;
    const dateObj = toISTDate(dateStr) || new Date();

    const isActuallyPast = dateObj < new Date();
    const finalIsPast = isActuallyPast ? true : (formData.get("isPast") === "true");
    const finalRegOpen = isActuallyPast ? false : (formData.get("registrationOpen") === "true");

    // ✅ FIX: Capture Gallery Array Correctly
    const gallery = parseGalleryFromFormData(formData);

    // Create Event (NO 'image' field)
    const newEvent = await Event.create({
      title,
      description: formData.get("description"),
      location: formData.get("location"),
      category: formData.get("category"),
      time: formData.get("time"),
      // image: ... ❌ REMOVED as per your instruction
      gallery: gallery, // ✅ Now guaranteed to be an array of strings
      date: dateObj,
      deadline: toISTDate(formData.get("deadline")),
      maxRegistrations: parseInt(formData.get("maxRegistrations") as string) || 0,
      isTeamEvent: formData.get("isTeamEvent") === "on",
      minTeamSize: parseInt(formData.get("minTeamSize") as string) || 1,
      maxTeamSize: parseInt(formData.get("maxTeamSize") as string) || 1,
      rules: (formData.get("rules") as string)?.split("\n").filter(r => r.trim()) || [],
      currentRegistrations: 0,
      isPast: finalIsPast,
      registrationOpen: finalRegOpen
    });

    // 📧 Email Notification
    try {
      const members = await Registration.find({ eventName: "General Membership", status: "approved" }).select("members.email").lean();
      const emailList = members.map((reg: any) => reg.members?.[0]?.email).filter((email): email is string => !!email && email.includes("@"));

      if (emailList.length > 0) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const eventLink = `${baseUrl}/events/${newEvent._id}`;
        const { subject, html } = emailTemplates.newEventAnnouncement(title, dateStr, eventLink);
        await sendEmail("mastmovgnt@gmail.com", subject, html, emailList);
      }
    } catch (emailErr) {
      console.error("⚠️ Emails failed:", emailErr);
    }

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/events");
    return { success: true };

  } catch (error: any) {
    return { success: false, message: "Failed: " + error.message };
  }
}

// 2. DELETE EVENT (Fixed to only delete Gallery images)
export async function deleteEvent(id: string) {
  try {
    await verifyAdmin();
    await dbConnect();

    const event = await Event.findById(id);
    if (!event) return { success: false, message: "Event not found" };

    const keysToDelete: string[] = [];

    // Only check Gallery (No 'image' field)
    if (event.gallery && event.gallery.length > 0) {
      event.gallery.forEach((img: string) => {
        const key = getFileKey(img);
        if (key) keysToDelete.push(key);
      });
    }

    if (keysToDelete.length > 0) {
      await deleteFilesFromUT(keysToDelete);
    }

    await Event.findByIdAndDelete(id);

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/gallery");
    
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
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
  try {
    await verifyAdmin();
    await dbConnect();

    const existingEvent = await Event.findById(id);
    if (!existingEvent) return { success: false, message: "Event not found" };

    // 1. GET DATA
    const dateStr = formData.get("date") as string;
    const dateObj = toISTDate(dateStr) || new Date();
    
    // ✅ FIX: Capture Gallery Correctly
    const incomingGallery = parseGalleryFromFormData(formData);

    // 2. 🛡️ DATE LOGIC
    const isActuallyPast = dateObj < new Date();
    const finalIsPast = isActuallyPast ? true : (formData.get("isPast") === "true");
    const finalRegOpen = isActuallyPast ? false : (formData.get("registrationOpen") === "true");

    // 3. 🛡️ GALLERY MERGE LOGIC
    // We assume incomingGallery contains the FINAL list of URLs we want.
    // If incomingGallery is empty, it might be a form error, so we default to keeping existing.
    // BUT if you specifically want to support adding new photos to existing ones:
    
    let finalGallery = [];

    if (incomingGallery.length === 0) {
        // Fallback: If form sent nothing, keep old gallery
        finalGallery = existingEvent.gallery || [];
    } else {
        // Safe Merge: Combine Old + New, remove duplicates
        const oldGallery = existingEvent.gallery || [];
        // Combine arrays and use Set to remove duplicates
        finalGallery = Array.from(new Set([...oldGallery, ...incomingGallery]));
    }

    // 4. UPDATE DATABASE
    const data = {
      title: formData.get("title"),
      date: dateObj,
      location: formData.get("location"),
      description: formData.get("description"),
      category: formData.get("category"),
      // image: ... ❌ REMOVED
      gallery: finalGallery, // ✅ Update the array in Mongo
      registrationLink: formData.get("registrationLink"),
      isPast: finalIsPast,
      registrationOpen: finalRegOpen,
    };

    await Event.findByIdAndUpdate(id, data);

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/gallery");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, message: "Update failed" };
  }
}