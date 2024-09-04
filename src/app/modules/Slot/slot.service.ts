import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Room } from '../Room/room.model';
import { TSlot } from './slot.interface';
import { Slot } from './slot.model';
const createSlotIntoDB = async (payload: TSlot) => {
  const { room, startTime, endTime } = payload;
  const existingRoom = await Room.findOne({ _id: room, isDeleted: false });
  console.log(existingRoom);
  if (!existingRoom) {
    throw new AppError(httpStatus.CONFLICT, 'Room is not found');
  }
  const slotDuration = 60;

  // Convert start and end times to minutes since midnight
  let slotStartTime = parseInt(startTime) * 60;
  let slotEndTime = parseInt(endTime) * 60;

  // Calculate total number of slots
  let totalNumberOfSlots = (slotEndTime - slotStartTime) / slotDuration;

  const slots = [];

  for (let i = 0; i < totalNumberOfSlots; i++) {
    let startMinutes = slotStartTime + i * slotDuration;

    let endMinutes = startMinutes + slotDuration;

    let startHour = Math.floor(startMinutes / 60);

    let endHour = Math.floor(endMinutes / 60);

    let slotStartTimeStr = `${String(startHour).padStart(2, '0')}:00`;
    let slotEndTimeStr = `${String(endHour).padStart(2, '0')}:00`;

    // Create individual slot payload
    const slotPayload = {
      ...payload,
      startTime: slotStartTimeStr,
      endTime: slotEndTimeStr,
    };

    // Create and store each slot in the database
    const slot = await Slot.create(slotPayload);
    slots.push(slot);
  }

  return slots;
};

const getAllSlotsFromDB = async (query: Record<string, unknown>) => {
  console.log(query);
  let room = '';
  let date = '';

  if (query?.room && query?.date) {
    room = query?.room as string;
    date = query?.date as string;
  }
  let result;

  if (room && date) {
    const queryDate = new Date(date);
    result = await Slot.find({
      room: room,
      date: queryDate,
      isBooked: false,
    }).populate('room');
  } else {
    result = await Slot.find({ isBooked: false }).populate('room');
  }
  return result;
};

export const SlotServices = {
  createSlotIntoDB,
  getAllSlotsFromDB,
};
