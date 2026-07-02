import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
import { createPurchase, listPurchases } from '../controllers/purchaseController.js';

export const purchasesRouter = Router();

purchasesRouter.get('/', protect, listPurchases);
purchasesRouter.post('/', protect, permitRoles('admin'), createPurchase);
