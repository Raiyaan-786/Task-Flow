import mongoose from 'mongoose';

const sharedCustomerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  email: { type: String, required: true , unique: true },
  password: { type: String, required: true }, 
}, { timestamps: true });

export const SharedCustomer = mongoose.model('SharedCustomer', sharedCustomerSchema);