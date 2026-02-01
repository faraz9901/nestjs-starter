import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/common/base.controller';


@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const res = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map((value) => {
                // 👇 Check for ApiResponse
                if (value instanceof ApiResponse) {
                    if (value.status) {
                        res.status(value.status);
                    }

                    return {
                        success: true,
                        message: value.message ?? 'OK',
                        data: value.data,
                    };
                }

                // 👇 Plain return
                return {
                    success: true,
                    message: 'OK',
                    data: value,
                };
            }),
        );
    }
}
