"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mastmo_admin_2025";

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Validate both username and password
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    
    // Set session token with additional security
    cookieStore.set("admin_token", username, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    return { success: true, message: "Login successful" };
  }

  return { success: false, message: "Invalid username or password" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}

// Verify admin is authenticated
export async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return token?.value === ADMIN_USERNAME;
}