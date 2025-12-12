"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";

// 1. CREATE EVENT
function toISTDate(dateString: any) {
  if (!dateString) return null;
  // If the string is just "2025-10-20T10:00", we append "+05:30"
  // This tells the database: "This is 10:00 AM in India"
  return new Date(`${dateString}+05:30`);
}

// 1. CREATE EVENT
export async function createEvent(formData: FormData) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; }
  await dbConnect();

  try {
    // ... get other fields (title, desc, etc.) ...
    const title = formData.get("title");
    const description = formData.get("description");
    const location = formData.get("location");
    const category = formData.get("category");
    const time = formData.get("time");
    
    // ✅ USE THE HELPER HERE
    const date = toISTDate(formData.get("date")); 
    const deadline = toISTDate(formData.get("deadline"));

    // ... get other numbers/booleans ...
    const maxRegistrations = parseInt(formData.get("maxRegistrations") as string) || 0;
    const isTeamEvent = formData.get("isTeamEvent") === "on";
    const minTeamSize = parseInt(formData.get("minTeamSize") as string) || 1;
    const maxTeamSize = parseInt(formData.get("maxTeamSize") as string) || 1;
    const rules = (formData.get("rules") as string)?.split("\n").filter(r => r.trim()) || [];

    await Event.create({
      title, description, location, category, time,
      date,      // Saved as correct UTC equivalent of IST
      deadline,  // Saved as correct UTC equivalent of IST
      maxRegistrations, isTeamEvent, minTeamSize, maxTeamSize, rules
    });

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
  } catch (e) {
    return { success: false, message: "Unauthorized" };
  }

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

// 3. TOGGLE STATUS (Active vs Past)
export async function toggleEventStatus(id: string, currentStatus: boolean) {
  try {
    await verifyAdmin(); 
  } catch (e) {
    return { success: false, message: "Unauthorized" };
  }

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

  
    // ✅ CRITICAL FIX: Parse the JSON string back into an Array
    const galleryRaw = formData.get("galleryJSON") as string;
    let gallery = [];
    try {
      gallery = galleryRaw ? JSON.parse(galleryRaw) : [];
    } catch (e) {
      console.log("Error parsing gallery JSON, skipping.");
    }

  try {
    const rules = (formData.get("rules") as string)?.split("\n").filter(r => r.trim()) || [];
    
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      category: formData.get("category"),
      time: formData.get("time"),
      gallery: gallery,
      
      // ✅ USE THE HELPER HERE TOO
      date: toISTDate(formData.get("date")),
      deadline: toISTDate(formData.get("deadline")),
      
      maxRegistrations: Number(formData.get("maxRegistrations")) || 0,
      isTeamEvent: formData.get("isTeamEvent") === "on", 
      minTeamSize: Number(formData.get("minTeamSize")) || 1,
      maxTeamSize: Number(formData.get("maxTeamSize")) || 1,
      rules: rules,
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedEvent) return { success: false, message: "Event not found" };

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/admin/dashboard-group/events/${id}/edit`);
    revalidatePath("/events");
    revalidatePath(`/events/${id}`); 
    revalidatePath("/gallery"); // ✅ Make sure Gallery page updates instantly
    return { success: true, message: "Event updated successfully" };

    return { success: true, message: "Event updated" };

  } catch (error: any) {
    return { success: false, message: "Failed: " + error.message };
  }
}