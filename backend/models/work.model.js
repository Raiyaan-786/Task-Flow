import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
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
      index: true,
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
        "Completed",
        "Mute"
      ],
      default: "Assigned",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Received",
        "Partly Received",
        "Invoice Generated",
        "Advance Payment"
      ],
      default: "Pending",
      required: true,
    },
    balancePayment: {
      type: Number,
      default: 0,
    },
    reminder: {
      type: Date,
      default: null,
    },
    remark: {
      type: String,
      default: "",
    },
    chatwithEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    chatwithCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    }
  },
  { timestamps: true }
);

export const Work = mongoose.model("Work", workSchema);
