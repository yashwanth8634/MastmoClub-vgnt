import mongoose, { Schema, model, models } from "mongoose";

// Sub-schema for a single student member
const MemberSchema = new Schema({
  fullName: { type: String },
  rollNo: { type: String }, // Validated 24891A05...
  branch: { type: String },
  section: { type: String }, // A, B, C, D...
  email: { type: String },
  phone: { type: String },
});

const RegistrationSchema = new Schema({
  type: { type: String, enum: ["membership", "event"], default: "event" },
  eventId: { type: Schema.Types.ObjectId, ref: "Event" },
  eventName: { type: String },
  
  // For Teams
  teamName: { type: String }, // Optional for individual
  
  // The Squad
  members: [MemberSchema], 

  // Admin Control
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
}, { timestamps: true });

// Create indexes with sparse option to allow multiple null values
RegistrationSchema.index({ "members.email": 1, eventName: 1 }, { sparse: true });
RegistrationSchema.index({ "members.phone": 1, eventName: 1 }, { sparse: true });
RegistrationSchema.index({ "members.rollNo": 1, eventName: 1 }, { sparse: true });

const Registration = models.Registration || model("Registration", RegistrationSchema);
export default Registration;