import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClubRegistration from "@/models/ClubRegistration";

export async function GET(request: Request) {
  try {
    // 🔐 1. Verify internal secret
    const secret = request.headers.get("x-internal-secret");

    if (secret !== process.env.INTERNAL_N8N_SECRET) {
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