import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    houseAllowance: {
      type: Number,
      required: true,
    },
    transportAllowance: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      required: true,
    },
    canteenDeductions: {
      type: Number,
      required: true,
    },
    deductions: {
      type: Number,
      required: true,
    },
    netpay: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payroll = mongoose.model("Payroll", payrollSchema);
