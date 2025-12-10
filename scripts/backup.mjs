#!/usr/bin/env node
import { execa } from "execa";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// ES module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The root directory of the project
const projectRoot = path.resolve(__dirname, '..');
const backupDir = path.join(projectRoot, "backups");

// Read the MongoDB URI from the environment variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Error: MONGODB_URI environment variable is not defined."
  );
  process.exit(1);
}

// Create a filename for the backup with a timestamp
const timestamp = new Date().toISOString().replace(/:/g, "-");
const backupFile = `backup-${timestamp}`;
const backupPath = path.join(backupDir, backupFile);

async function createBackup() {
  try {
    console.log("Starting MongoDB backup...");

    // Ensure the backup directory exists
    if (!fs.existsSync(backupDir)) {
      console.log(`Creating backup directory at: ${backupDir}`);
      fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`Backup will be saved to: ${backupPath}`);

    // Execute mongodump command
    const { stdout, stderr } = await execa("mongodump", [
      `--uri=${MONGODB_URI}`,
      `--archive=${backupPath}`,
      "--gzip",
    ]);

    if (stderr) {
      console.warn(`mongodump stderr: ${stderr}`);
    }

    console.log("Backup completed successfully.");
    console.log(`\nOutput:\n${stdout}`);
  } catch (error) {
    console.error("Error creating backup:", error.message);
    if (error.stderr) {
      console.error(`mongodump error: ${error.stderr}`);
    }
    process.exit(1);
  }
}

createBackup();
