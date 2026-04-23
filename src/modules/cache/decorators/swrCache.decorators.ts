// decorators/swr-cache.decorator.ts
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { SwrCacheInterceptor } from '../interceptors/cache.interceptors';

export const SWR_CACHE_KEY = 'SWR_CACHE_KEY';

export const SwrCache = (options: {
    key?: (req: Request) => string | Promise<string>;
    softTtlMs: number;
    hardTtlMs: number;
}) =>
    applyDecorators(
        SetMetadata(SWR_CACHE_KEY, options),
        UseInterceptors(SwrCacheInterceptor),
    );