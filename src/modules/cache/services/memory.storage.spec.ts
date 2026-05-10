import { Test, TestingModule } from '@nestjs/testing';
import { MemoryCacheStorage } from './memory.storage';
import { CacheModule } from '../cache.module';

describe('MemoryCacheStorage', () => {
    let service: MemoryCacheStorage;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [MemoryCacheStorage],
        }).compile();

        service = module.get<MemoryCacheStorage>(MemoryCacheStorage);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('set/get', () => {
        it('should store and retrieve value', async () => {
            await service.set('user:1', {
                name: 'john',
            });

            const result = await service.get('user:1');

            expect(result).toEqual({
                name: 'john',
            });
        });

        it('should return null for missing key', async () => {
            const result = await service.get('unknown');

            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete cache key', async () => {
            await service.set('user:1', {
                name: 'john',
            });

            await service.delete('user:1');

            const result = await service.get('user:1');

            expect(result).toBeNull();
        });
    });

    describe('ttl', () => {
        it(
            'should expire after ttl',
            async () => {
                await service.set(
                    'user:1',
                    { name: 'john' },
                    100,
                );

                // should exist immediately
                const before = await service.get('user:1');


                expect(before).toEqual({
                    name: 'john',
                });

                await new Promise((r) => setTimeout(r, 150));

                const after = await service.get('user:1');

                expect(after).toBeNull();
            },
            10000,
        );
    });
});