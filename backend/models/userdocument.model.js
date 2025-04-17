import mongoose from "mongoose";

const userDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aadharCard: {
      type: String ,
    },
    panCard: {
      type: String ,
    }
  },
  { timestamps: true }
);

export const UserDocument = mongoose.model("UserDocument", userDocumentSchema);