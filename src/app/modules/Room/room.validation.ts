import { z } from 'zod';
const createRoomValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Room name is required'),
    roomNo: z.number(),
    floorNo: z.number(),
    capacity: z.number(),
    pricePerSlot: z.number(),
    amenities: z.string().array(),
  }),
});
const updateRoomValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Room name is required').optional(),
    roomNo: z.number().optional(),
    floorNo: z.number().optional(),
    capacity: z.number().optional(),
    pricePerSlot: z.number().optional(),
    amenities: z.string().array().optional(),
  }),
});
export const roomValidation = {
  createRoomValidationSchema,
  updateRoomValidationSchema,
};
