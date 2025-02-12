import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  serialNo: {
    type: Number,
    required: true,
    unique: true,
  },
  invoiceId: {
    type: String,
    required: true,
    unique: true,
  },
  partyName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  workName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Work",
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  mode: {
    type: String,
    enum: ["Cash", "Cheque", "Online"],
    required: true,
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
