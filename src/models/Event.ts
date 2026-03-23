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
  registrationRequired: boolean;
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
      trim: true,
      minLength: [3, "Title must be at least 3 characters long"],
      maxLength: [100, "Title cannot be more than 100 characters long"]
    },
    description: { 
      type: String, 
      required: [true, "Event description is required"],
      trim: true,
      maxLength: [2000, "Description cannot be more than 2000 characters long"]
    },
    
    // Display Fields
    date: { type: String, required: [true, "Date is required"], trim: true },
    time: { type: String, required: [true, "Time is required"], trim: true },
    location: { 
      type: String, 
      required: [true, "Location is required"],
      trim: true,
      maxLength: [200, "Location cannot be more than 200 characters long"]
    },

    // Logic
    registrationRequired: { type: Boolean, default: true },
    registrationOpen: { type: Boolean, default: true },
    maxRegistrations: { 
      type: Number, 
      default: 0,
      min: [0, "Maximum registrations cannot be negative"]
    },
    currentRegistrations: { 
      type: Number, 
      default: 0,
      min: [0, "Current registrations cannot be negative"]
    },
    isLive: { type: Boolean, default: true },

    // Team
    isTeamEvent: { type: Boolean, default: false },
    minTeamSize: { 
      type: Number, 
      default: 1,
      min: [1, "Minimum team size must be at least 1"]
    },
    maxTeamSize: { 
      type: Number, 
      default: 1,
      min: [1, "Maximum team size must be at least 1"]
    },

    // Media
    rules: { type: [String], default: [] },
    gallery: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Indexes for optimized queries
EventSchema.index({ isLive: 1, date: -1 }); // For listing live events by date
EventSchema.index({ registrationOpen: 1 }); // For finding events with open registration
EventSchema.index({ createdAt: -1 }); // For sorting by newest
EventSchema.index({ title: 'text', description: 'text' }); // For text search

const Event: Model<IEvent> = models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
