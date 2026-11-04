import { AsyncLocalStorage } from 'node:async_hooks';

export const als = new AsyncLocalStorage<Map<string, string>>();

export const getRequestId = (): string | undefined =>
  als.getStore()?.get('requestId');
