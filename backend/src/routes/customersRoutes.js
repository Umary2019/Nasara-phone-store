import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createCrudController } from '../controllers/crudController.js';
import { Customer } from '../models/Customer.js';

const crud = createCrudController(Customer, { searchFields: ['fullName', 'phoneNumber', 'email', 'address'] });

export const customersRouter = Router();

customersRouter.get('/', protect, crud.list);
customersRouter.get('/:id', protect, crud.getById);
customersRouter.post('/', protect, crud.create);
customersRouter.put('/:id', protect, crud.update);
customersRouter.delete('/:id', protect, crud.remove);
