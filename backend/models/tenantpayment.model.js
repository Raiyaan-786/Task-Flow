import mongoose from "mongoose";

const tenantpaymentSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expiry: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
});

export const TenantPayment = mongoose.model("TenantPayment", tenantpaymentSchema);


// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer", // Reference to a Customer model
//       required: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     plan: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Plan", // Reference to the Plan model
//       required: true,
//     },
//     transactionId: {
//       type: String,
//       required: true, // From payment processor (e.g., Stripe charge_id)
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["succeeded", "pending", "failed", "refunded"],
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true, // Store as a number (e.g., 49.99)
//     },
//     currency: {
//       type: String,
//       required: true, // e.g., "USD"
//     },
//     paymentMethod: {
//       last4: {
//         type: String, // Last 4 digits of the card (e.g., "1234")
//         required: false,
//       },
//       brand: {
//         type: String, // e.g., "Visa", "MasterCard"
//         required: false,
//       },
//       expiry: {
//         type: String, // e.g., "12/25", only if provided by processor
//         required: false,
//       },
//       paymentMethodId: {
//         type: String, // Payment method ID or token from processor
//         required: true,
//       },
//     },
//     subscriptionId: {
//       type: String, // From payment processor (e.g., Stripe subscription_id)
//       required: false, // Only for subscriptions
//     },
//     billingAddress: {
//       street: { type: String },
//       city: { type: String },
//       state: { type: String },
//       zip: { type: String },
//       country: { type: String },
//     },
//     invoiceId: {
//       type: String, // Reference to an invoice, if applicable
//       required: false,
//     },
//   },
//   { timestamps: true }
// );

// export const Payment = mongoose.model("Payment", paymentSchema);