import { z } from 'zod';
const createBookingValidationSchema = z.object({
  body: z.object({
    date: z.string().date(),
    room: z.string(),
    slots: z.string().array(),
    user: z.string(),
    isConfirmed: z.enum(['confirmed', 'unconfirmed', 'canceled']),
  }),
});
const updateBookingValidationSchema = z.object({
  body: z.object({
    isConfirmed: z.enum(['confirmed', 'unconfirmed', 'canceled']),
  }),
});

export const bookingValidation = {
  createBookingValidationSchema,
  updateBookingValidationSchema,
};
