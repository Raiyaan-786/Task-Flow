import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
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
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee", "Inactive"],
      default: "Employee",
    },
    image: {
      type: Buffer,  // Store image as binary data (Buffer)
      required: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
