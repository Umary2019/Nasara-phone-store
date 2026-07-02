import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
import { createCrudController } from '../controllers/crudController.js';
import { Product } from '../models/Product.js';
import { upload } from '../middleware/upload.js';

const crud = createCrudController(Product, { searchFields: ['name', 'brand', 'sku', 'description'], populate: 'category supplier' });

export const productsRouter = Router();

productsRouter.get('/', protect, crud.list);
productsRouter.get('/:id', protect, crud.getById);
productsRouter.post('/', protect, permitRoles('admin', 'manager'), upload.single('image'), (req, _res, next) => {
  if (req.file) req.body.imageUrl = `/uploads/${req.file.filename}`;
  next();
}, crud.create);
productsRouter.put('/:id', protect, permitRoles('admin', 'manager'), upload.single('image'), (req, _res, next) => {
  if (req.file) req.body.imageUrl = `/uploads/${req.file.filename}`;
  next();
}, crud.update);
productsRouter.delete('/:id', protect, permitRoles('admin'), crud.remove);
