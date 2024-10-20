import mongoose from "mongoose";

const consultantSchema = new mongoose.Schema(
  {
    consultantName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    bankAccountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    bankIFSCCode: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      default: '',
      required: true,
    },
  },
  { timestamps: true }
);

export const Consultant = mongoose.model("Consultant", consultantSchema);