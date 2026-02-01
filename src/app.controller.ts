import { Controller, Get } from '@nestjs/common';
import { BaseController } from './common/base.controller';
import { ApiSuccessResponse, EmptyResponse } from './common/swagger';

@Controller()
export class AppController extends BaseController {
  constructor() { super(); }

  @Get()
  @ApiSuccessResponse(EmptyResponse)
  getHello() {
    return this.respondOk(null, "Server Running...");
  }
}
