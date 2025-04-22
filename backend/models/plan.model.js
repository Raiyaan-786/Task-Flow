import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    tier: {
        type: String,
        enum: ["Free" , "Basic" , "Pro" , "Enterprise"],
        default: 'Free'
    },
    price: {
        type: Number,
        default: 0
    },
    billingCycle: {
        type: String,
        default: 'monthly'
    },
    recommended: {
        type: Boolean,
        default: false,
    },
    features: {
        users:{
            type: Number,
            default: 0
        },
        storage: {
            type: String,
            default: 'Free'
        },
        support: {
            type: String,
            default: ''
        },
        apiAccess: {
            type: Boolean,
            default: false,
        },
        analytics: {
            type: Boolean,
            default: false,
        },
    },
    
  },
  { timestamps: true }
);

export const Plan = mongoose.model("Plan", planSchema);
