import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String, default: 'Owner'}
}, { timestamps: true });

export const Owner = mongoose.model("Owner", ownerSchema);
