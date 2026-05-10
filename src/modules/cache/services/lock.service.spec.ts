import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryLockService } from './lock.service';

describe('InMemoryLockService', () => {
    let service: InMemoryLockService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [InMemoryLockService],
        }).compile();

        service = module.get(InMemoryLockService);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('acquire', () => {
        it('should acquire lock successfully', () => {
            const result = service.acquire('user:1', 5000);

            expect(result).toBe(true);
        });

        it('should not acquire already locked key', () => {
            service.acquire('user:1', 5000);

            const result = service.acquire('user:1', 5000);

            expect(result).toBe(false);
        });

        it('should allow acquire after ttl expires', async () => {
            service.acquire('user:1', 10);

            await new Promise((r) => setTimeout(r, 20));

            const result = service.acquire('user:1', 5000);

            expect(result).toBe(true);
        });
    });

    describe('isLocked', () => {
        it('should return true for active lock', () => {
            service.acquire('user:1', 5000);

            expect(service.isLocked('user:1')).toBe(true);
        });

        it('should return false for expired lock', async () => {
            service.acquire('user:1', 10);

            await new Promise((r) => setTimeout(r, 20));

            expect(service.isLocked('user:1')).toBe(false);
        });

        it('should return false for non existing lock', () => {
            expect(service.exists('unknown')).toBe(false);
        });
    });

    describe('release', () => {
        it('should release lock', () => {
            service.acquire('user:1', 5000);

            service.release('user:1');

            expect(service.isLocked('user:1')).toBe(false);
        });
    });

    describe('cleanup', () => {
        it('should cleanup expired locks', async () => {
            service.acquire('user:1', 10);

            await new Promise((r) => setTimeout(r, 60060));

            expect(service.exists('user:1')).toBe(false);
        }, 70000);
    });

});