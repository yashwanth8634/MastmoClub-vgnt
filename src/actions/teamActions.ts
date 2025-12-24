"use server";

import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth"; // ✅ Essential for protection
import { deleteFilesFromUT } from "@/lib/utapi-server";



// Helper to extract File Key from UploadThing URL
const getFileKey = (url: string) => {
  if (!url || !url.includes("utfs.io")) return null;
  return url.split("/").pop();
};

// 1. CREATE MEMBER
export async function createTeamMember(formData: FormData) {
  try {
    await verifyAdmin(); // Security Check
    await dbConnect();

    const socials = {
      linkedin: formData.get("linkedin"),
      github: formData.get("github"),
      email: formData.get("email"),
      instagram: formData.get("instagram"),
    };

    await TeamMember.create({
      name: formData.get("name"),
      role: formData.get("role"),
      details: formData.get("details"),
      category: formData.get("category"),
      image: formData.get("image"),
      socials: socials,
      order: Number(formData.get("order")) || 0,
    });

    revalidatePath("/admin/dashboard-group/team");
    revalidatePath("/team");
    
    return { success: true };
  } catch (error: any) {
    console.error("Create Team Error:", error);
    return { success: false, message: "Failed to add member" };
  }
}

// 2. DELETE MEMBER
export async function deleteTeamMember(id: string) {
  try {
    await verifyAdmin();
    await dbConnect();

    // ❌ REMOVED: const utapi = new UTApi(); (This was causing the error)
  
    // 1. Find member to get image
    const member = await TeamMember.findById(id);
    if (!member) return { success: false, message: "Member not found" };

    // 2. Delete Image from UploadThing using the Helper
    if (member.image) {
      const key = getFileKey(member.image);
      if (key) {
        // ✅ Use the safe server helper
        await deleteFilesFromUT(key);
      }
    }
    
    // 3. Delete from DB
    await TeamMember.findByIdAndDelete(id);
    
    revalidatePath("/admin/dashboard-group/team"); 
    revalidatePath("/team");
    
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}
// 3. UPDATE MEMBER
export async function updateTeamMember(id: string, formData: FormData) {
  try {
    await verifyAdmin();
    await dbConnect();

    // ❌ REMOVED: const utapi = new UTApi();

    // 1. Fetch Existing Member
    const existingMember = await TeamMember.findById(id);
    if (!existingMember) return { success: false, message: "Member not found" };

    // 2. Compare Images
    const newImage = formData.get("image") as string;
    const oldImage = existingMember.image;

    // 🗑️ SMART DELETION: If image changed, delete the old one
    if (newImage && oldImage && newImage !== oldImage) {
      const key = getFileKey(oldImage);
      if (key) {
        // ✅ Use the safe server helper
        await deleteFilesFromUT(key);
      }
    }

    // 3. Update Database
    const socials = {
      linkedin: formData.get("linkedin") || "",
      github: formData.get("github") || "",
      email: formData.get("email") || "",
      instagram: formData.get("instagram") || "",
    };

    const data = {
      name: formData.get("name"),
      role: formData.get("role"),
      details: formData.get("details"),
      category: formData.get("category"),
      image: newImage, 
      socials: socials,
      order: Number(formData.get("order")) || 0,
    };

    await TeamMember.findByIdAndUpdate(id, data, { new: true });

    revalidatePath("/admin/dashboard-group/team"); 
    revalidatePath("/team"); 

    return { success: true, message: "Member updated!" };
  } catch (error: any) {
    console.error("Update failed:", error);
    return { success: false, message: "Update failed: " + error.message };
  }
}