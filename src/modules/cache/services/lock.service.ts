import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { LockStorage } from '../types/storage.types';

@Injectable()
export class InMemoryLockService implements OnModuleDestroy, LockStorage {
    private locks = new Map<string, number>();
    private interval: NodeJS.Timeout;
    constructor() {
        this.interval = setInterval(() => this.cleanup(), 60000); // every 1 min
    }

    onModuleDestroy() {
        clearInterval(this.interval);
    }

    private cleanup() {
        const now = Date.now();

        for (const [key, expiry] of this.locks) {
            if (expiry <= now) {
                this.locks.delete(key);
            }
        }
    }

    acquire(key: string, ttlMs: number): boolean {
        const now = Date.now();
        const expiry = this.locks.get(key);

        if (expiry && expiry > now) return false;

        this.locks.set(key, now + ttlMs);
        return true;
    }

    isLocked(key: string): boolean {
        const expiry = this.locks.get(key);
        return expiry !== undefined && expiry > Date.now();
    }

    release(key: string) {
        this.locks.delete(key);
    }
}