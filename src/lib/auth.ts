import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Define a type for our specific JWT payload
export interface AdminJwtPayload {
  id: string;
  role: string;
  email: string;
  [key: string]: any; // Allow other standard JWT claims
}

export async function verifyAdmin(): Promise<AdminJwtPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: Authentication token not found.");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables.");
    throw new Error("Internal Server Error: JWT secret is not configured.");
  }

  try {
    // Verify the token using jose (Edge compatible)
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret);
    
    return payload as unknown as AdminJwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new Error("Unauthorized: Invalid token.");
  }
}

/**
 * Helper to verify token string directly (useful for Middleware)
 */
export async function verifyAuthToken(token: string): Promise<AdminJwtPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as AdminJwtPayload;
  } catch (error) {
    return null;
  }
}