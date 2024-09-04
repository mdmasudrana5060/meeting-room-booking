import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { RoomRoutes } from '../modules/Room/room.route';
import { SlotRoutes } from '../modules/Slot/slot.routes';
import { BookingRoutes } from '../modules/Booking/booking.route';
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/rooms',
    route: RoomRoutes,
  },
  {
    path: '/slots',
    route: SlotRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
