import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "/api/uploadthing", // ✅ Explicitly set your API route
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: "/api/uploadthing", // ✅ Explicitly set your API route
});