import { Router } from 'express';
import { register, login, refresh, logout, me, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.get('/me', protect, me);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
