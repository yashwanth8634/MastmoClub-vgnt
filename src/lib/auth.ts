import { cookies } from "next/headers";
import { type JWTPayload, jwtVerify } from "jose";
import { AuthenticationError, AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

// Define a type for our specific JWT payload
export interface AdminJwtPayload extends JWTPayload {
  id: string;
  role: string;
  email: string;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    logger.error("JWT_SECRET is not defined in environment variables.");
    throw new AppError("Internal Server Error: JWT secret is not configured.");
  }

  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string): Promise<AdminJwtPayload> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as AdminJwtPayload;
  } catch (error) {
    logger.warn("JWT verification failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new AuthenticationError("Unauthorized: Invalid token.");
  }
}

export async function verifyAdmin(): Promise<AdminJwtPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new AuthenticationError("Unauthorized: Authentication token not found.");
  }

  return verifyToken(token);
}

/**
 * Helper to verify token string directly (useful for Middleware)
 */
export async function verifyAuthToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
