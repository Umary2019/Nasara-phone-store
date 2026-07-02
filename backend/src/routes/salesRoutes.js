import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
import { createSale, listSales, voidSale, getSaleById } from '../controllers/saleController.js';

export const salesRouter = Router();

salesRouter.get('/', protect, listSales);
salesRouter.get('/:id', protect, getSaleById);
salesRouter.post('/', protect, permitRoles('admin', 'manager', 'cashier'), createSale);
salesRouter.patch('/:id/void', protect, permitRoles('admin', 'manager'), voidSale);
