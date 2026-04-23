import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiRes } from 'src/decorators/api-responses.decorator';
import { BaseController } from '../../common/base.controller';
import { UserResponse } from './user.responses';
import { UserDto } from './users.dto';
import { UsersService } from './users.service';
import { EmptyResponse } from 'src/common/swagger';
import { SkipResponseTransform } from 'src/decorators/skip-response-transform.decorator';
import { type Response } from 'express';
import { SwrCache } from '../cache/decorators/swrCache.decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController {

  constructor(private readonly userService: UsersService) { super(); }

  @Get()
  @ApiRes('Get all users', UserResponse, HttpStatus.OK, { isArray: true })
  @SwrCache({
    key: (req) => `${req.method}:${req.url}`,
    softTtlMs: 30 * 1000, // 30 seconds
    hardTtlMs: 60 * 1000, // 60 seconds
  })
  findAll() {
    const users = this.userService.getUsers();
    return this.respondOk(users, 'Users fetched successfully');
  }

  @Post()
  @ApiRes('Create user', EmptyResponse, HttpStatus.OK)
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

  @Get('/buffer')
  @SkipResponseTransform()
  getBuffer(@Res() res: Response) {
    const users = this.userService.getUsers();

    const buffer = Buffer.from(JSON.stringify(users, null, 2));

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="users.json"',
    });

    res.send(buffer);
  }

}
