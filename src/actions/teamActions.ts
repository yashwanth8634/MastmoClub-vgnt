"use server";

import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth"; // ✅ Essential for protection

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
    await verifyAdmin(); // 🔴 ADDED SECURITY CHECK HERE
  } catch (e) {
    return { success: false, message: "Unauthorized" };
  }

  await dbConnect();
  
  try {
    await TeamMember.findByIdAndDelete(id);
    
    // ✅ Fix: Use the correct admin path
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
    await verifyAdmin(); // Security Check
    await dbConnect();

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
      image: formData.get("image"),
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