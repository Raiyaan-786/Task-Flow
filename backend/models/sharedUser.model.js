import mongoose from 'mongoose';

const sharedUserSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, 
}, { timestamps: true });

export const SharedUser = mongoose.model('SharedUser', sharedUserSchema);