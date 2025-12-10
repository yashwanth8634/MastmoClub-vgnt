import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { 
      success: true, 
      message: "Service is healthy",
      timestamp: new Date().toISOString()
    },
    { status: 200 } // ✅ Explicitly sets HTTP Status Code to 200
  );
}