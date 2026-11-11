import { ApiSuccessResponse } from '@/common/swagger';
import { applyDecorators, HttpStatus, SetMetadata, Type } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const RESPONSE_TYPE_KEY = 'responseType';
export const RESPONSE_OPTIONS_KEY = 'response_options';

export interface ResponseOptions {
  validate?: boolean;
}

export function ApiRes(
  summary: string,
  responseType: Type<unknown>,
  status: HttpStatus = HttpStatus.OK,
  options: { isArray?: boolean; validate?: boolean } = {},
) {
  // zod DTOs from createZodDto expose the schema as a static property
  const schema = (responseType as { schema?: unknown }).schema;
  const { isArray, validate } = options;

  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(responseType, { status, isArray }),
    // store metadata for interceptor to use
    SetMetadata(RESPONSE_TYPE_KEY, { schema, isArray }),
    // undefined validate → interceptor falls back to configService.validateResponses()
    SetMetadata(RESPONSE_OPTIONS_KEY, { validate }),
  );
}
