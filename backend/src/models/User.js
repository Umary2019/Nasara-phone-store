import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    roleName: { type: String, required: true, enum: ['admin', 'cashier'] },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    avatarUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
