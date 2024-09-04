import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Slot } from '../Slot/slot.model';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';
import mongoose from 'mongoose';
import { Room } from '../Room/room.model';
import { User } from '../User/user.model';

const createBookingIntoDB = async (data: TBooking) => {
  const { date, slots, room, user, isConfirmed } = data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the specified slots are already booked for the given date and room
    const existingBookings = await Slot.find({
      _id: { $in: slots },
      date: date,
      room: room,
      isBooked: false,
    });

    // Update the slots to mark them as booked (with a session)
    await Slot.updateMany(
      { _id: { $in: slots }, date: date, roomId: room, isBooked: false },
      { $set: { isBooked: true } },
      { session },
    );

    // Create the booking document directly without using an array
    const roomDetails = await Room.findById(room);
    const userDetails = await User.findById(user);

    if (!roomDetails || !userDetails) {
      throw new AppError(httpStatus.NOT_FOUND, 'Room or user not found');
    }

    // Calculate the total amount
    const totalAmount = roomDetails.pricePerSlot * slots.length;

    const [booking] = await Booking.create(
      [
        {
          date: date,
          slots: slots,
          room: room,
          user: user,
          totalAmount: totalAmount,
          isConfirmed: isConfirmed,
        },
      ],
      { session },
    );
    const populatedBooking = await booking.populate([
      { path: 'slots', model: 'Slot' },
      { path: 'room', model: 'Room' },
      { path: 'user', model: 'User' },
    ]);

    // Use populate immediately after create

    await session.commitTransaction();
    session.endSession();

    return populatedBooking;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
};

const getAllBookingsFromDB = async () => {
  const result = await Booking.find({ isDeleted: false });
  return result;
};

const getSingleBookingFromDB = async (id: string) => {
  const result = await Booking.findById(id);
  return result;
};

const updateBookingIntoDB = async (id: string, payload: Partial<TBooking>) => {
  const bookingExist = await Booking.findById(id);
  if (!bookingExist) {
    throw new AppError(httpStatus.CONFLICT, 'Id is not found');
  }
  const result = await Booking.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteBookingFromDB = async (id: string) => {
  const bookingExist = await Booking.findById(id);
  if (!bookingExist) {
    throw new AppError(httpStatus.CONFLICT, 'Id is not found');
  }
  const result = await Booking.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  updateBookingIntoDB,
  deleteBookingFromDB,
};
