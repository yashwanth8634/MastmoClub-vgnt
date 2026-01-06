"use client";

import { useState } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onFileSelected: (url: string, filename: string) => void;
  fileType: "member" | "event" | "team";
  existingImage?: string;
}

export function FileUpload({ onFileSelected, fileType, existingImage }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess(false);

    // Validate file on client
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, WebP, GIF)");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(true);
      onFileSelected(data.url, data.filename);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-gray-300 text-xs font-bold uppercase tracking-widest">
        Photo Upload
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-32 bg-black border border-white/10 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-black/75 p-1 rounded hover:bg-black transition"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}

      {/* Upload input */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
          id={`upload-${fileType}`}
        />
        <label
          htmlFor={`upload-${fileType}`}
          className={`flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading
              ? "border-gray-600 bg-gray-900/20 cursor-not-allowed"
              : "border-[#00f0ff]/50 hover:border-[#00f0ff] hover:bg-[#00f0ff]/5"
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin">
                <Upload size={18} className="text-[#00f0ff]" />
              </div>
              <span className="text-sm text-gray-300">Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={18} className="text-[#00f0ff]" />
              <span className="text-sm text-gray-300">Click to upload image</span>
            </>
          )}
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <Check size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-400">Image uploaded successfully</p>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Maximum file size: 5MB. Supported formats: JPEG, PNG, WebP, GIF
      </p>
    </div>
  );
}
