export interface CacheStorage {
  get<T>(key: string): T | null | Promise<T | null>;
  set<T>(key: string, value: T, ttlMs?: number): void | Promise<void>;
  delete(key: string): void | Promise<void>;
}

export interface LockStorage {
  acquire(key: string, ttlMs: number): boolean | Promise<boolean>;
  release(key: string): void | Promise<void>;
  exists(key: string): boolean | Promise<boolean>;
  isLocked(key: string): boolean | Promise<boolean>;
}
