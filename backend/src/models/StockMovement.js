import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    movementType: { type: String, enum: ['in', 'out', 'adjustment'], required: true },
    quantity: { type: Number, required: true },
    referenceType: { type: String, default: '' },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    note: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
