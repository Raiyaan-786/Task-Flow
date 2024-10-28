// models/Turnover.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const turnoverSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer', 
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  types: {
    type: String,
    required: true,
  },
  financialYear: {
    type: String, 
    required: true,
  },
  turnover: {
    type: Number, 
    required: true,
  },
  status: {
    type: String, 
    required: true,
  },
}, {
  timestamps: true, 
});


export const Turnover = mongoose.model("Turnover", turnoverSchema);
