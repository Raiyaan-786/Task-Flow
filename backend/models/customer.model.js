import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerCode: {
      type: String,
      required: true,
      unique: true,
    },
    billingName: {
      type: String,
      required: true,
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
      required: true,
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
    address: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
    },
  },
  { timestamps: true }
);

const CustomergroupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true, unique: true },
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }]
  },
  { timestamps: true }
)

export const Customer = mongoose.model("Customer", customerSchema);
export const CustomerGroup = mongoose.model("CustomeGroup", CustomergroupSchema);
