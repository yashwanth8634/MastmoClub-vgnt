import mongoose, { Schema, model, models } from "mongoose";

const PopupSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // ⚠️ CHANGED: Now storing a list of image URLs
  images: { type: [String], default: [] }, 
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

const Popup = models.Popup || model("Popup", PopupSchema);
export default Popup;