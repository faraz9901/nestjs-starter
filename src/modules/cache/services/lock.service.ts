import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { LockStorage } from '../types/storage.types';

@Injectable()
export class InMemoryLockService implements LockStorage {
    private locks = new LRUCache<string, true>({
        max: 5000,
        ttlAutopurge: true,
    });

    acquire(key: string, ttlMs: number): boolean {
        if (this.locks.has(key)) {
            return false;
        }

        this.locks.set(key, true, {
            ttl: ttlMs,
        });

        return true;
    }

    exists(key: string): boolean {
        return this.locks.has(key);
    }

    isLocked(key: string): boolean {
        return this.locks.has(key);
    }

    release(key: string): void {
        this.locks.delete(key);
    }
}