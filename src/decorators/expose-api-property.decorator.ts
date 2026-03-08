import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export type ClassConstructor<T = any> = new (...args: any[]) => T;

export interface ExposeApiPropertyOptions extends Omit<ApiPropertyOptions, 'type'> {
    /** Only allow class constructor as type */
    type?: ClassConstructor;
}

/**
 * Combines @Expose() + @ApiProperty() + class-transformer Type for nested DTOs
 */
export function ExposeApiProperty(options?: ExposeApiPropertyOptions): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const { type, ...rest } = options || {};

        // Apply class-transformer Expose
        Expose()(target, propertyKey);

        // Apply Swagger ApiProperty (include type if provided)
        ApiProperty({
            ...rest,
            type,
        } as ApiPropertyOptions)(target, propertyKey);

        // Apply class-transformer Type for nested DTOs
        if (type) {
            Type(() => type)(target, propertyKey);
        }
    };
}