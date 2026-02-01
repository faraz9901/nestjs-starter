import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiRes } from 'src/decorators/api-responses.decorator';
import { BaseController } from '../../common/base.controller';
import { UserDto } from './users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController {
  @Get()
  @ApiRes('Get all users', UserDto, HttpStatus.OK, { isArray: true })
  findAll() {
    const users: UserDto[] = [
      { id: 1, name: 'John Doe' },
    ];

    return this.respondOk(users, 'Users fetched successfully');
  }
}
