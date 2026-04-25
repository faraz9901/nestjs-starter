import { Injectable, Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { CacheStorage } from '../types/storage.types';

@Injectable()
export class MemoryCacheStorage implements CacheStorage {
    constructor(@Inject('CACHE_MANAGER') private cache: Cache) { }

    async get<T>(key: string): Promise<T | null> {
        return (await this.cache.get(key)) ?? null;
    }

    async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
        await this.cache.set(
            key,
            value,
            ttlMs ?? 5 * 60 * 1000 // 5 min,
        );
    }

    async delete(key: string): Promise<void> {
        await this.cache.del(key);
    }
}