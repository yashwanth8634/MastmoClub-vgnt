      import mongoose, { Schema, model, models } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["faculty", "core", "coordinator", "support"] 
    },
    image: { type: String },
    details: { type: String },
    
    // ✅ ADD THIS SECTION
    order: { 
      type: Number, 
      default: 0,  // Default rank is 0
    },

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