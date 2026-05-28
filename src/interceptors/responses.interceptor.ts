import { ApiResponse } from '@/common/base.controller';
import { ApiError, ErrorCode } from '@/common/errors';
import { configService } from '@/config/config.service';
import { RESPONSE_OPTIONS_KEY, RESPONSE_TYPE_KEY, ResponseOptions } from '@/decorators/api-responses.decorator';
import { SKIP_RESPONSE_TRANSFORM_KEY } from '@/decorators/skip-response-transform.decorator';
import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { map } from 'rxjs/operators';



function validateResponse(dto: object) {
    const errors = validateSync(dto as any, {
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
        const res = context.switchToHttp().getResponse();
        const handler = context.getHandler();

        const meta = Reflect.getMetadata(RESPONSE_TYPE_KEY, handler);

        const responseOptions: ResponseOptions = Reflect.getMetadata(RESPONSE_OPTIONS_KEY, handler) ?? {};

        // Global defaults
        const globalStrip = configService.stripResponses();
        const globalValidate = configService.validateResponses();

        // Endpoint overrides
        const strip = responseOptions.strip ?? globalStrip;
        const validate = responseOptions.validate ?? globalValidate;

        return next.handle().pipe(
            map((value) => {

                const skip = Reflect.getMetadata(SKIP_RESPONSE_TRANSFORM_KEY, handler);

                if (skip) return value;


                if (value instanceof ApiResponse) {
                    if (value.status) {
                        res.status(value.status);
                    }

                    let data = value.data;

                    if (meta?.type && value.data && strip) {
                        if (meta.isArray && Array.isArray(value.data)) {
                            data = value.data.map((item) => {
                                const dto = plainToInstance(meta.type, item, {
                                    excludeExtraneousValues: true,
                                });

                                if (validate) {
                                    validateResponse(dto);
                                }

                                return dto;
                            });
                        } else {
                            const dto = plainToInstance(meta.type, value.data, {
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
                        message: value.message ?? 'OK',
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