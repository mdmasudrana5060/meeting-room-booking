import express from 'express';
import { UserController } from './user.controller';

import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(userValidation.createUserValidationSchema),
  UserController.createUser,
);
router.get('/:id', UserController.getSingleUser);
router.get('/', auth(USER_ROLE.admin), UserController.getAllUsers);

export const UserRoutes = router;
