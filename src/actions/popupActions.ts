"use server";

import dbConnect from "@/lib/db";
import Popup from "@/models/Popup";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth"; // ✅ Import Auth Check

// 1. FETCH POPUP (Public - No Auth Needed)
export async function getPopup() {
  await dbConnect();
  
  try {
    const popup = await Popup.findOne({}).lean();
    if (!popup) return null;
    return JSON.parse(JSON.stringify(popup));
  } catch (error) {
    console.error("Failed to fetch popup:", error);
    return null;
  }
}

// 2. TOGGLE STATUS (Protected)
export async function togglePopup(id: string, currentStatus: boolean) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; } // ✅ Security Check
  
  await dbConnect();

  try {
    await Popup.findByIdAndUpdate(id, { isActive: !currentStatus });
    revalidatePath("/", "layout"); 
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to toggle" };
  }
}

// 3. UPDATE POPUP CONTENT (Protected)
export async function updatePopup(formData: FormData) {
  try { await verifyAdmin(); } catch (e) { return { success: false, message: "Unauthorized" }; } // ✅ Security Check

  await dbConnect();

  try {
    const imagesRaw = formData.get("imagesJSON") as string;
    const images = imagesRaw ? JSON.parse(imagesRaw) : [];

    const existingPopup = await Popup.findOne({});

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      images: images,
      isActive: true, 
    };

    if (existingPopup) {
      await Popup.findByIdAndUpdate(existingPopup._id, data);
    } else {
      await Popup.create(data);
    }

    revalidatePath("/", "layout");
    return { success: true, message: "Popup updated successfully" };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, message: "Failed to update popup" };
  }
}