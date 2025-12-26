import mongoose, { Schema, Document, models, model } from "mongoose";

// ✅ 1. Export TypeScript Interfaces (So you can use types in your Actions)
export interface IMember {
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  // Optional fields (Student specific)
  rollNo?: string;
  section?: string;
  year?: string;
}

export interface IClubRegistration extends Document {
  type: "student" | "faculty";
  member: IMember;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

// ✅ 2. Define the Sub-Schema (Exported in case you need to reuse it)
export const MemberSchema = new Schema<IMember>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Student Specific
  rollNo: { type: String }, 
  section: { type: String },
  year: { type: String }, 
  
  // Shared
  branch: { type: String, required: true }, 
}, { _id: false }); // _id: false prevents creating a separate ID for the nested member object

// ✅ 3. Define the Main Schema
const ClubRegistrationSchema = new Schema<IClubRegistration>({
  type: { 
    type: String, 
    enum: ["student", "faculty"], 
    required: true 
  },
  
  member: MemberSchema, 

  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
}, { timestamps: true });

// Indexes
ClubRegistrationSchema.index({ "member.email": 1 }, { unique: true });
ClubRegistrationSchema.index({ "member.rollNo": 1 }, { unique: true, sparse: true });

// ✅ 4. Export the Model
const ClubRegistration = models.ClubRegistration || model<IClubRegistration>("ClubRegistration", ClubRegistrationSchema);

export default ClubRegistration;