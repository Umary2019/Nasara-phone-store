import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '' },
    notes: { type: String, default: '' },
    outstandingBalance: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema);
