export type TRoom = {
  name: string;
  roomNo: number;
  floorNo: number;
  capacity: number;
  pricePerSlot: number;
  amenities: Array<'whiteboard' | 'projector'>;
  isDeleted: boolean;
};
