import express from 'express';
import { RoomController } from './room.controller';
import validateRequest from '../../middlewares/validateRequest';
import { roomValidation } from './room.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-room',
  auth(USER_ROLE.admin),
  validateRequest(roomValidation.createRoomValidationSchema),
  RoomController.createRoom,
);
router.get('/:id', RoomController.getSingleRoom);
router.put(
  '/:id',
  validateRequest(roomValidation.updateRoomValidationSchema),
  RoomController.updateRoom,
);
router.get('/', RoomController.getAllRooms);
router.delete('/:id', auth(USER_ROLE.admin), RoomController.deleteRoom);
export const RoomRoutes = router;
