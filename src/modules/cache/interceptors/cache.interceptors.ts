// interceptors/swr-cache.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SwrCacheService } from '../services/cache.service';
import { SWR_CACHE_KEY } from '../decorators/swrCache.decorators';

@Injectable()
export class SwrCacheInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private cache: SwrCacheService,
    ) { }

    // interceptors/swr-cache.interceptor.ts

    async intercept(context: ExecutionContext, next: CallHandler) {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler();

        const options = this.reflector.get(SWR_CACHE_KEY, handler);
        if (!options) return next.handle();

        // 🔥 SUPPORT ASYNC KEY
        const key = options.key
            ? await options.key(req)
            : `${req.method}:${req.route.path}:${JSON.stringify(req.query)}`;

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
            mergeMap(async (data) => {
                if (gotLock) {
                    await this.cache.set(
                        key,
                        data,
                        options.softTtlMs,
                        options.hardTtlMs,
                    );
                }
                return data;
            }),
        );
    }
}