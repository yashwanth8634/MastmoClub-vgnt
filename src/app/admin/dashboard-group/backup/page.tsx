"use client";

import { useState, useEffect } from "react";
import { Download, RotateCcw, RefreshCw } from "lucide-react";

export default function BackupPage() {
  const [backups, setBackups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/backup", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setBackups(data.backups);
        setMessage("");
      } else if (response.status === 401) {
        setMessage("✗ Unauthorized: Session expired. Please login again.");
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("✗ Failed to load backups");
    }
    setLoading(false);
  };

  const createBackup = async () => {
    setCreatingBackup(true);
    setMessage("");
    try {
      const response = await fetch("/api/backup", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setMessage("✓ Backup created successfully!");
        loadBackups();
      } else if (response.status === 401) {
        setMessage("✗ Unauthorized: Session expired. Please login again.");
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("✗ Failed to create backup");
    }
    setCreatingBackup(false);
  };

  const restoreBackup = async (backupFile: string) => {
    if (
      !confirm(
        `⚠️ WARNING: This will overwrite the current database.\n\nAre you absolutely sure?`
      )
    ) {
      return;
    }

    setRestoringBackup(backupFile);
    setMessage("");
    try {
      const response = await fetch("/api/backup", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backupFile,
          targetUri: "mongodb://localhost:27017/mastmoclub",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("✓ Backup restored successfully! Database has been updated.");
        loadBackups();
      } else if (response.status === 401) {
        setMessage("✗ Unauthorized: Session expired. Please login again.");
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("✗ Failed to restore backup");
    }
    setRestoringBackup(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Database Backup & Recovery</h1>
        <p className="text-gray-400">Manage database backups for disaster recovery</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.startsWith("✓")
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <button
          onClick={createBackup}
          disabled={creatingBackup}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition"
        >
          {creatingBackup ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Creating backup...
            </>
          ) : (
            <>
              <Download size={20} />
              Create Backup Now
            </>
          )}
        </button>
        <p className="text-sm text-gray-400 mt-3">
          Creates a compressed backup of the entire MongoDB database. This can be restored later if needed.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Available Backups ({backups.length})</h2>

        {loading ? (
          <p className="text-gray-400">Loading backups...</p>
        ) : backups.length === 0 ? (
          <p className="text-gray-500">No backups available. Create one to get started.</p>
        ) : (
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup}
                className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-lg hover:border-white/20 transition"
              >
                <div>
                  <p className="font-mono text-sm text-white">{backup}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(
                      backup
                        .replace("backup-", "")
                        .replace(/-/g, ":")
                        .replace("T", " ")
                    ).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => restoreBackup(backup)}
                  disabled={restoringBackup === backup}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 text-white rounded-lg text-sm font-medium transition"
                >
                  {restoringBackup === backup ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={16} />
                      Restore
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-blue-200 text-sm space-y-2">
        <p className="font-bold">💡 Best Practices:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Create daily backups using automated cron jobs in production</li>
          <li>Store backups in a separate location (cloud storage, external drive)</li>
          <li>Test restore procedures regularly to ensure backups work</li>
          <li>Always restore to a test database first before production</li>
          <li>Document backup and recovery procedures in your team wiki</li>
        </ul>
      </div>
    </div>
  );
}
