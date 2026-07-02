import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
import { createCrudController } from '../controllers/crudController.js';
import { AuditLog } from '../models/AuditLog.js';

const crud = createCrudController(AuditLog, { searchFields: ['action', 'entityType', 'actorName'] });

export const auditRouter = Router();

auditRouter.get('/', protect, permitRoles('admin', 'manager'), crud.list);
auditRouter.get('/:id', protect, permitRoles('admin', 'manager'), crud.getById);
