import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel"
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["User", "Customer"]
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    senderImage: {  // New field to store sender's profile image
      type: String,
      default: ""
    },
    senderName: {  // New field to store sender's name
      type: String,
      default: ""
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },
    type: {
      type: String,
      enum: ["message", "system"],
      default: "message"
    },
    read: {
      type: Boolean,
      default: false
    },
    content: String // Short preview of the message
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);