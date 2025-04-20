import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  companyName: { type: String, default: "CompanyName" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionPlan: {
    type: String,
    enum: ["Free", "Moderate", "Premium"],
    default: "Free"
  }
}, { timestamps: true });

export const Tenant = mongoose.model("Tenant", tenantSchema);