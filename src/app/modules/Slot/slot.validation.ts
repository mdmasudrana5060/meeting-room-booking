import { z } from 'zod';
const createSlotValidationSchema = z.object({
  body: z.object({
    room: z.string(),
    date: z.string().date(),
    startTime: z.string(),
    endTime: z.string(),
  }),
});

export const slotValidation = {
  createSlotValidationSchema,
};
