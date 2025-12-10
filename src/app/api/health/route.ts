import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import logger from "@/lib/logger";

export async function GET() {
  try {
    // Attempt to connect to the database
    await dbConnect();

    // Check if the connection state is "connected"
    if (mongoose.connection.readyState === 1) {
      return NextResponse.json(
        {
          status: "ok",
          database: "connected",
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      // If readyState is not 1, it indicates a problem
      logger.error("Health check failed: Database connection state is not 'connected'.");
      return NextResponse.json(
        {
          status: "error",
          database: "disconnected",
          message: "Database connection state is not 'connected'.",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    // Catch any errors during the connection attempt
    logger.error("Health check failed: Failed to connect to the database.", { error: error.message });
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: "Failed to connect to the database.",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
