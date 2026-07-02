import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: 'Nasara Phone Accessories' },
    logoUrl: { type: String, default: '' },
    address: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    currency: { type: String, default: 'NGN' },
    taxRate: { type: Number, default: 0.075 },
    lowStockThreshold: { type: Number, default: 10 },
    allowNegativeStock: { type: Boolean, default: false },
    receiptFooter: { type: String, default: 'Thank you for shopping with us.' },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' }
  },
  { timestamps: true }
);

export const Setting = mongoose.model('Setting', settingSchema);
