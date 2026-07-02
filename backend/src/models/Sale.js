import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    buyingPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    items: [saleItemSchema],
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cashierName: { type: String, required: true },
    paymentMethod: { type: String, enum: ['cash', 'transfer', 'card', 'mixed'], required: true },
    amountPaid: { type: Number, required: true, default: 0 },
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    profitAmount: { type: Number, required: true },
    status: { type: String, enum: ['completed', 'voided', 'refunded'], default: 'completed' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Sale = mongoose.model('Sale', saleSchema);
