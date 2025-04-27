import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerImage:{
      type: String,
      default: '',
    },
    customerCode: {
      type: String,
    },
    password: {
      type: String,
    },
    billingName: {
      type: String,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNo: {
      type: String,
      unique: true,
    },
    whatsappNo: {
      type: String,
    },
    sameAsMobileNo: {
      type: Boolean,
      default: false,
    },
    PAN: {
      type: String,
      required: true,
      unique: true,
    },
    AadharNo: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    contactPersonName: {
      type: String,
    },
    contactPersonPhone: {
      type: Number,
    },
    groupName: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "CustomerGroup",
      required: false, 
    },
  },
  { timestamps: true }
);

const CustomergroupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true, unique: true },
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true }, 
  },
  { timestamps: true }
);
export const Customer = mongoose.model("Customer", customerSchema);
export const CustomerGroup = mongoose.model("CustomerGroup", CustomergroupSchema);
