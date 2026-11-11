import { ApiResponse } from '@/common/base.controller';
import { ApiError, ErrorCode } from '@/common/errors';
import { configService } from '@/config/config.service';
import {
  RESPONSE_OPTIONS_KEY,
  RESPONSE_TYPE_KEY,
  ResponseOptions,
} from '@/decorators/api-responses.decorator';
import { SKIP_RESPONSE_TRANSFORM_KEY } from '@/decorators/skip-response-transform.decorator';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { map } from 'rxjs/operators';
import { z } from 'zod';

interface ResponseTypeMeta {
  schema: z.ZodType;
  isArray?: boolean;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const handler = context.getHandler();

    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_TRANSFORM_KEY,
      [handler, context.getClass()],
    );

    if (skip) {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse<Response>();

    const meta = this.reflector.get<ResponseTypeMeta>(
      RESPONSE_TYPE_KEY,
      handler,
    );

    const options =
      this.reflector.get<ResponseOptions>(RESPONSE_OPTIONS_KEY, handler) ?? {};

    const validate = options.validate ?? configService.validateResponses();

    return next.handle().pipe(
      map((value: unknown) => {
        let data: unknown;
        let message = 'OK';

        if (value instanceof ApiResponse) {
          data = value.data;
          message = value.message ?? 'OK';

          if (value.status !== undefined) {
            response.status(value.status);
          }
        } else {
          data = value;
        }

        if (validate && meta?.schema) {
          try {
            const schema = meta.isArray ? z.array(meta.schema) : meta.schema;

            data = schema.parse(data);
          } catch (error) {
            throw new ApiError(
              'Response validation failed',
              ErrorCode.INTERNAL_ERROR,
              HttpStatus.INTERNAL_SERVER_ERROR,
              configService.isProduction() ? null : error,
            );
          }
        }

        return {
          success: true,
          message,
          data,
        };
      }),
    );
  }
}
