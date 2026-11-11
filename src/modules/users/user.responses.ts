import { userResponseSchema } from '@/modules/users/user.schema';
import { createZodDto } from 'nestjs-zod';

export class UserResponse extends createZodDto(userResponseSchema) {}
