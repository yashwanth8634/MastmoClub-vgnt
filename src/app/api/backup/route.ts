import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import fs from "fs/promises";
import logger from "@/lib/logger";

const execAsync = promisify(exec);

// Helper to get project root
function getProjectRoot() {
  return path.resolve(process.cwd());
}

// POST /api/backup - Create a backup
export async function POST(request: NextRequest) {
  // Verify admin authentication via cookie
  const adminToken = request.cookies.get("admin_token")?.value;
  if (!adminToken || adminToken !== "authenticated") {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 401 }
    );
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      logger.error("Backup failed: MONGODB_URI not configured");
      return NextResponse.json(
        { error: "MongoDB URI not configured" },
        { status: 500 }
      );
    }

    const projectRoot = getProjectRoot();
    const backupDir = path.join(projectRoot, "backups");
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const backupFile = `backup-${timestamp}`;
    const backupPath = path.join(backupDir, backupFile);

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true });

    logger.info(`Starting MongoDB backup to ${backupPath}`);

    // Execute mongodump
    const { stdout, stderr } = await execAsync(
      `mongodump --uri="${MONGODB_URI}" --archive="${backupPath}" --gzip`,
      { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer for large databases
    );

    if (stderr) {
      logger.warn(`mongodump warning: ${stderr}`);
    }

    logger.info(`Backup completed successfully: ${backupFile}`);

    return NextResponse.json(
      {
        success: true,
        message: "Backup created successfully",
        backupFile,
        timestamp: new Date().toISOString(),
        path: backupPath,
      },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error(`Backup creation failed: ${error.message}`);
    return NextResponse.json(
      {
        error: "Backup creation failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET /api/backup - List available backups
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const adminToken = request.cookies.get("admin_token")?.value;
  if (!adminToken || adminToken !== "authenticated") {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 401 }
    );
  }

  try {
    const projectRoot = getProjectRoot();
    const backupDir = path.join(projectRoot, "backups");

    // Check if backup directory exists
    let backups: string[] = [];
    try {
      backups = await fs.readdir(backupDir);
      backups = backups
        .filter((f) => f.startsWith("backup-"))
        .sort()
        .reverse(); // Most recent first
    } catch (error) {
      // Backup directory doesn't exist yet
      logger.info("No backups found - backup directory does not exist");
    }

    return NextResponse.json(
      {
        success: true,
        backups,
        count: backups.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error(`Failed to list backups: ${error.message}`);
    return NextResponse.json(
      {
        error: "Failed to list backups",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/backup?action=restore - Restore from a backup
export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const adminToken = request.cookies.get("admin_token")?.value;
  if (!adminToken || adminToken !== "authenticated") {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { backupFile, targetUri } = body;

    if (!backupFile || !targetUri) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          required: ["backupFile", "targetUri"],
        },
        { status: 400 }
      );
    }

    const projectRoot = getProjectRoot();
    const backupPath = path.join(projectRoot, "backups", backupFile);

    // Security: Ensure the file exists and is in the backups directory
    if (!backupPath.startsWith(path.join(projectRoot, "backups"))) {
      return NextResponse.json(
        { error: "Invalid backup file path" },
        { status: 400 }
      );
    }

    // Check if backup file exists
    await fs.access(backupPath);

    logger.info(`Starting restore from backup: ${backupFile} to ${targetUri}`);

    // Execute mongorestore
    const { stdout, stderr } = await execAsync(
      `mongorestore --uri="${targetUri}" --archive="${backupPath}" --gzip`,
      { maxBuffer: 10 * 1024 * 1024 }
    );

    if (stderr) {
      logger.warn(`mongorestore warning: ${stderr}`);
    }

    logger.info(`Restore completed successfully from ${backupFile}`);

    return NextResponse.json(
      {
        success: true,
        message: "Database restored successfully",
        backupFile,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error(`Restore failed: ${error.message}`);
    return NextResponse.json(
      {
        error: "Restore operation failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
