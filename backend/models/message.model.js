import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "receiverModel", // Dynamic reference to "User" or "Customer"
        required: true,
    },
    receiverModel: {
        type: String,
        enum: ["User", "Customer"],
        required: true,
    },
    text: {
      type: String,
    },
    file: {
      url: String,       // Cloudinary URL (e.g., "https://res.cloudinary.com/.../sample.pdf")
      publicId: String,   // Cloudinary public ID (for deletion/updates)
      filename: String,   // Original file name (e.g., "document.pdf")
      fileType: String,  // File type (e.g., "pdf", "image", "video")
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
