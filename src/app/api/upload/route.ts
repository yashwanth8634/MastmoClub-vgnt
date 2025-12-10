import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import logger from "@/lib/logger";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST /api/upload - Upload a file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("type") as string; // "member", "event", "team"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (err) {
      logger.error("Failed to create upload directory", { error: String(err) });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = path.extname(file.name);
    const filename = `${fileType}-${timestamp}-${random}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${filename}`;

    logger.info("File uploaded successfully", { 
      filename, 
      type: fileType,
      size: file.size,
      url: publicUrl
    });

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        filename,
        url: publicUrl,
        size: file.size,
        type: file.type,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Upload failed", { error: String(error) });
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/upload/list - List all uploaded files
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication via cookie
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken || adminToken !== "authenticated") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get("type"); // filter by type

    // For now, return empty - in production, you'd scan the directory
    return NextResponse.json(
      {
        success: true,
        message: "Upload directory created. Files are saved to /public/uploads",
        uploadDir: "/uploads",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("List uploads failed", { error: String(error) });
    return NextResponse.json(
      { error: "Failed to list uploads" },
      { status: 500 }
    );
  }
}
