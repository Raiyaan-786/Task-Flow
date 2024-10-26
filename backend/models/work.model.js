import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    billingName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    pan: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    workType: {
      type: String,
      required: true,
    },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    quarter: {
      type: String,
      required: true,
    },
    financialYear: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    currentStatus: {
      type: String,
      enum: [
        "Assigned",
        "Picked Up",
        "Customer Verification",
        "Ready for Checking",
        "Hold Work",
        "EVC Pending",
        "Cancel",
        "Completed"
      ],
      default: "Assigned",
      required: true,
    },
  },
  { timestamps: true }
);
export const Work = mongoose.model("Work", workSchema);
