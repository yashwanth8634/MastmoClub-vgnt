import mongoose, { Schema, model, models } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true }, // President, Faculty, etc.
    position: { type: String },
    details: { type: String }, // Roll No or Class
    category: { 
      type: String,
      required: true
    },
    image: { type: String }, // URL to image
    email: { type: String },
    phone: { type: String },
    socials: {
      linkedin: String,
      github: String,
      email: String,
      instagram: String,
      twitter: String
    }
  },
  { timestamps: true }
);

const TeamMember = models.TeamMember || model("TeamMember", TeamMemberSchema);
export default TeamMember;