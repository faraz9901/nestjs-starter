import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { CacheStorage } from '../types/storage.types';

@Injectable()
export class MemoryCacheStorage
    implements CacheStorage {
    private cache = new LRUCache<string, any>({
        max: 500,
        ttl: 1000 * 60 * 5,
    });

    async get<T>(key: string): Promise<T | null> {
        return this.cache.get(key) ?? null;
    }

    async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
        this.cache.set(key, value, {
            ttl: ttlMs,
        });
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }
}