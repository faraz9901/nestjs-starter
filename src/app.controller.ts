import { Controller, Get, HttpStatus } from '@nestjs/common';
import { BaseController } from './common/base.controller';
import { EmptyResponse } from './common/swagger';
import { ApiRes } from './decorators/api-responses.decorator';

@Controller()
export class AppController extends BaseController {
  constructor() { super(); }

  @Get()
  @ApiRes("Health Check", EmptyResponse, HttpStatus.OK, { isArray: false })
  getHello() {
    return this.respondOk(null, "Server Running...");
  }
}
