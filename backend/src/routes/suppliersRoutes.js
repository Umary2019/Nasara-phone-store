import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createCrudController } from '../controllers/crudController.js';
import { Supplier } from '../models/Supplier.js';

const crud = createCrudController(Supplier, { searchFields: ['supplierName', 'phoneNumber', 'email', 'address'] });

export const suppliersRouter = Router();

suppliersRouter.get('/', protect, crud.list);
suppliersRouter.get('/:id', protect, crud.getById);
suppliersRouter.post('/', protect, crud.create);
suppliersRouter.put('/:id', protect, crud.update);
suppliersRouter.delete('/:id', protect, crud.remove);
