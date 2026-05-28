import { getAssetPath } from '@/common/get-assets';
import { EmptyResponse } from '@/common/swagger';
import { ApiRes, ResponseOptions } from '@/decorators/api-responses.decorator';
import { SkipResponseTransform } from '@/decorators/skip-response-transform.decorator';
import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import fs from 'fs/promises';
import { BaseController } from '../../common/base.controller';
import { SwrCache } from '../cache/decorators/swrCache.decorators';
import { UserResponse } from './user.responses';
import { UserDto } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController {

  constructor(private readonly userService: UsersService) { super(); }

  @Get()
  @ResponseOptions({ strip: true, validate: true })
  @ApiRes('Get all users', UserResponse, HttpStatus.OK, { isArray: true })
  @SwrCache({
    key: (req) => `${req.method}:${req.url}`,
    softTtlMs: 30 * 1000, // 30 seconds
    hardTtlMs: 60 * 1000, // 60 seconds
  })
  async findAll() {
    const users = await this.userService.getUsers();
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
  async getBuffer(@Res() res: Response) {

    const filePath = getAssetPath('dummy-assets.txt');

    const buffer = await fs.readFile(filePath);

    res.contentType('text/plain');
    res.attachment('sample.txt');
    res.send(buffer);
  }

}
