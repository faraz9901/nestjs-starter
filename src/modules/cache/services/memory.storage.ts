import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { CacheStorage } from '../types/storage.types';

@Injectable()
export class MemoryCacheStorage implements CacheStorage {
  private cache = new LRUCache<string, any>({
    max: 500,
    ttl: 1000 * 60 * 5,
  });

  get<T>(key: string): Promise<T | null> {
    return Promise.resolve(this.cache.get(key) ?? null);
  }

  set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    this.cache.set(key, value, {
      ttl: ttlMs,
    });
    return Promise.resolve();
  }

  delete(key: string): Promise<void> {
    this.cache.delete(key);
    return Promise.resolve();
  }
}
