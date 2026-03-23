"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";
import { failureResult, successResult, type ActionResult } from "@/lib/actionState";
import { logger } from "@/lib/logger";

const JWT_SECRET = process.env.JWT_SECRET;
type AdminDocumentLike = {
  _id: string;
  role: string;
  email: string;
  passwordHash?: string;
  toObject(): { passwordHash?: string };
};

// 1. LOGIN ACTION
export async function loginAdmin(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!JWT_SECRET) {
    logger.error("JWT_SECRET is not defined in environment variables.");
    return failureResult("Server Configuration Error");
  }

  // The form uses 'username' for the email field
  const email = (formData.get("username") as string).toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return failureResult("Email and password are required.");
  }

  try {
    await connectToDatabase();

    const admin = (await Admin.findOne({ email })) as AdminDocumentLike | null;
    if (!admin) {
      // Use a generic message to prevent email enumeration attacks
      return failureResult("Invalid credentials.");
    }

    // Robustly retrieve password hash (handles Mongoose schema caching issues in dev)
    // If the schema is stale (lowercase 'passwordhash'), admin.passwordHash might be undefined
    // even if the DB document has it. admin.toObject() gives us the raw data.
    const hash = admin.passwordHash || admin.toObject().passwordHash;

    if (!hash) {
        logger.error("Admin password hash is missing", undefined, { email });
        return failureResult("Account configuration error.");
    }

    const isPasswordValid = await bcrypt.compare(password, hash);
    if (!isPasswordValid) {
      return failureResult("Invalid credentials.");
    }

    // Credentials are valid, create JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: admin._id, role: admin.role, email: admin.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    // Set the JWT in a secure, http-only cookie
    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return successResult();
  } catch (error: unknown) {
    logger.error("Login action failed", error, { email });
    return failureResult("An internal server error occurred.");
  }
}

// 2. LOGOUT ACTION
export async function logoutAdmin() {
  const cookieStore = await cookies();
  // Delete the new authentication token
  cookieStore.delete("auth_token");

  // Redirect back to login page for a better UX
  redirect("/admin/login");
}
