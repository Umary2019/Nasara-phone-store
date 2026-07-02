import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub).populate('role').select('-passwordHash');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Account disabled or not found' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
