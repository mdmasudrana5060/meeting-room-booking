import { TRoom } from './room.interface';
import { Room } from './room.model';

const createRoomIntoDB = async (payload: TRoom) => {
  const room = await Room.create(payload);
  return room;
};
const getAllRoomsFromDB = async () => {
  const result = await Room.find({ isDeleted: false });
  return result;
};

const getSingleRoomFromDB = async (id: string) => {
  const result = await Room.findOne({ _id: id, isDeleted: false });
  return result;
};

const updateRoomIntoDB = async (id: string, payload: Partial<TRoom>) => {
  const { amenities, ...remainingData } = payload;
  const modifiedData: any = { ...remainingData };
  if (amenities) {
    modifiedData.$addToSet = { amenities: { $each: amenities } };
  }
  const result = await Room.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
    upsert: true,
  });
  return result;
};
const deleteRoomFromDB = async (id: string) => {
  const result = await Room.findByIdAndUpdate(
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

export const RoomServices = {
  createRoomIntoDB,
  getAllRoomsFromDB,
  getSingleRoomFromDB,
  updateRoomIntoDB,
  deleteRoomFromDB,
};
