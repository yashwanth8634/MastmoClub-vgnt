import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClubRegistration from "@/models/ClubRegistration";

export async function GET(request: Request) {
  try {
    // 🔐 1. Verify internal secret
    // 🔐 1. Verify internal secret with timing-safe comparison
    const secret = request.headers.get("x-internal-secret");
    const expectedSecret = process.env.INTERNAL_N8N_SECRET;

    if (!secret || !expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { timingSafeEqual } = await import("crypto");
    const secretBuffer = Buffer.from(secret);
    const expectedBuffer = Buffer.from(expectedSecret);

    if (secretBuffer.length !== expectedBuffer.length || !timingSafeEqual(secretBuffer, expectedBuffer)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Connect DB
    await dbConnect();

    // 3. Fetch pending + not notified memberships
    const pending = await ClubRegistration.find(
      {
        status: "pending",
        notificationSent: false,
      },
      {
        // 🔽 projection (only what we need)
        fullName: "$member.fullName",
        email: "$member.email",
        rollNo: "$member.rollNo",
        branch: "$member.branch",
        year: "$member.year",
      }
    );

    return NextResponse.json(pending, { status: 200 });

  } catch (error) {
    console.error("Pending Membership Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}