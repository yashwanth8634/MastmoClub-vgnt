"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";
import { emailTemplates } from "@/lib/emailTemplates";
import { sendEmail } from "@/lib/email";
import { UTApi } from "uploadthing/server";

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
  try {
    await verifyAdmin();
    await dbConnect();
    const utapi = new UTApi();

    const event = await Event.findById(id);
    if (!event) return { success: false, message: "Event not found" };

    // Collect ALL keys to delete (Cover + Gallery)
    const keysToDelete: string[] = [];

    // Cover Image
    if (event.image) {
      const key = getFileKey(event.image);
      if (key) keysToDelete.push(key);
    }

    // Gallery Images
    if (event.gallery && event.gallery.length > 0) {
      event.gallery.forEach((img: string) => {
        const key = getFileKey(img);
        if (key) keysToDelete.push(key);
      });
    }

    // Bulk Delete from UploadThing
    if (keysToDelete.length > 0) {
      await utapi.deleteFiles(keysToDelete);
    }

    // Delete from DB
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

    const utapi = new UTApi();

    // 1. Fetch the EXISTING event to see what photos it had
    const existingEvent = await Event.findById(id);
    if (!existingEvent) return { success: false, message: "Event not found" };

    // 2. Get New Data
    const newImage = formData.get("image") as string;
    const newGalleryRaw = formData.get("gallery") as string;
    const newGallery = newGalleryRaw ? JSON.parse(newGalleryRaw) : [];

    // ---------------------------------------------------------
    // 🗑️ SMART DELETION LOGIC
    // ---------------------------------------------------------
    
    // A. Check Main Image (Cover)
    const oldImage = existingEvent.image;
    // If we have a new image AND it's different from the old one, delete the old one
    if (newImage && oldImage && newImage !== oldImage) {
      const key = getFileKey(oldImage);
      if (key) await utapi.deleteFiles(key);
    }

    // B. Check Gallery Images
    const oldGallery = existingEvent.gallery || [];
    // Find images that were in the OLD gallery but are NOT in the NEW gallery
    const removedImages = oldGallery.filter((img: string) => !newGallery.includes(img));

    if (removedImages.length > 0) {
      const keysToDelete = removedImages
        .map((img: string) => getFileKey(img))
        .filter((key: string | null) => key !== null) as string[];
      
      if (keysToDelete.length > 0) {
        await utapi.deleteFiles(keysToDelete);
      }
    }
    // ---------------------------------------------------------

    // 3. Update Database
    const data = {
      title: formData.get("title"),
      date: new Date(formData.get("date") as string),
      location: formData.get("location"),
      description: formData.get("description"),
      category: formData.get("category"),
      image: newImage,
      gallery: newGallery,
      registrationLink: formData.get("registrationLink"),
      isPast: formData.get("isPast") === "true",
      registrationOpen: formData.get("registrationOpen") === "true",
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