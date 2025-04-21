import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  companyName: { 
    type: String, 
    default: "CompanyName" 
  },
  companyLogo: { 
    type: String 
  },
  phone: { 
    type: String , 
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  plan: {
    tier: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      default: "free"
    },
    price: { type: Number, default: 0 },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      default: "monthly"
    },
    startsAt: { type: Date, default: Date.now },
    renewsAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "canceled", "paused", "trial"],
      default: "trial"
    },
    isAutoRenew: { type: Boolean, default: true }
  },
  billing: {
    paymentMethodId: { type: String },
    lastPayment: { type: Date },
    nextBillingDate: { type: Date },
    taxId: { type: String },
    invoiceEmail: { type: String },
    billingAddress: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String }
    }
  },
  features: {
    canExport: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    customDomain: { type: Boolean, default: false }
  },
  loginCredentials: {
    username: {
      type: String,
      default: null
    },
    password: {
      type: String,
      default: null
    }
  },
  notes: { type: String },
  referralSource: { type: String },
  trialEndsAt: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Tenant = mongoose.model("Tenant", tenantSchema);