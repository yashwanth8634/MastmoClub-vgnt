"use server";

import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/auth";

// 1. CREATE MEMBER
export async function createTeamMember(formData: FormData) {
  try {
    await verifyAdmin();
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
    });

    revalidatePath("/admin/dashboard-group/team");
    revalidatePath("/team");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, message: "Failed to add member" };
  }
}

// 2. DELETE MEMBER
export async function deleteTeamMember(id: string) {
  await dbConnect();
  try {
    await TeamMember.findByIdAndDelete(id);
    revalidatePath("/admin/team");
    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}

// 3. UPDATE MEMBER
// 3. UPDATE MEMBER
export async function updateTeamMember(id: string, formData: FormData) {
  try {
    await verifyAdmin();
    await dbConnect();

    // Construct socials object
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
      image: formData.get("image"), // ✅ This receives the URL from the client form
      socials: socials,
    };

    await TeamMember.findByIdAndUpdate(id, data, { new: true });

    // ✅ FIX: Revalidate the correct paths
    revalidatePath("/admin/dashboard-group/team"); 
    revalidatePath("/team"); // Public page

    return { success: true, message: "Member updated!" };
  } catch (error: any) {
    console.error("Update failed:", error);
    return { success: false, message: "Update failed: " + error.message };
  }
}