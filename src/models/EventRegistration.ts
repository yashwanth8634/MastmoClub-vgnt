import mongoose, { Schema, models, model } from "mongoose";

const EventRegistrationSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    
    // User Details
    fullName: { type: String, required: true },
    rollNo: { type: String, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true }, // 👈 Added Section
    year: { type: String, required: true },
    
    // Team Details
    teamName: { type: String },
    teamMembers: [
      {
        name: { type: String },
        rollNo: { type: String },
      },
    ],
  },
  { timestamps: true }
);

EventRegistrationSchema.index({ eventId: 1, rollNo: 1 }, { unique: true });

const EventRegistration = models.EventRegistration || model("EventRegistration", EventRegistrationSchema);

export default EventRegistration;