import { IsNumber, IsString } from 'class-validator';
import { ExposeApiProperty } from 'src/decorators/expose-api-property.decorator';

export class UserDto {
  @ExposeApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ExposeApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ExposeApiProperty({ example: 'StrongPassword' })
  @IsString()
  password: string;
}
