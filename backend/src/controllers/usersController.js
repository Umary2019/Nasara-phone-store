import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { AuditLog } from '../models/AuditLog.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('role').select('-passwordHash');
  res.json({ items: users });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('role').select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ item: user });
});

export const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, password, roleName } = req.body;
  const role = await Role.findOne({ name: roleName });
  if (!role) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already used' });

  const passwordHash = await bcrypt.hash(password || 'password123', 12);
  const user = await User.create({ fullName, email: email.toLowerCase(), phoneNumber, passwordHash, role: role._id, roleName: role.name });
  await AuditLog.create({ actor: req.user?._id, actorName: req.user?.fullName || 'system', action: 'create_user', entityType: 'user', entityId: user._id });
  const safe = await User.findById(user._id).populate('role').select('-passwordHash');
  res.status(201).json({ item: safe });
});

export const updateUser = asyncHandler(async (req, res) => {
  const patch = { ...req.body };
  if (patch.password) {
    patch.passwordHash = await bcrypt.hash(patch.password, 12);
    delete patch.password;
  }
  if (patch.roleName) {
    const role = await Role.findOne({ name: patch.roleName });
    if (!role) return res.status(400).json({ message: 'Invalid role' });
    patch.role = role._id;
  }

  const user = await User.findByIdAndUpdate(req.params.id, patch, { new: true }).populate('role').select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  await AuditLog.create({ actor: req.user?._id, actorName: req.user?.fullName || 'system', action: 'update_user', entityType: 'user', entityId: user._id });
  res.json({ item: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await AuditLog.create({ actor: req.user?._id, actorName: req.user?.fullName || 'system', action: 'delete_user', entityType: 'user', entityId: user._id });
  res.json({ message: 'User deleted' });
});
