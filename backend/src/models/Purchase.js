import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    referenceNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        costPrice: { type: Number, required: true }
      }
    ],
    totalCost: { type: Number, required: true },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Purchase = mongoose.model('Purchase', purchaseSchema);
