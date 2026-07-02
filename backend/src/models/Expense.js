import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    expenseDate: { type: Date, required: true },
    notes: { type: String, default: '' },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Expense = mongoose.model('Expense', expenseSchema);
