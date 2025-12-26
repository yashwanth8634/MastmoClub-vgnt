import mongoose, { Schema, Document, Model, models } from "mongoose";

// 1. Type Definition
export interface IEvent extends Document {
  title: string;
  description: string;
  
  // Display Fields (Strings)
  date: string;
  time: string;
  location: string;
  
  // Registration Logic (No deadline)
  registrationOpen: boolean;
  maxRegistrations: number; // 0 = Unlimited
  currentRegistrations: number;
  
  // Team Settings
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  isLive: boolean;
  
  // Info & Media (No single 'image' field)
  rules: string[];
  gallery: string[];   
  
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const EventSchema = new Schema<IEvent>(
  {
    title: { 
      type: String, 
      required: [true, "Event title is required"], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Event description is required"] 
    },
    
    // Display Fields
    date: { type: String, required: [true, "Date is required"] },
    time: { type: String, required: [true, "Time is required"] },
    location: { type: String, required: [true, "Location is required"] },

    // Logic
    registrationOpen: { type: Boolean, default: true },
    maxRegistrations: { type: Number, default: 0 },
    currentRegistrations: { type: Number, default: 0 },
    isLive: { type: Boolean, default: true },

    // Team
    isTeamEvent: { type: Boolean, default: false },
    minTeamSize: { type: Number, default: 1 },
    maxTeamSize: { type: Number, default: 1 },

    // Media
    rules: { type: [String], default: [] },
    gallery: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;