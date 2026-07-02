import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { permitRoles } from '../middleware/rbac.js';
export const usersRouter = Router();

import {
	listUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
} from '../controllers/usersController.js';

usersRouter.get('/', protect, permitRoles('admin'), listUsers);
usersRouter.get('/:id', protect, permitRoles('admin'), getUser);
usersRouter.post('/', protect, permitRoles('admin'), createUser);
usersRouter.put('/:id', protect, permitRoles('admin'), updateUser);
usersRouter.delete('/:id', protect, permitRoles('admin'), deleteUser);
