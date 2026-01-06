import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClubRegistration from "@/models/ClubRegistration";

export async function POST(request: Request) {
  try {
    // 🔐 1. Verify internal secret
    // 🔐 1. Verify internal secret with timing-safe comparison
    const secret = request.headers.get("x-internal-secret");
    const expectedSecret = process.env.INTERNAL_N8N_SECRET;

    if (!secret || !expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use crypto for constant-time comparison
    // Note: We use the Node.js 'crypto' module which is available in Next.js Serverless Functions
    const { timingSafeEqual } = await import("crypto");
    const secretBuffer = Buffer.from(secret);
    const expectedBuffer = Buffer.from(expectedSecret);
    
    if (secretBuffer.length !== expectedBuffer.length || !timingSafeEqual(secretBuffer, expectedBuffer)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse body
    const { membershipId } = await request.json();

    if (!membershipId) {
      return NextResponse.json(
        { error: "membershipId is required" },
        { status: 400 }
      );
    }

    // 3. Connect DB
    await dbConnect();

    // 4. Update notificationSent
    const updated = await ClubRegistration.findByIdAndUpdate(
      membershipId,
      { notificationSent: true },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Membership not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Mark Notified Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}