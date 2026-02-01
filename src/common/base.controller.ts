import { HttpStatus } from "@nestjs/common"

export class ApiResponse<T> {
    constructor(
        public readonly data: T,
        public readonly message?: string,
        public readonly status?: number,
    ) { }
}

export abstract class BaseController {
    protected respondOk<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse(data, message, HttpStatus.OK)
    }

    protected respondCreated<T>(data: T, message = 'Created'): ApiResponse<T> {
        return new ApiResponse(data, message, HttpStatus.CREATED)
    }
}




