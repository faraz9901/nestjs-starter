import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/common/base.controller';


// Global interceptor to normalize all successful responses
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const res = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map((value) => {
                // If the controller returned an ApiResponse, use its status and message
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

                // For plain values, wrap them in the default response shape
                return {
                    success: true,
                    message: 'OK',
                    data: value,
                };
            }),
        );
    }
}
