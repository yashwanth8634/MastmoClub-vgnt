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
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Regex for basic email validation
const emailRegex = /^\S+@\S+\.\S+$/;
// Regex for basic phone number validation (allows for digits, spaces, hyphens, and parentheses)
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;


// ✅ 2. Define the Sub-Schema (Exported in case you need to reuse it)
export const MemberSchema = new Schema<IMember>({
  fullName: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true,
    match: [emailRegex, "Please enter a valid email address"]
  },
  phone: { 
    type: String, 
    required: true,
    trim: true,
    match: [phoneRegex, "Please enter a valid phone number"]
  },
  
  // Student Specific
  rollNo: { 
    type: String,
    trim: true,
    uppercase: true
  }, 
  section: { 
    type: String,
    trim: true,
    uppercase: true
  }, 
  year: { 
    type: String,
    trim: true 
  }, 
  
  // Shared
  branch: { 
    type: String, 
    required: true,
    trim: true
  }, 
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
  notificationSent: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Indexes
ClubRegistrationSchema.index({ "member.email": 1 }, { unique: true });
ClubRegistrationSchema.index({ "member.rollNo": 1 }, { unique: true, sparse: true });

// ✅ 4. Export the Model
const ClubRegistration = models.ClubRegistration || model<IClubRegistration>("ClubRegistration", ClubRegistrationSchema);

export default ClubRegistration;