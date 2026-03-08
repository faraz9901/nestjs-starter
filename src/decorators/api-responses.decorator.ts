import { applyDecorators, HttpStatus, SetMetadata, Type } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/swagger';

export const RESPONSE_TYPE_KEY = 'responseType';

export function ApiRes(
    summary: string,
    responseType: Type<unknown>,
    status: HttpStatus = HttpStatus.OK,
    options: { isArray?: boolean } = {},
) {
    return applyDecorators(
        ApiOperation({ summary }),
        ApiSuccessResponse(responseType, { status, ...options }),
        // store metadata for interceptor to use
        SetMetadata(RESPONSE_TYPE_KEY, { type: responseType, ...options }),
    );
}
