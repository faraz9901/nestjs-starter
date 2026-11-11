import { userSchema } from '@/modules/users/user.schema';
import { createZodDto } from 'nestjs-zod';

export class UserDto extends createZodDto(userSchema) {}
