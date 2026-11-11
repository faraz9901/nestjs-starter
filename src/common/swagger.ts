import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorCode } from './errors';

// Helper decorator to describe successful responses using the common envelope in Swagger
export const ApiSuccessResponse = <TModel extends Type<any>>(
  model: TModel = EmptyResponse as TModel,
  options?: {
    isArray?: boolean;
    message?: string;
    status?: HttpStatus;
  },
) => {
  const {
    isArray = false,
    message = 'OK',
    status = HttpStatus.OK,
  } = options || {};

  const ResponseDecorator =
    status === HttpStatus.CREATED ? ApiCreatedResponse : ApiOkResponse;

  return applyDecorators(
    ApiExtraModels(model),
    ResponseDecorator({
      schema: {
        allOf: [
          {
            properties: {
              success: { example: true },
              message: { example: message },
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  }
                : model === EmptyResponse
                  ? { type: 'null', example: null }
                  : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

export class SuccessBody {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ example: null })
  data: any;
}

export class ErrorBody {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Something went wrong' })
  message: string;

  @ApiProperty({ example: null })
  details: any;

  @ApiProperty({ enum: ErrorCode, example: ErrorCode.INTERNAL_ERROR })
  code: ErrorCode;
}

export class EmptyResponse extends SuccessBody {}
