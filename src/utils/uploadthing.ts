"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type UploadEndpoint = keyof OurFileRouter;

type CompressionPreset = {
  maxDimension: number;
  targetMaxBytes: number;
  quality: number;
};

const compressionPresets: Record<UploadEndpoint, CompressionPreset> = {
  galleryImage: {
    maxDimension: 1600,
    targetMaxBytes: 1.6 * 1024 * 1024,
    quality: 0.78,
  },
  teamImage: {
    maxDimension: 900,
    targetMaxBytes: 700 * 1024,
    quality: 0.74,
  },
};

const passthroughTypes = new Set(["image/gif", "image/svg+xml"]);

function renameToWebp(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "") + ".webp";
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to decode image: ${file.name}`));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/webp", quality);
  });
}

async function compressImage(file: File, preset: CompressionPreset) {
  if (!file.type.startsWith("image/") || passthroughTypes.has(file.type)) {
    return file;
  }

  const image = await loadImage(file);
  const maxOriginalSide = Math.max(image.naturalWidth, image.naturalHeight);
  const initialScale = maxOriginalSide > preset.maxDimension
    ? preset.maxDimension / maxOriginalSide
    : 1;

  let width = Math.max(1, Math.round(image.naturalWidth * initialScale));
  let height = Math.max(1, Math.round(image.naturalHeight * initialScale));
  let quality = preset.quality;
  let bestBlob: Blob | null = null;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, quality);
    if (!blob) {
      return file;
    }

    if (!bestBlob || blob.size < bestBlob.size) {
      bestBlob = blob;
    }

    if (blob.size <= preset.targetMaxBytes) {
      break;
    }

    width = Math.max(1, Math.round(width * 0.85));
    height = Math.max(1, Math.round(height * 0.85));
    quality = Math.max(0.55, quality - 0.08);
  }

  if (!bestBlob || bestBlob.size >= file.size) {
    return file;
  }

  return new File([bestBlob], renameToWebp(file.name), {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export function getCompressedUploadFiles(endpoint: UploadEndpoint) {
  return async (files: File[]) => {
    const preset = compressionPresets[endpoint];
    return Promise.all(
      files.map(async (file) => {
        try {
          return await compressImage(file, preset);
        } catch {
          return file;
        }
      }),
    );
  };
}

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "/api/uploadthing", // ✅ Explicitly set your API route
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: "/api/uploadthing", // ✅ Explicitly set your API route
});
