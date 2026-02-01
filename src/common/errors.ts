import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { configService } from 'src/config/config.service';

export enum ErrorCode {
    /* =======================
       GENERIC / SYSTEM
    ======================== */
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    TIMEOUT = 'TIMEOUT',
    BAD_REQUEST = 'BAD_REQUEST',
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

    /* =======================
       VALIDATION / REQUEST
    ======================== */
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INVALID_PAYLOAD = 'INVALID_PAYLOAD',
    INVALID_QUERY_PARAMS = 'INVALID_QUERY_PARAMS',
    MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
    INVALID_FORMAT = 'INVALID_FORMAT',
    PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',

    /* =======================
       AUTHENTICATION
    ======================== */
    UNAUTHORIZED = 'UNAUTHORIZED',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    TOKEN_INVALID = 'TOKEN_INVALID',
    TOKEN_MISSING = 'TOKEN_MISSING',
    SESSION_EXPIRED = 'SESSION_EXPIRED',

    /* =======================
       AUTHORIZATION
    ======================== */
    FORBIDDEN = 'FORBIDDEN',
    INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
    ACCESS_DENIED = 'ACCESS_DENIED',

    /* =======================
       RESOURCE
    ======================== */
    NOT_FOUND = 'NOT_FOUND',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
    RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
    RESOURCE_LOCKED = 'RESOURCE_LOCKED',

    /* =======================
       BUSINESS LOGIC
    ======================== */
    BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
    OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
    INVALID_STATE = 'INVALID_STATE',
    LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',

    /* =======================
       EXTERNAL / INTEGRATIONS
    ======================== */
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
    EXTERNAL_SERVICE_UNAVAILABLE = 'EXTERNAL_SERVICE_UNAVAILABLE',
    EXTERNAL_TIMEOUT = 'EXTERNAL_TIMEOUT',
    THIRD_PARTY_FAILURE = 'THIRD_PARTY_FAILURE',
}




export class ApiError {
    constructor(
        public readonly message: string,
        public readonly code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
        public readonly status: number = HttpStatus.BAD_REQUEST,
        public readonly details?: any,
    ) { }
}


// Helper namespace for throwing errors easily
export namespace HTTPEXCEPTION {

    /* ---------- 400 ---------- */
    export const BAD_REQUEST = (
        message = 'Bad Request',
        code: ErrorCode,
        details?: any,
    ) => new ApiError(message, code, HttpStatus.BAD_REQUEST, details);

    export const VALIDATION = (
        message = 'Validation Failed',
        details?: any,
    ) => new ApiError(message, ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, details);

    /* ---------- 401 ---------- */
    export const UNAUTHORIZED = (
        message = 'Unauthorized',
        code: ErrorCode = ErrorCode.UNAUTHORIZED,
        details?: any,
    ) => new ApiError(message, code, HttpStatus.UNAUTHORIZED, details);

    export const TOKEN_EXPIRED = (details?: any) =>
        new ApiError('Token expired', ErrorCode.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED, details);

    /* ---------- 403 ---------- */
    export const FORBIDDEN = (
        message = 'Forbidden',
        code: ErrorCode = ErrorCode.FORBIDDEN,
        details?: any,
    ) => new ApiError(message, code, HttpStatus.FORBIDDEN, details);

    /* ---------- 404 ---------- */
    export const NOT_FOUND = (
        message = 'Resource not found',
        code: ErrorCode = ErrorCode.RESOURCE_NOT_FOUND,
        details?: any,
    ) => new ApiError(message, code, HttpStatus.NOT_FOUND, details);

    /* ---------- 409 ---------- */
    export const CONFLICT = (
        message = 'Conflict',
        code: ErrorCode = ErrorCode.RESOURCE_CONFLICT,
        details?: any,
    ) => new ApiError(message, code, HttpStatus.CONFLICT, details);

    /* ---------- 422 ---------- */
    export const UNPROCESSABLE = (
        message = 'Unprocessable entity',
        code: ErrorCode = ErrorCode.BUSINESS_RULE_VIOLATION,
        details?: any,
    ) => new ApiError(message, code, HttpStatus.UNPROCESSABLE_ENTITY, details);

    /* ---------- 500 ---------- */
    export const INTERNAL = (
        message = 'Internal Server Error',
        code: ErrorCode = ErrorCode.INTERNAL_ERROR,
        details?: any,
    ) => new ApiError(message, code, HttpStatus.INTERNAL_SERVER_ERROR, details);

    /* ---------- 503 ---------- */
    export const SERVICE_UNAVAILABLE = (
        message = 'Service unavailable',
        code: ErrorCode = ErrorCode.SERVICE_UNAVAILABLE,
        details?: any,
    ) => new ApiError(message, code, HttpStatus.SERVICE_UNAVAILABLE, details);
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Something went wrong';
        let code: ErrorCode = ErrorCode.INTERNAL_ERROR;
        let details: any = null;

        /* ---------- Logging ---------- */
        if (!configService.isProduction()) {
            console.error('❌ Exception:', exception);
        }

        /* ---------- Custom ApiError ---------- */
        else if (exception instanceof ApiError) {
            status = exception.status;
            message = exception.message;
            code = exception.code;
            details = exception.details ?? null;
        }


        /* ---------- NestJS HttpException ---------- */
        else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object') {
                const r = res as any;

                // ValidationPipe errors
                if (Array.isArray(r.message)) {
                    message = r.message[0];
                    details = r.message;
                } else {
                    message = r.message ?? message;
                    details = r.errors ?? null;
                }
            }

            code = this.mapStatusToCode(status);
        }


        response.status(status).json({
            success: false,
            message,
            code,
            details,
        });
    }

    private mapStatusToCode(status: number): ErrorCode {
        const map: Record<number, ErrorCode> = {
            [HttpStatus.BAD_REQUEST]: ErrorCode.BAD_REQUEST,
            [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
            [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
            [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
            [HttpStatus.CONFLICT]: ErrorCode.RESOURCE_CONFLICT,
            [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCode.BUSINESS_RULE_VIOLATION,
            [HttpStatus.TOO_MANY_REQUESTS]: ErrorCode.TOO_MANY_REQUESTS,
            [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorCode.INTERNAL_ERROR,
            [HttpStatus.SERVICE_UNAVAILABLE]: ErrorCode.SERVICE_UNAVAILABLE,
        };

        return map[status] ?? ErrorCode.UNKNOWN_ERROR;
    }
}
