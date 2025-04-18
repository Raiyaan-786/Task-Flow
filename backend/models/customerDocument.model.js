import mongoose from "mongoose";

const customerDocumentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true
    },
    aadharCard: {
      type: String ,
      default: null
    },
    panCard: {
      type: String ,
      default: null
    }
  },
  { timestamps: true }
);

export const customerDocument = mongoose.model("CustomerDocument", customerDocumentSchema);