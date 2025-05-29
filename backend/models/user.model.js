import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: ""
    },
    username: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    postname: {
      type: String,
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
      unique: true,
    },
    address: {
      type: String,
      default: ""
    },
    salary: {
      type: Number,
      default: 0,
    },
    dateofjoining: {
      type: Date,
      default: null,
    },
    dateofleaving: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee", "Inactive"],
      default: "Employee",
    },
    status: {
      type: String,
      enum: ["Active", "Block","Inactive" ,"Mute"],
    },
    image: {
      type: String, 
      default: ''
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
