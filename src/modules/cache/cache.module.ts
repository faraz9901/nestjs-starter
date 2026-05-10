import { Module, Global } from '@nestjs/common';
import { MemoryCacheStorage } from './services/memory.storage';
import { InMemoryLockService } from './services/lock.service';
import { SwrCacheInterceptor } from './interceptors/cache.interceptors';
import { CACHE_STORAGE, LOCK_STORAGE, SwrCacheService } from './services/cache.service';

@Global()
@Module({
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