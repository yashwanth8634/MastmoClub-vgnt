"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. LOGIN ACTION
export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  const username = formData.get("username") as string; // You might have this field in your form

  // Debugging logs to see if server receives request
  console.log("--- LOGIN ATTEMPT ---");
  console.log("Password received:", password);

  // Replace with your real password env variable
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; 

  // Simple password check (ignoring username for now, or check it if you want)
  if (password === ADMIN_PASSWORD) {
    console.log("✅ Password Correct! Setting Cookie...");

    const cookieStore = await cookies();
    
    // Set the cookie
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      sameSite: "lax", // Relaxed setting to help with browser blocking
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return { success: true };
  } else {
    console.log("❌ Password Incorrect.");
    return { success: false, message: "Incorrect Password" };
  }
}

// 2. LOGOUT ACTION (✅ This was missing!)
export async function logoutAdmin() {
  const cookieStore = await cookies();
  
  // Delete the session cookie
  cookieStore.delete("admin_session");

  // Redirect back to login page
  redirect("/admin/login");
}