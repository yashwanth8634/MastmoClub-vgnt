import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    default: "Event" // Event, Workshop, Team, etc.
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  uploadedBy: { 
    type: String, 
    default: "Admin" 
  },
}, { timestamps: true });

// Prevent "OverwriteModelError" in Next.js hot reloading
export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);