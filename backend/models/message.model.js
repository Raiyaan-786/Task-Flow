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
    // fileUrl: {
    //   type: String, 
    // },
    // fileType: {
    //   type: String,
    //   enum: ["image", "pdf", "doc", "none"],
    //   default: "none",
    // },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
