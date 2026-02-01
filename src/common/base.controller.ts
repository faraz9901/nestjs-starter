import { HttpStatus } from "@nestjs/common"

// Simple wrapper returned by controllers so the global interceptor can format the HTTP response
export class ApiResponse<T> {
    constructor(
        public readonly data: T,
        public readonly message?: string,
        public readonly status?: number,
    ) { }
}

// Extend this base class in your controllers to get helper methods for common success responses
export abstract class BaseController {
    protected respondOk<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse(data, message, HttpStatus.OK)
    }

    protected respondCreated<T>(data: T, message = 'Created'): ApiResponse<T> {
        return new ApiResponse(data, message, HttpStatus.CREATED)
    }
}




