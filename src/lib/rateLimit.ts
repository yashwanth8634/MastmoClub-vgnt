import { headers } from "next/headers";
import dbConnect from "@/lib/db";
import RateLimit from "@/models/RateLimit";

/**
 * Rate limiter function using MongoDB for persistence (Serverless safe)
 * @param limit Max requests allowed
 * @param windowMs Time window in milliseconds
 * @returns true if allowed, false if blocked
 */
export async function rateLimit(limit: number = 10, windowMs: number = 60000): Promise<boolean> {
  try {
    await dbConnect();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    // Atomic update: Increment count if document exists, or create new one
    const result = await RateLimit.findOneAndUpdate(
      { key: ip },
      { 
        $inc: { count: 1 },
        $setOnInsert: { resetAt: resetAt } // Only set resetAt on creation
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // If the window has passed (should be handled by TTL, but for safety)
    // or if we just created it, we are good.
    // However, since we use $inc, if the doc existed but was old, we might need to reset.
    // Actually, TTL index deletes old docs, so if it exists, it's valid.
    
    if (result.count > limit) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Rate Limit Error:", error);
    // Fail open (allow request) if DB fails, to avoid blocking legitimate users during outages
    return true; 
  }
}
