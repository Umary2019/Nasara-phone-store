import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
import { createCrudController } from '../controllers/crudController.js';
import { Category } from '../models/Category.js';

const crud = createCrudController(Category, { searchFields: ['name', 'description'] });

export const categoriesRouter = Router();

categoriesRouter.get('/', protect, crud.list);
categoriesRouter.get('/:id', protect, crud.getById);
categoriesRouter.post('/', protect, permitRoles('admin', 'manager'), crud.create);
categoriesRouter.put('/:id', protect, permitRoles('admin', 'manager'), crud.update);
categoriesRouter.delete('/:id', protect, permitRoles('admin'), crud.remove);
