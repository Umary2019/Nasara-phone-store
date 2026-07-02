import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { Role } from '../models/Role.js';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { AuditLog } from '../models/AuditLog.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function ensureDefaultRoles() {
  const roleNames = ['admin', 'cashier'];
  for (const name of roleNames) {
    await Role.findOneAndUpdate(
      { name },
      { name, permissions: [] },
      { upsert: true, new: true }
    );
  }
}

async function issueTokens(user) {
  const payload = { sub: user._id.toString(), role: user.roleName, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: dayjs().add(7, 'day').toDate()
  });

  return { accessToken, refreshToken };
}

export const register = asyncHandler(async (req, res) => {
  await ensureDefaultRoles();

  const { fullName, email, phoneNumber, password, confirmPassword } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!fullName || !normalizedEmail || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Full name, email, password, and confirmation are required' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const normalizedRole = 'cashier';

  const role = await Role.findOne({ name: normalizedRole });

  if (!role) {
    return res.status(400).json({ message: 'Invalid role selected' });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    email: normalizedEmail,
    phoneNumber,
    passwordHash,
    role: role._id,
    roleName: normalizedRole
  });

  const { accessToken, refreshToken } = await issueTokens(user);
  const safeUser = await User.findById(user._id).populate('role').select('-passwordHash');

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.status(201).json({ user: safeUser, accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: normalizedEmail }).populate('role');

  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const { accessToken, refreshToken } = await issueTokens(user);
  await AuditLog.create({
    actor: user._id,
    actorName: user.fullName,
    action: 'login',
    entityType: 'auth',
    metadata: { email: user.email }
  });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.json({
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      roleName: user.roleName,
      role: user.role
    },
    accessToken
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  const decoded = verifyRefreshToken(token);
  const stored = await RefreshToken.findOne({ user: decoded.sub, tokenHash: hashToken(token), revokedAt: { $exists: false } });
  if (!stored) {
    return res.status(401).json({ message: 'Refresh token invalid' });
  }

  const user = await User.findById(decoded.sub).populate('role');
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Account disabled or not found' });
  }

  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.roleName, email: user.email });
  res.json({ accessToken, user: { id: user._id, fullName: user.fullName, email: user.email, roleName: user.roleName, role: user.role } });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await RefreshToken.updateOne({ tokenHash: hashToken(token) }, { revokedAt: new Date() });
  }

  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json({ message: 'Logged out' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('role').select('-passwordHash');
  res.json({ user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.json({ message: 'If the account exists, a reset request was created.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordTokenHash = hashToken(token);
  user.resetPasswordExpiresAt = dayjs().add(1, 'hour').toDate();
  await user.save();

  res.json({ message: 'Password reset request created', resetToken: token });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});
