import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiRes } from 'src/decorators/api-responses.decorator';
import { BaseController } from '../../common/base.controller';
import { UserDto } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController {

  constructor(private readonly userService: UsersService) { super(); }

  @Get()
  @ApiRes('Get all users', UserDto, HttpStatus.OK, { isArray: true })
  findAll() {
    const users = this.userService.getUsers();
    return this.respondOk(users, 'Users fetched successfully');
  }
}
