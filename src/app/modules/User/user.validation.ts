import { z } from 'zod';
const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z.string().min(11, 'Phone number must be at least 10 characters'),
    address: z.string(),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});
export const userValidation = {
  createUserValidationSchema,
};
