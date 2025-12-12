"use client";

import { useState } from "react";
import { generateBackup } from "@/actions/backupActions";
import { Database, Download, ShieldCheck, Loader2, FileJson, AlertTriangle } from "lucide-react";

export default function BackupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    
    try {
      const result = await generateBackup();

      if (result.success && result.data) {
        // 1. Create a Blob from the JSON string
        const blob = new Blob([result.data], { type: "application/json" });
        
        // 2. Create a download link dynamically
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        
        // 3. Name the file with today's date
        const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        a.download = `mastmo_backup_${date}.json`;
        
        // 4. Trigger download and cleanup
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to generate backup: " + result.message);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-2">Backup & Recovery</h1>
      <p className="text-gray-400 mb-10">Securely download your entire database to local storage.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: DOWNLOAD BACKUP */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 hover:border-[#00f0ff]/50 transition-colors">
          <div className="w-20 h-20 bg-[#00f0ff]/10 text-[#00f0ff] rounded-full flex items-center justify-center">
            <Database size={40} />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Full Database Export</h3>
            <p className="text-gray-400 text-sm">
              Downloads a <code>.json</code> file containing all Events, Registrations, Members, and Gallery links.
            </p>
          </div>

          <button 
            onClick={handleDownload}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isLoading 
                ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                : "bg-[#00f0ff] text-black hover:bg-white hover:scale-[1.02]"
            }`}
          >
            {isLoading ? (
              <><Loader2 className="animate-spin" /> Generating JSON...</>
            ) : (
              <><Download size={20} /> Download Backup Now</>
            )}
          </button>
        </div>

        {/* CARD 2: INFO / INSTRUCTIONS */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-yellow-500 mb-2">
            <AlertTriangle size={24} />
            <h3 className="text-lg font-bold">Why Backup?</h3>
          </div>
          
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex gap-3">
              <ShieldCheck className="shrink-0 text-[#00f0ff]" size={18} />
              <span>
                <strong>Data Safety:</strong> Since we are on a cloud server, keeping a local copy ensures you never lose data if the server resets.
              </span>
            </li>
            <li className="flex gap-3">
              <FileJson className="shrink-0 text-[#00f0ff]" size={18} />
              <span>
                <strong>Format:</strong> The backup is a standard JSON file. You can open it in VS Code or Notepad to view raw data.
              </span>
            </li>
            <li className="flex gap-3">
              <Download className="shrink-0 text-[#00f0ff]" size={18} />
              <span>
                <strong>Frequency:</strong> We recommend downloading a backup <b>once a week</b> or after any major event.
              </span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}