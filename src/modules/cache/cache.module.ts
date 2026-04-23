// cache.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { MemoryCacheStorage } from './services/memory.storage';
import { InMemoryLockService } from './services/lock.service';
import { SwrCacheInterceptor } from './interceptors/cache.interceptors';
import { CACHE_STORAGE, LOCK_STORAGE, SwrCacheService } from './services/cache.service';

@Global()
@Module({
    imports: [
        NestCacheModule.register({
            isGlobal: true,
            ttl: 0,
        }),
    ],
    providers: [
        SwrCacheService,
        {
            provide: LOCK_STORAGE,
            useClass: InMemoryLockService,
        },
        {
            provide: CACHE_STORAGE,
            useClass: MemoryCacheStorage,
        },

        SwrCacheInterceptor,
    ],
    exports: [
        SwrCacheInterceptor,
        SwrCacheService,
    ],
})
export class CacheModule { }