import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createCrudController } from '../controllers/crudController.js';
import { Expense } from '../models/Expense.js';

const crud = createCrudController(Expense, { searchFields: ['category', 'notes'] });

export const expensesRouter = Router();

expensesRouter.get('/', protect, crud.list);
expensesRouter.get('/:id', protect, crud.getById);
expensesRouter.post('/', protect, crud.create);
expensesRouter.put('/:id', protect, crud.update);
expensesRouter.delete('/:id', protect, crud.remove);
