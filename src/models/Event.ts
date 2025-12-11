import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true }, // When the event happens
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, default: "Event" },
  
  // ✅ NEW FIELDS FOR LOGIC
  deadline: { type: Date }, // Registration closes at this time
  maxRegistrations: { type: Number, default: 0 }, // 0 = Unlimited
  currentRegistrations: { type: Number, default: 0 }, // Auto-increases
  
  // Team Settings
  isTeamEvent: { type: Boolean, default: false },
  minTeamSize: { type: Number, default: 1 },
  maxTeamSize: { type: Number, default: 1 },
  
  // Manual Override (Optional)
  isPast: { type: Boolean, default: false },
  registrationOpen: { type: Boolean, default: true },

  // Other fields
  rules: [String],
  image: String,
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);