"use server";

import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";

// 1. SAVE IMAGE (Stores the URL from UploadThing)
export async function saveGalleryItem(title: string, category: string, imageUrl: string) {
  try {
    await verifyAdmin(); 
  } catch (e) {
    return { success: false, message: "Unauthorized" };
  }

  await dbConnect();

  try {
    // ✅ Validation: Ensure all fields are present
    if (!imageUrl || !title || !category) {
      return { success: false, message: "Missing required fields (Title, Category, or Image)" };
    }

    await Gallery.create({
      title,
      category,
      imageUrl,
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard-group/gallery");

    return { success: true, message: "Gallery item saved!" };

  } catch (error: any) {
    console.error("Gallery Save Error:", error);
    return { success: false, message: "Failed to save: " + error.message };
  }
}

// 2. DELETE IMAGE
export async function deleteGalleryItem(id: string) {
  try {
    await verifyAdmin();
  } catch (e) {
    return { success: false, message: "Unauthorized" };
  }

  await dbConnect();

  try {
    const result = await Gallery.findByIdAndDelete(id);
    
    if (!result) {
      return { success: false, message: "Image not found" };
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard-group/gallery");
    
    return { success: true, message: "Image deleted" };
  } catch (error: any) {
    console.error("Gallery Delete Error:", error); // ✅ Added logging
    return { success: false, message: "Failed to delete" };
  }
}