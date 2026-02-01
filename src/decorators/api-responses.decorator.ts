import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/swagger';

export function ApiRes(
    summary: string,
    responseType: Type<unknown>,
    status: HttpStatus = HttpStatus.OK,
    options: { isArray?: boolean } | undefined = {},
) {
    return applyDecorators(
        ApiOperation({ summary }),
        ApiSuccessResponse(responseType, { status, ...options }),
    );
}

export function ApiWithBody(
    summary: string,
    bodyDto: Type<unknown>,
    responseType: Type<unknown>,
    status: HttpStatus | undefined = HttpStatus.OK,
    options: { isArray?: boolean } | undefined = {},
) {
    return applyDecorators(
        ApiOperation({ summary }),
        ApiBody({ type: bodyDto }),
        ApiSuccessResponse(responseType, { status, ...options }),
    );
}
