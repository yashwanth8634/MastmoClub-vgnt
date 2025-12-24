import "server-only"; // 🛑 This prevents Client-Side bundling
import { UTApi } from "uploadthing/server";

export const deleteFilesFromUT = async (fileKey: string | string[]) => {
  try {
    const utapi = new UTApi();
    await utapi.deleteFiles(fileKey);
    return { success: true };
  } catch (error) {
    console.error("UTApi Delete Error:", error);
    return { success: false };
  }
};