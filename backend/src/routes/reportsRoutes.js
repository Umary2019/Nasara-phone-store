import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
import { exportSalesReport, exportInventoryReport, exportExpenseReport } from '../controllers/reportController.js';

export const reportsRouter = Router();

reportsRouter.get('/sales', protect, permitRoles('admin'), exportSalesReport);
reportsRouter.get('/inventory', protect, permitRoles('admin'), exportInventoryReport);
reportsRouter.get('/expenses', protect, permitRoles('admin'), exportExpenseReport);
