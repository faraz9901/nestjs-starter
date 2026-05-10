import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_STORAGE, LOCK_STORAGE, SwrCacheService } from './cache.service';
import { MemoryCacheStorage } from './memory.storage';
import { InMemoryLockService } from './lock.service';
describe('SwrCacheService', () => {
    let service: SwrCacheService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({

            providers: [
                SwrCacheService,
                {
                    provide: CACHE_STORAGE,
                    useClass: MemoryCacheStorage,
                },

                {
                    provide: LOCK_STORAGE,
                    useClass: InMemoryLockService,
                },
            ],
        }).compile();

        service = module.get<SwrCacheService>(SwrCacheService);
    });

    it('should return miss initially', async () => {
        const result = await service.get('users');

        expect(result).toEqual({
            type: 'miss',
        });
    });

    it('should return hit after set', async () => {
        await service.set(
            'users',
            { name: 'john' },
            5000,
            10000,
        );

        const result = await service.get('users');

        expect(result).toEqual({
            type: 'hit',
            data: {
                name: 'john',
            },
        });
    });

    it('should return stale after soft ttl expiry', async () => {
        await service.set(
            'users',
            { name: 'john' },
            1,
            10000,
        );

        await new Promise((r) => setTimeout(r, 10));

        const first = await service.get('users');

        expect(first).toEqual({
            type: 'miss',
        });

        const second = await service.get('users');

        expect(second).toEqual({
            type: 'stale',
            data: {
                name: 'john',
            },
        });
    });

    it('should delete cache', async () => {
        await service.set(
            'users',
            { name: 'john' },
            5000,
            10000,
        );

        await service.delete('users');

        const result = await service.get('users');

        expect(result).toEqual({
            type: 'miss',
        });
    });

    it('should soft delete cache', async () => {
        await service.set(
            'users',
            { name: 'john' },
            5000,
            10000,
        );

        await service.softDelete('users');

        const result = await service.get('users');

        expect(result.type).toBe('miss');
    });


    afterAll(async () => {
        await module.close();
    });
});