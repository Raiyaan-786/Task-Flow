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
      url: String,        // Cloudinary URL
      publicId: String,   // Cloudinary public ID
      filename: String,   // Original filename
      fileType: String,   // e.g., "pdf", "image"
      uploadedAt: Date,   // When it was uploaded
      verified: {        // Verification status
        type: Boolean,
        default: false
      }
    },
    panCard: {
      url: String,        // Cloudinary URL
      publicId: String,   // Cloudinary public ID
      filename: String,   // Original filename
      fileType: String,   // e.g., "pdf", "image"
      uploadedAt: Date,   // When it was uploaded
      verified: {        // Verification status
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

export const CustomerDocument = mongoose.model("CustomerDocument", customerDocumentSchema);