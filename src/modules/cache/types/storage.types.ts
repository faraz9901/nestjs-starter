export interface CacheStorage {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
    delete(key: string): Promise<void>;
}

export interface LockStorage {
    acquire(key: string, ttlMs: number): boolean | Promise<boolean>;
    release(key: string): void | Promise<void>;
    isLocked(key: string): boolean | Promise<boolean>;
}