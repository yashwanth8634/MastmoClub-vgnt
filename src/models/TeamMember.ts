import mongoose, { Schema, model, models } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    
    // ✅ FIX: Add "patron" to this list
    category: { 
      type: String, 
      required: true, 
      enum: ["faculty", "core", "coordinator", "support", "patron"] 
    },

    image: { type: String }, // Optional
    details: { type: String },
    
    order: { type: Number, default: 0 },

    socials: {
      linkedin: String,
      github: String,
      email: String,
      instagram: String,
    },
  },
  { timestamps: true }
);

const TeamMember = models.TeamMember || model("TeamMember", TeamMemberSchema);

export default TeamMember;