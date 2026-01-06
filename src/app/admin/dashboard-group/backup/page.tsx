import { Metadata } from "next";
import BackupManager from "@/components/admin/BackupManager";

export const metadata: Metadata = {
  title: "Database Backup ",
  description: "Securely download database backups.",
};

export default function BackupPage() {
  return <BackupManager />;
}