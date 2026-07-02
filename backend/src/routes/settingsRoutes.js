import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
import { createCrudController } from '../controllers/crudController.js';
import { Setting } from '../models/Setting.js';

const crud = createCrudController(Setting);

export const settingsRouter = Router();

settingsRouter.get('/', protect, permitRoles('admin'), crud.list);
settingsRouter.get('/:id', protect, permitRoles('admin'), crud.getById);
settingsRouter.post('/', protect, permitRoles('admin'), crud.create);
settingsRouter.put('/:id', protect, permitRoles('admin'), crud.update);
