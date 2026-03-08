import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/common/base.controller';
import { ApiError } from 'src/common/errors';
import { configService } from 'src/config/config.service';
import { RESPONSE_TYPE_KEY } from 'src/decorators/api-responses.decorator';


function validateResponse(dto: object) {
    const errors = validateSync(dto as any, {
        whitelist: true,
        forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
        throw new ApiError(`Response validation failed: ${JSON.stringify(errors)}`);
    }
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const res = context.switchToHttp().getResponse();
        const handler = context.getHandler();

        const strip = configService.stripResponses();
        const validate = configService.validateResponses();

        return next.handle().pipe(
            map((value) => {
                if (value instanceof ApiResponse) {
                    if (value.status) {
                        res.status(value.status);
                    }

                    let data = value.data;

                    const meta = Reflect.getMetadata(RESPONSE_TYPE_KEY, handler);

                    if (meta?.type && value.data && strip) {

                        if (meta.isArray && Array.isArray(value.data)) {
                            data = value.data.map(item => {
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
            })
        );
    }
}
