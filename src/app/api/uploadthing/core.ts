import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { verifyAdmin } from "@/lib/auth"; // Import our secure function

const f = createUploadthing();

// This function handles the authentication and returns the user ID
const handleAuth = async () => {
  try {
    const admin = await verifyAdmin();
    // The 'id' from our JWT payload is the user's database ID
    return { userId: admin.id };
  } catch (error) {
    // If verifyAdmin throws, we throw an UploadThingError
    throw new UploadThingError("Unauthorized");
  }
};

export const ourFileRouter = {
  // Gallery Route - SECURED
  galleryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 20 } })
    .middleware(handleAuth) // Use the secure auth handler
    .onUploadComplete(async ({ metadata, file }) => {
      // metadata.userId is now the authenticated admin's ID
      console.log(`Gallery upload complete for userId: ${metadata.userId}`);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

  // Team Member Profile Pic Route - SECURED
  teamImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(handleAuth) // Use the same secure auth handler
    .onUploadComplete(async ({ metadata, file }) => {
      // metadata.userId is now the authenticated admin's ID
      console.log(`Team photo uploaded for userId: ${metadata.userId}`);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;