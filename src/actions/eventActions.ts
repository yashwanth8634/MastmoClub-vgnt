"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { revalidatePath } from "next/cache";

// 1. CREATE EVENT
export async function createEvent(formData: FormData) {
  await dbConnect();

  const title = formData.get("title");
  const date = formData.get("date");
  const time = formData.get("time");
  const location = formData.get("location");
  const description = formData.get("description");
  
  // New Fields
  const deadline = formData.get("deadline");
  const isTeamEvent = formData.get("isTeamEvent") === "on";
  const minTeamSize = parseInt(formData.get("minTeamSize") as string) || 1;
  const maxTeamSize = parseInt(formData.get("maxTeamSize") as string) || 1;

  const rulesRaw = formData.get("rules") as string;
  const rules = rulesRaw ? rulesRaw.split("\n").filter(line => line.trim() !== "") : [];

  try {
    await Event.create({
      title, date, time, location, description, rules,
      category: "Event", // Default
      deadline,
      isTeamEvent,
      minTeamSize,
      maxTeamSize
    });
  } catch (error) {
    return { success: false, message: "Failed to create event" };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

// 2. DELETE EVENT (✅ This was missing)
export async function deleteEvent(id: string) {
  await dbConnect();
  try {
    await Event.findByIdAndDelete(id);
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete event" };
  }
}

// 3. TOGGLE STATUS (✅ This was missing)
export async function toggleEventStatus(id: string, currentStatus: boolean) {
  await dbConnect();
  try {
    await Event.findByIdAndUpdate(id, { isPast: !currentStatus });
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update status" };
  }
}

// 4. UPDATE EVENT (For Edit Page)
// 4. UPDATE EVENT
export async function updateEvent(id: string, formData: FormData) {
  await dbConnect();

  try {
    // 1. Parse Rules safely
    const rulesRaw = formData.get("rules") as string;
    const rules = rulesRaw ? rulesRaw.split("\n").filter(line => line.trim() !== "") : [];

    // 2. Parse Gallery safely
    const galleryRaw = formData.get("galleryJSON") as string;
    let gallery = [];
    try {
      gallery = galleryRaw ? JSON.parse(galleryRaw) : [];
    } catch (e) {
      console.error("Gallery Parse Error:", e);
    }

    // 3. Construct Data Object Explicitly
    const data = {
      title: formData.get("title"),
      date: formData.get("date"),
      time: formData.get("time"),
      location: formData.get("location"),
      description: formData.get("description"),
      // Handle Team Settings
      isTeamEvent: formData.get("isTeamEvent") === "on", // Checkbox sends "on" if checked
      minTeamSize: Number(formData.get("minTeamSize")) || 1,
      maxTeamSize: Number(formData.get("maxTeamSize")) || 1,
      // Arrays
      rules: rules,
      gallery: gallery,
    };

    // 4. Perform Update
    // { new: true } ensures we get the updated doc, runValidators checks schema rules
    const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!updatedEvent) {
      return { success: false, message: "Event not found" };
    }

    // 5. Refresh Data
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}/edit`); // Refresh the edit page itself
    revalidatePath("/events");
    revalidatePath(`/events/${id}`); // Refresh the public details page

    return { success: true, message: "Event updated successfully" };

  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, message: "Failed to update: " + error.message };
  }
}