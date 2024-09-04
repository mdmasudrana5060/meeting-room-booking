import express from 'express';
import { SlotController } from './slot.controller';
import validateRequest from '../../middlewares/validateRequest';
import { slotValidation } from './slot.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-slot',
  auth(USER_ROLE.admin),
  validateRequest(slotValidation.createSlotValidationSchema),
  SlotController.createSlot,
);

router.get('/availability', SlotController.getAllSlots);

export const SlotRoutes = router;
