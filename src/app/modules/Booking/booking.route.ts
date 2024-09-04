import express from 'express';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { bookingValidation } from './booking.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-booking',
  auth(USER_ROLE.user),
  validateRequest(bookingValidation.createBookingValidationSchema),
  BookingController.createBooking,
);
router.get(
  '/my-bookings/:id',
  auth(USER_ROLE.user),
  BookingController.getSingleBooking,
);
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(bookingValidation.updateBookingValidationSchema),
  BookingController.updateBooking,
);
router.delete('/:id', auth(USER_ROLE.admin), BookingController.deleteBooking);
router.get('/', auth(USER_ROLE.admin), BookingController.getAllBookings);

export const BookingRoutes = router;
