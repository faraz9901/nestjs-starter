import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    success: boolean;
    message: string;
    data: T;
}


export class EmptyResponse { }

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
        status === HttpStatus.CREATED
            ? ApiCreatedResponse
            : ApiOkResponse;

    return applyDecorators(
        ApiExtraModels(ApiResponseDto, model),
        ResponseDecorator({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
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