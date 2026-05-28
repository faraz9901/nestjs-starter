import { ApiSuccessResponse } from '@/common/swagger';
import { applyDecorators, HttpStatus, SetMetadata, Type } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const RESPONSE_TYPE_KEY = 'responseType';
export const RESPONSE_OPTIONS_KEY = 'response_options';

export function ApiRes(
    summary: string,
    responseType: Type<unknown>,
    status: HttpStatus = HttpStatus.OK,
    options: { isArray?: boolean, strip?: boolean, } = {},
) {
    return applyDecorators(
        ApiOperation({ summary }),
        ApiSuccessResponse(responseType, { status, ...options }),
        // store metadata for interceptor to use
        SetMetadata(RESPONSE_TYPE_KEY, { type: responseType, ...options }),
    );
}


export interface ResponseOptions {
    strip?: boolean;
    validate?: boolean;
}

export const ResponseOptions = (options: ResponseOptions) => {
    const strip = options.strip ?? true
    const validate = options.validate ?? true

    return SetMetadata(RESPONSE_OPTIONS_KEY, { strip, validate });
}
