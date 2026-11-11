import { z } from 'zod';

// Request body: strict - unknown keys are rejected (forbidNonWhitelisted equivalent)
export const userSchema = z.strictObject({
  id: z.number().meta({ example: 1 }),
  name: z.string().meta({ example: 'John Doe' }),
  password: z.string().meta({ example: 'StrongPassword' }),
});

// Response: unknown keys are stripped (excludeExtraneousValues equivalent), password not exposed
export const userResponseSchema = z
  .object(userSchema.shape)
  .pick({ id: true, name: true });

export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
