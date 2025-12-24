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

// 1. CREATE EVENT
export async function createEvent(formData: FormData) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; }
  await dbConnect();

  try {
    const title = formData.get("title") as string;
    const dateStr = formData.get("date") as string;
    const dateObj = toISTDate(dateStr) || new Date();

    // ✅ FIX BUG #1 (Zombie Creation): Enforce Date Logic immediately
    const isActuallyPast = dateObj < new Date();
    const finalIsPast = isActuallyPast ? true : (formData.get("isPast") === "true");
    const finalRegOpen = isActuallyPast ? false : (formData.get("registrationOpen") === "true");

    // Parse Gallery
    const galleryRaw = formData.get("galleryJSON") as string;
    let gallery = [];
    try { gallery = galleryRaw ? JSON.parse(galleryRaw) : []; } catch (e) {}
    
    // Create Event
    const newEvent = await Event.create({
      title,
      description: formData.get("description"),
      location: formData.get("location"),
      category: formData.get("category"),
      time: formData.get("time"),
      image: formData.get("image"), // Changed from imageUrl to image to match schema
      gallery: gallery,
      date: dateObj,
      deadline: toISTDate(formData.get("deadline")),
      maxRegistrations: parseInt(formData.get("maxRegistrations") as string) || 0,
      isTeamEvent: formData.get("isTeamEvent") === "on",
      minTeamSize: parseInt(formData.get("minTeamSize") as string) || 1,
      maxTeamSize: parseInt(formData.get("maxTeamSize") as string) || 1,
      rules: (formData.get("rules") as string)?.split("\n").filter(r => r.trim()) || [],
      currentRegistrations: 0,
      isPast: finalIsPast,             // ✅ Enforced
      registrationOpen: finalRegOpen   // ✅ Enforced
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

// 2. DELETE EVENT
export async function deleteEvent(id: string) {
  try {
    await verifyAdmin();
    await dbConnect();

    const event = await Event.findById(id);
    if (!event) return { success: false, message: "Event not found" };

    const keysToDelete: string[] = [];

    if (event.image) {
      const key = getFileKey(event.image);
      if (key) keysToDelete.push(key);
    }

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
    const dateObj = toISTDate(dateStr) || new Date(); // Use helper
    const newImage = formData.get("image") as string;
    const galleryRaw = formData.get("gallery");

    // 2. 🛡️ FIX ZOMBIE EVENTS: Enforce Date Logic
    const isActuallyPast = dateObj < new Date();
    const finalIsPast = isActuallyPast ? true : (formData.get("isPast") === "true");
    const finalRegOpen = isActuallyPast ? false : (formData.get("registrationOpen") === "true");

    // 3. 🛡️ FIX GALLERY DELETION: Safe Merge
    let newGallery = [];
    if (!galleryRaw) {
        // Form sent nothing? Keep OLD gallery.
        newGallery = existingEvent.gallery || [];
    } else {
        const parsedGallery = JSON.parse(galleryRaw as string);
        // Safety: If new list is suspiciously short, merge instead of replace
        if (existingEvent.gallery?.length > 0 && parsedGallery.length < existingEvent.gallery.length) {
            newGallery = [...new Set([...existingEvent.gallery, ...parsedGallery])];
        } else {
            newGallery = parsedGallery;
        }
    }

    // 4. UPDATE DATABASE
    const data = {
      title: formData.get("title"),
      date: dateObj,
      location: formData.get("location"),
      description: formData.get("description"),
      category: formData.get("category"),
      image: newImage,
      gallery: newGallery,
      registrationLink: formData.get("registrationLink"),
      isPast: finalIsPast,             // ✅ Enforced
      registrationOpen: finalRegOpen,  // ✅ Enforced
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