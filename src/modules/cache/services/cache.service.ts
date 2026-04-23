import { Inject, Injectable } from '@nestjs/common';
import { CacheEntry, CacheResult } from '../types/cache.types';

import type { CacheStorage, LockStorage } from '../types/storage.types';

export const CACHE_STORAGE = Symbol('CACHE_STORAGE');
export const LOCK_STORAGE = Symbol('LOCK_STORAGE');

@Injectable()
export class SwrCacheService {
    constructor(
        @Inject(CACHE_STORAGE) private readonly storage: CacheStorage,
        @Inject(LOCK_STORAGE) private readonly lock: LockStorage,
    ) { }

    async get<T>(key: string): Promise<CacheResult<T>> {
        const now = Date.now();

        const entry = await this.storage.get<CacheEntry<T>>(key);

        // ❌ NO ENTRY → controlled miss
        if (!entry) {
            return this.handleMissWithLock<T>(key);
        }

        // ⚠️ STALE
        if (now > entry.softExpire) {
            return this.handleMissWithLock<T>(key, entry);
        }

        // ✅ HIT
        return {
            type: 'hit',
            data: entry.data,
        };
    }

    async set<T>(
        key: string,
        data: T,
        softTtlMs: number,
        hardTtlMs: number,
    ): Promise<void> {
        const now = Date.now();

        const entry: CacheEntry<T> = {
            data,
            softExpire: now + softTtlMs,
            hardExpire: now + hardTtlMs,
        };

        await this.storage.set(key, entry, hardTtlMs);

        if (this.lock.isLocked(key)) {
            this.lock.release(key);
        }
    }

    async delete(key: string): Promise<void> {
        await this.storage.delete(key);
    }

    /**
     * Force stale (serve stale, no miss)
     */
    async softDelete(key: string): Promise<void> {
        const existing = await this.storage.get<CacheEntry<any>>(key);
        if (!existing) return;

        existing.softExpire = 0;

        await this.storage.set(key, existing);
    }

    // ================= INTERNAL =================

    private async handleMissWithLock<T>(
        key: string,
        fallbackEntry?: CacheEntry<T>,
    ): Promise<CacheResult<T>> {
        const lockKey = key

        const gotLock = this.lock.acquire(lockKey, 5000);

        if (gotLock) {
            // ✅ ONLY ONE request gets miss
            return { type: 'miss' };
        }

        // ❗ Others should get stale if possible
        if (fallbackEntry?.data) {
            return {
                type: 'stale',
                data: fallbackEntry.data,
            };
        }

        return {
            type: 'miss',
        }
    }
}