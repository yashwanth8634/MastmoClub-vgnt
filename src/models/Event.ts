import mongoose, { Schema, model, models } from "mongoose";

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: "General" }, // 'Membership', 'Hackathon', etc.
  location: { type: String },
  date: { type: Date, required: true },
  isPast: { type: Boolean, default: false },

  // Constraints
  registrationOpen: { type: Boolean, default: true },
  deadline: { type: Date },
  maxRegistrations: { type: Number, default: 0 },
  currentRegistrations: { type: Number, default: 0 },

  // Team Logic
  isTeamEvent: { type: Boolean, default: false },
  minTeamSize: { type: Number, default: 1 },
  maxTeamSize: { type: Number, default: 1 },

  // Optional arrays
  rules: [{ type: String }],
  gallery: [{ type: String }],
}, { timestamps: true });

const Event = models.Event || model("Event", EventSchema);
export default Event;