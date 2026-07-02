import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';

export const dashboardRouter = Router();

dashboardRouter.get('/summary', protect, getDashboardSummary);
