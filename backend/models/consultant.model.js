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
    status: {
      type: String,
      enum: [
        "Active",
        "Mute"
      ],
      default: "Active",
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    signature: {
      type: Buffer, 
      required: true,
    },
  },
  { timestamps: true }
);

export const Consultant = mongoose.model("Consultant", consultantSchema);
