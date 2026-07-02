import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    productsSupplied: [{ type: String }],
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Supplier = mongoose.model('Supplier', supplierSchema);
