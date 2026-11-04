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
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import type { Response } from 'express';
import { map } from 'rxjs/operators';

interface ResponseTypeMeta {
  type: Type<object>;
  isArray?: boolean;
}

function validateResponse(dto: object) {
  const errors = validateSync(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    throw new ApiError(
      'Response validation failed',
      ErrorCode.INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      configService.isProduction() ? null : errors,
    );
  }
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse<Response>();
    const handler = context.getHandler();

    const meta = Reflect.getMetadata(RESPONSE_TYPE_KEY, handler) as
      ResponseTypeMeta | undefined;

    const responseOptions =
      (Reflect.getMetadata(RESPONSE_OPTIONS_KEY, handler) as
        ResponseOptions | undefined) ?? {};

    // Global defaults
    const globalStrip = configService.stripResponses();
    const globalValidate = configService.validateResponses();

    // Endpoint overrides
    const strip = responseOptions.strip ?? globalStrip;
    const validate = responseOptions.validate ?? globalValidate;

    return next.handle().pipe(
      map((value: unknown) => {
        const skip = Reflect.getMetadata(
          SKIP_RESPONSE_TRANSFORM_KEY,
          handler,
        ) as boolean | undefined;

        if (skip) return value;

        if (value instanceof ApiResponse) {
          const response = value as ApiResponse<unknown>;

          if (response.status) {
            res.status(response.status);
          }

          let data: unknown = response.data;

          if (meta?.type && response.data && strip) {
            if (meta.isArray && Array.isArray(response.data)) {
              data = response.data.map((item) => {
                const dto = plainToInstance(meta.type, item, {
                  excludeExtraneousValues: true,
                });

                if (validate) {
                  validateResponse(dto);
                }

                return dto;
              });
            } else {
              const dto = plainToInstance(meta.type, response.data, {
                excludeExtraneousValues: true,
              });

              if (validate) {
                validateResponse(dto);
              }

              data = dto;
            }
          }

          return {
            success: true,
            message: response.message ?? 'OK',
            data,
          };
        }

        return {
          success: true,
          message: 'OK',
          data: value,
        };
      }),
    );
  }
}
