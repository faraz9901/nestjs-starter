// types/cache.types.ts
export type CacheEntry<T> = {
    data: T;
    softExpire: number;
    hardExpire: number;
    isSoftDeleted?: boolean;
};

export type CacheResult<T> =
    | { type: 'hit'; data: T }
    | { type: 'stale'; data: T; }
    | { type: 'miss' };