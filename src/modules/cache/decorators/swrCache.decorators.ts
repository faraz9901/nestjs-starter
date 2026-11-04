// decorators/swr-cache.decorator.ts
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { SwrCacheInterceptor } from '../interceptors/cache.interceptors';

export const SWR_CACHE_KEY = 'SWR_CACHE_KEY';

export interface SwrCacheOptions {
  key?: (req: Request) => string | Promise<string>;
  softTtlMs: number;
  hardTtlMs: number;
}

export const SwrCache = (options: SwrCacheOptions) =>
  applyDecorators(
    SetMetadata(SWR_CACHE_KEY, options),
    UseInterceptors(SwrCacheInterceptor),
  );
