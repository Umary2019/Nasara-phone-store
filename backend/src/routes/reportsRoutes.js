import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
import { exportSalesReport, exportInventoryReport, exportExpenseReport } from '../controllers/reportController.js';

export const reportsRouter = Router();

reportsRouter.get('/sales', protect, permitRoles('admin', 'manager'), exportSalesReport);
reportsRouter.get('/inventory', protect, permitRoles('admin', 'manager'), exportInventoryReport);
reportsRouter.get('/expenses', protect, permitRoles('admin', 'manager'), exportExpenseReport);
