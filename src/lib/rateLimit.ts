import { headers } from "next/headers";
import dbConnect from "@/lib/db";
import RateLimit from "@/models/RateLimit";
import { logger } from "@/lib/logger";

function normalizeIp(rawIp: string | null): string {
  if (!rawIp) {
    return "unknown";
  }

  return rawIp.split(",")[0]?.trim() || "unknown";
}

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
    const ip = normalizeIp(
      headersList.get("cf-connecting-ip") ||
        headersList.get("x-real-ip") ||
        headersList.get("x-forwarded-for"),
    );
    const windowKey = `${ip}:${Math.floor(Date.now() / windowMs)}`;
    
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    const result = await RateLimit.findOneAndUpdate(
      { key: windowKey },
      { 
        $inc: { count: 1 },
        $setOnInsert: { resetAt }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!result || result.count > limit) {
      return false;
    }

    return true;
  } catch (error: unknown) {
    logger.error("Rate limit check failed", error);
    // Fail open (allow request) if DB fails, to avoid blocking legitimate users during outages
    return true; 
  }
}
