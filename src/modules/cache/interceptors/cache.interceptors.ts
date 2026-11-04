// interceptors/swr-cache.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  SWR_CACHE_KEY,
  type SwrCacheOptions,
} from '../decorators/swrCache.decorators';
import { SwrCacheService } from '../services/cache.service';

@Injectable()
export class SwrCacheInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private cache: SwrCacheService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();

    const options = this.reflector.get<SwrCacheOptions | undefined>(
      SWR_CACHE_KEY,
      handler,
    );
    if (!options) return next.handle();

    // 🔥 SUPPORT ASYNC KEY
    const routePath = (req.route as { path?: string } | undefined)?.path ?? '';
    const key = options.key
      ? await options.key(req)
      : `${req.method}:${routePath}:${JSON.stringify(req.query)}`;

    const result = await this.cache.get(key);

    // ✅ HIT
    if (result.type === 'hit') {
      return of(result.data);
    }

    // ⚠️ STALE
    if (result.type === 'stale') {
      return of(result.data);
    }

    // ❌ MISS
    const gotLock = result.type === 'miss';

    return next.handle().pipe(
      mergeMap(async (data: unknown) => {
        if (gotLock) {
          await this.cache.set(key, data, options.softTtlMs, options.hardTtlMs);
        }
        return data;
      }),
    );
  }
}
