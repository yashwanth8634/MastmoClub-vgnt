import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IRateLimit extends Document {
  key: string;
  count: number;
  resetAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    resetAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL Index: Automatically delete documents when 'resetAt' time is reached
// We set expireAfterSeconds to 0 so it expires exactly at 'resetAt'
RateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit = models.RateLimit || model<IRateLimit>("RateLimit", RateLimitSchema);

export default RateLimit;
