import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiRes } from 'src/decorators/api-responses.decorator';
import { BaseController } from '../../common/base.controller';
import { UserResponse } from './user.responses';
import { UserDto } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController {

  constructor(private readonly userService: UsersService) { super(); }

  @Get()
  @ApiRes('Get all users', UserResponse, HttpStatus.OK, { isArray: true })
  findAll() {
    const users = this.userService.getUsers();
    return this.respondOk(users, 'Users fetched successfully');
  }

  @Post()
  @ApiRes('Create user', UserResponse, HttpStatus.OK)
  updateUser(@Body() dto: UserDto) {
    this.userService.createUser(dto);
    return this.respondOk(null, 'User created successfully');
  }

  @Post('/update')
  @ApiRes('Update user', UserResponse, HttpStatus.OK)
  update(@Body() dto: UserDto) {
    this.userService.updateUser(dto.id.toString());
    return this.respondOk(null, 'User updated successfully');
  }

}
