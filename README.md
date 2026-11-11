# 🚀 NestJS Production-Ready Starter Kit

A production-ready **NestJS boilerplate** designed for scalability, consistency, and developer experience. This starter provides a solid foundation for building RESTful APIs with standardized responses, Zod-based validation, advanced error handling, automated documentation, and high-performance caching.

---

## 📖 Table of Contents
- [✨ Why this Starter exists](#-why-this-starter-exists)
- [✨ Features Overview](#-features-overview)
- [🛠 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [📂 Project Structure](#-project-structure)
- [🧠 Core Concepts](#-core-concepts)
  - [Standardized API Responses](#standardized-api-responses)
  - [Global Validation (Zod)](#global-validation-zod)
  - [Error Handling](#error-handling)
  - [🔄 SWR Cache System](#-swr-cache-system)
  - [📁 Static Assets & File Management](#-static-assets--file-management)
  - [🏥 Health Check](#-health-check)
  - [Event-Driven Architecture](#event-driven-architecture)
- [🏗️ Base Classes](#️-base-classes)
  - [BaseController](#basecontroller)
  - [BaseService](#baseservice)
- [🎨 Custom Decorators](#-custom-decorators)
  - [@ApiRes](#apires)
  - [@SwrCache](#swrcache)
  - [@SkipResponseTransform](#skipresponsetransform)
- [🛡️ Security & Performance](#️-security--performance)
- [📝 Logging System](#-logging-system)
  - [Winston Logging](#winston-based-logging)
  - [Request ID Traceability](#request-scoped-request-id-in-logs)
  - [⏱️ Timing Metrics](#️-timing-metrics)
- [🚦 Rate Limiting](#-rate-limiting)
- [🛑 Graceful Shutdown](#-graceful-shutdown)
- [👨‍💻 Development Guide](#-development-guide)
  - [Database & ORM](#database--orm)
  - [Creating a New Module](#creating-a-new-module)
- [🧪 Testing](#-testing)
- [📜 Available Scripts](#-available-scripts)
- [🔐 Environment Variables](#-environment-variables)
- [📄 License](#-license)

---

## Why This Starter Exists

Most NestJS starters are either:
- too minimal to save real setup time
- or too opinionated and framework-like

This starter focuses only on production infrastructure concerns:
- standardized responses
- logging
- request tracing
- SWR caching
- validation
- documentation
- assets
- error handling

without forcing:
- ORM choices
- authentication systems
- architectural patterns

---

## ✨ Features Overview

| Feature | Description |
| :------ | :---------- |
| **🛡️ Global Validation** | Automatic request validation using **Zod** + `nestjs-zod` (`createZodDto`, `ZodValidationPipe`). |
| **📦 Standardized Responses** | Uniform API response structure (`success`, `message`, `data`) via Global Interceptor. |
| **🚨 Centralized Error Handling** | Global Exception Filter with comprehensive error codes and consistent formatting. |
| **📚 3x API Documentation** | Swagger UI, Scalar Reference, and ReDoc all served from one OpenAPI spec. |
| **⚡ SWR Cache System** | High-performance Stale-While-Revalidate caching with distributed locking logic. |
| **🚦 Rate Limiting** | Built-in protection against brute-force attacks (Throttler). |
| **🛡️ Security Hardening** | Helmet (headers), Compression (performance), and JSON body limits. |
| **🏥 Health Checks** | Built-in health check endpoint for monitoring. |
| **📣 Event-Driven Architecture** | Built-in EventEmitter2 integration for decoupled communication. |
| **⚙️ Type-Safe Config** | Environment variable management with validation and environment mode helpers. |
| **🏗️ Base Classes** | `BaseController` and `BaseService` with built-in logging and event helpers. |
| **🪵 Pro Logging** | Winston-powered logger with per-request context and unique Request IDs. |
| **🛑 Graceful Shutdown** | Ensures cleanup and safe disconnection on app termination. |
| **🐳 Docker Ready** | Production-optimized Dockerfile and docker-compose setup. |
| **✨ Custom Decorators** | Clean, maintainable code with `@ApiRes`, `@SwrCache`, and `@SkipResponseTransform`. |
| **🔗 Shareable Schemas** | Pure Zod schemas usable on both backend (validation/docs) and frontend (forms/types). |

---

## 🛠 Prerequisites

- **Node.js**: v20 or higher (v22 recommended; Docker image uses `node:22-alpine`)
- **Package Manager**: npm (lockfile included), or pnpm/yarn

---

## 🚀 Quick Start

### 1. Setup the Project
```bash
# Clone the repository
git clone https://github.com/faraz9901/nestjs-starter
cd nestjs-starter

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### 🚀 Running the Application
```bash
# Development mode (with hot-reload)
npm run dev

# Production mode
npm run build
npm run start:prod
```

### 🐳 Docker Setup
Run the entire stack (including any services you add) with one command:
```bash
docker-compose up --build
```
The app will be available at `http://localhost:9000` (port from `.env` / compose mapping).

### 3. Explore the Documentation
Access your API documentation in three different styles (Development only):
- **Swagger UI**: `http://localhost:<PORT>/api/docs`
- **Scalar Reference**: `http://localhost:<PORT>/api/scalar`
- **ReDoc**: `http://localhost:<PORT>/api/redoc`
- **OpenAPI JSON**: `http://localhost:<PORT>/api/openapi.json`

---

## 📂 Project Structure

```text
src/
├── common/                      # Shared utilities, base classes, and filters
│   ├── base.controller.ts       # BaseController with response helpers
│   ├── base.service.ts          # BaseService with logger & event emitter
│   ├── errors.ts                # ErrorCode enum, ApiError, Global Filter
│   ├── get-assets.ts            # 📁 Asset path resolution helper
│   ├── logger.service.ts        # Winston logger + AppLogger wrapper
│   ├── request-logging/         # Request ID + HTTP lifecycle logging
│   ├── shuttingdown-hook.ts     # 🛑 Graceful shutdown handler
│   └── swagger.ts               # ApiSuccessResponse, SuccessBody, ErrorBody, EmptyResponse
├── config/
│   └── config.service.ts        # Type-safe environment configuration
├── decorators/
│   ├── api-responses.decorator.ts       # @ApiRes (docs + response metadata + validate)
│   └── skip-response-transform.decorator.ts # Bypass interceptor
├── events/
│   └── UserUpdatedEvent.ts      # Example event class
├── interceptors/
│   └── responses.interceptor.ts # Global response envelope + Zod response validation
├── assets/                      # 🖼️ Static assets (images, templates, etc.)
├── modules/                     # Feature modules (Business Logic)
│   ├── cache/                   # 🔥 SWR Cache Module (Storage, Locks, Decorators)
│   └── users/                   # 👤 Example User module
│       ├── user.schema.ts       # Pure Zod schemas (request + response)
│       ├── users.dto.ts         # createZodDto wrapper for request body
│       └── user.responses.ts    # createZodDto wrapper for response shape
├── app.controller.ts            # Root controller (health check)
├── app.module.ts                # Root module with global configuration
└── main.ts                      # Application entry point & Global setup
```

---

## 🧠 Core Concepts

### Standardized API Responses

All API responses follow a consistent envelope structure, automatically applied by the `ResponseInterceptor`. This makes frontend integration predictable.

#### Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Error Response Format
```json
{
  "success": false,
  "message": "Resource not found",
  "code": "RESOURCE_NOT_FOUND",
  "details": null
}
```

---

### Global Validation (Zod)

The application uses a globally configured **`ZodValidationPipe`** (from `nestjs-zod`). Incoming request bodies are validated and transformed against **Zod schemas** wrapped as DTOs via `createZodDto`.

**Example schema + DTO:**
```typescript
// user.schema.ts — pure Zod, no Nest imports (shareable with frontend)
import { z } from 'zod';

export const userSchema = z.strictObject({
  id: z.number().meta({ example: 1 }),
  name: z.string().meta({ example: 'John Doe' }),
  password: z.string().meta({ example: 'StrongPassword' }),
});

export type User = z.infer<typeof userSchema>;
```

```typescript
// users.dto.ts — Nest-facing wrapper
import { createZodDto } from 'nestjs-zod';
import { userSchema } from './user.schema';

export class UserDto extends createZodDto(userSchema) {}
```

**In a controller:**
```typescript
@Post()
@ApiRes('Create user', EmptyResponse, HttpStatus.OK)
createUser(@Body() dto: UserDto) {
  // dto is validated & typed from the Zod schema
}
```

**Key behaviors:**
- **`z.strictObject`** rejects unknown keys (equivalent to old `forbidNonWhitelisted`).
- **`.meta({ example })`** feeds examples into OpenAPI/Swagger docs.
- Validation errors are mapped to the standard error envelope (`message`, `code`, `details`) by a custom exception factory in `main.ts`.

**Response validation (optional):** When `validate: true` is set on `@ApiRes` (or `VALIDATE_RESPONSES=true` globally), the `ResponseInterceptor` runs `schema.parse()` on outgoing data — this both **validates** and **strips unknown fields** (e.g. dropping `password` from `UserResponse`).

---

### Error Handling

The starter provides a comprehensive error handling system:

1.  **ErrorCode Enum**: A complete set of standardized codes (e.g., `VALIDATION_ERROR`, `UNAUTHORIZED`, `RESOURCE_NOT_FOUND`).
2.  **HTTPEXCEPTION Helper**: Factory methods for throwing standardized errors.
    ```typescript
    throw HTTPEXCEPTION.NOT_FOUND('User not found');
    throw HTTPEXCEPTION.VALIDATION('Invalid email format', { field: 'email' });
    ```
3.  **AllExceptionsFilter**: Catches all errors, formats them consistently, and hides stack traces in production.

---

### 🔄 SWR Cache System

This starter includes a custom **Stale-While-Revalidate (SWR)** caching module. It allows your API to serve "stale" data instantly while refreshing the cache in the background.

#### Key Features:
- **Soft TTL**: Period during which stale data is served.
- **Hard TTL**: Absolute expiration of the cache entry.
- **Distributed Locking Logic**: Prevents "cache stampede" by ensuring only one request refreshes the cache at a time.
- **Memory Storage**: Uses `lru-cache` for high-performance in-memory storage.

**Example Usage:**
```typescript
@Get()
@ApiRes('Get all users', UserResponse, HttpStatus.OK, { isArray: true })
@SwrCache({
  key: (req) => `${req.method}:${req.url}`, // Custom cache key
  softTtlMs: 30_000, // 30 seconds
  hardTtlMs: 60_000, // 60 seconds
})
async findAll() {
  return this.respondOk(await this.userService.getUsers(), 'Users fetched successfully');
}
```

#### 🛠️ Manual Control with `SwrCacheService`
For cases where the `@SwrCache` decorator isn't flexible enough (e.g., manual invalidation or conditional caching), you can inject the `SwrCacheService` directly.

```typescript
@Injectable()
export class ProductService {
  constructor(private readonly cache: SwrCacheService) {}

  async getProduct(id: string) {
    const key = `product:${id}`;
    const result = await this.cache.get<Product>(key);

    if (result.type === 'hit' || result.type === 'stale') {
      return result.data;
    }

    // On miss, fetch from source and update cache
    const product = await this.fetchProductFromDB(id);
    await this.cache.set(key, product, 30_000, 60_000);
    return product;
  }

  async invalidateProduct(id: string) {
    await this.cache.delete(`product:${id}`);
  }
}
```

#### 🔌 Custom Storage (Redis/External)
The caching system is pluggable. To use Redis instead of memory, implement the `CacheStorage` or `LockStorage` interfaces and update the providers in `cache.module.ts`.

```typescript
// 1. Implement the interface
@Injectable()
export class RedisCacheStorage implements CacheStorage {
  async get<T>(key: string): Promise<T | null> { /* ... */ }
  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> { /* ... */ }
  async delete(key: string): Promise<void> { /* ... */ }
}

// 2. Register in cache.module.ts
{
  provide: CACHE_STORAGE,
  useClass: RedisCacheStorage,
}
```

---

### 📁 Static Assets & File Management

The starter kit includes a dedicated `src/assets` folder for static files (images, templates, etc.). These are automatically tracked and copied to the `dist` folder during the build process.

#### 🛠️ Helper: `getAssetPath`
Located in `src/common/get-assets.ts`, this utility ensures you always get the correct absolute path to your assets, whether running in development or production.

**Example Usage:**
```typescript
import { getAssetPath } from '@/common/get-assets';

const filePath = getAssetPath('dummy-assets.txt');
// Resolves to: <project>/src/assets/dummy-assets.txt (or dist/assets in prod)
```

---

### 🏥 Health Check

By default, the root path (`/`) acts as the health check endpoint. It returns the server status and basic info to monitoring tools.
- **To change the path**: Update the `@Get()` route in `src/app.controller.ts`.

---

### Event-Driven Architecture

Built-in support for `@nestjs/event-emitter`.

#### 1. Emitting Events
```typescript
@Injectable()
export class UsersService extends BaseService {
  updateUser(userId: string) {
    // ... logic
    this.emitAsync(new UserUpdatedEvent(userId));
    // or fire-and-forget: this.emit(new UserUpdatedEvent(userId));
  }
}
```

#### 2. Listening to Events
```typescript
@OnEvent(UserUpdatedEvent.name)
handleUserUpdated(event: UserUpdatedEvent) {
  this.logger.info('Handling user update event', { userId: event.userId });
}
```

---

## 🏗️ Base Classes

### BaseController
Provides helper methods for consistent response formatting.
- `this.respondOk(data, message?)` → Returns 200 OK
- `this.respondCreated(data, message?)` → Returns 201 Created

### BaseService
Provides pre-configured utilities:
- `this.logger`: Context-aware logger (prefixed with service name and Request ID).
- `this.eventEmitter`: Access to the global event emitter.
- `this.emit(event)` / `this.emitAsync(event)`: Shortcut methods for events.

**Logging Example:**
```typescript
@Injectable()
export class AnalyticsService extends BaseService {
  trackEvent(name: string) {
    this.logger.info(`Tracking event: ${name}`, { timestamp: new Date() });
    // Output: [2024-05-10 10:00:00] INFO [AnalyticsService] [REQ-123] Tracking event: login
  }
}
```

---

## 🎨 Custom Decorators

### @ApiRes
Combines `@ApiOperation`, Swagger response documentation, and response-validation metadata into one decorator.

```typescript
@ApiRes('Get all users', UserResponse, HttpStatus.OK, {
  isArray: true,   // document data as an array
  validate: true,  // force response validation for this endpoint (overrides VALIDATE_RESPONSES)
})
```

| Option | Type | Description |
| :----- | :--- | :---------- |
| `isArray` | `boolean` | Document `data` as an array of the response type. |
| `validate` | `boolean` | Per-endpoint override for response validation. Omitted → falls back to `VALIDATE_RESPONSES` env. |

**How it works:**
- Pulls the Zod schema from the `createZodDto` class and stores it as metadata for the `ResponseInterceptor`.
- When `validate` is effective, the interceptor runs `schema.parse(data)` — validating the payload and stripping unknown fields.

#### Per-endpoint validation control

Global default comes from the environment:

| Variable | Description | Default |
| :------- | :---------- | :------ |
| `VALIDATE_RESPONSES` | Validate outgoing responses against the Zod response schema | `false` |

Override per endpoint:

```typescript
// Force validation even if env is false (public APIs, payments, critical DTOs)
@ApiRes('Get user', UserResponse, HttpStatus.OK, { validate: true })

// Skip validation for heavy/internal endpoints
@ApiRes('List items', ItemResponse, HttpStatus.OK, { isArray: true, validate: false })
```

Useful for:
- public APIs / payment responses / critical DTO contracts
- large datasets and performance-sensitive routes
- debugging serialization issues

### @SwrCache
Enables the SWR caching strategy on a controller method.
```typescript
@SwrCache({ softTtlMs: 5000, hardTtlMs: 10000 })
```

### @SkipResponseTransform
Bypasses the global response wrapper. Use this for raw data like file downloads or buffers.

---

## 🛡️ Security & Performance

This kit includes production-ready defaults for security and performance in `main.ts`:

- **Helmet**: Secures the app by setting various HTTP response headers.
- **Compression**: Gzip compression to decrease the size of the response body.
- **JSON Body Limits**: Incoming JSON payloads are limited to `1mb` to prevent large-body attacks.
- **X-Request-Id Header**: Every response includes an `X-Request-Id` header for frontend traceability and debugging.

---

## 📝 Logging System

### Winston-based Logging
NestJS internal logs and service logs are routed through **Winston**.
- Key file: `src/common/logger.service.ts`
- Formatted output: `[TIMESTAMP] LEVEL [CONTEXT] MESSAGE`

#### 🪵 Using Logger Outside Base Classes
If your class does not extend `BaseService` (e.g., a standalone utility or helper), you can still use the `AppLogger` manually:

```typescript
import { AppLogger, winstonLogger } from '@/common/logger.service';

export class DataHelper {
  private readonly logger = new AppLogger(winstonLogger, 'DataHelper');

  parse() {
    this.logger.info('Starting data parsing');
    try {
      // ... logic
    } catch (err) {
      this.logger.error('Parsing failed', err);
    }
  }
}
```

### Request ID Traceability
Every request is assigned a unique **Request ID** via middleware and `AsyncLocalStorage`. This ID is automatically prefixed to every log line generated during that request.

**Log Example:**
```text
[2024-05-10 12:00:00] INFO [UsersService] [REQ-ABC123] Fetching user data...
```

### ⏱️ Timing Metrics
The request logging middleware automatically tracks and logs the duration of every HTTP request:
```text
[REQ-ABC123] Request Completed GET /users 200 12ms
```

---

## 🚦 Rate Limiting

We use `@nestjs/throttler` to protect against brute-force and DoS attacks.
- **Default Config**: 20 requests per minute per IP (Configurable in `app.module.ts`).

#### Usage:
All routes are protected by default. Use decorators for specific overrides:
- **`@SkipThrottle()`**: Completely bypass rate limiting for a route.
- **`@Throttle({ default: { limit: 5, ttl: 60000 } })`**: Set custom limits for a route.

> [!TIP]
> For horizontal scaling, use a **Redis storage adapter** to share state across instances. Refer to the [NestJS Throttler Docs](https://docs.nestjs.com/techniques/throttling) for more.

---

## 🛑 Graceful Shutdown

The kit includes a `ShuttingDownHook` (`src/common/shuttingdown-hook.ts`) and has shutdown hooks enabled in `main.ts`.
- **How it works**: When the app receives a signal (SIGTERM, SIGINT), it executes `onApplicationShutdown`, allowing you to safely close database connections or finish pending tasks.

---

## 👨‍💻 Development Guide

### Database & ORM
This boilerplate is **ORM-agnostic**. It does not include an ORM (like TypeORM or Prisma) by default, allowing you to choose the best fit for your project.

### Creating a New Module
1. Generate the module: `nest g resource modules/products`
2. Create a pure Zod schema file (e.g. `product.schema.ts`) — no Nest imports, so it can be shared with a frontend later.
3. Create thin DTO wrappers with `createZodDto`:
   - `product.dto.ts` (request body)
   - `product.responses.ts` (response shape)
4. Extend `BaseController` and `BaseService`.
5. Use `@ApiRes` for documentation + optional response validation.

**Example:**
```typescript
// product.schema.ts
import { z } from 'zod';

export const productSchema = z.strictObject({
  id: z.number().meta({ example: 1 }),
  name: z.string().meta({ example: 'Widget' }),
});

export const productResponseSchema = z.object(productSchema.shape).pick({ id: true, name: true });
```

```typescript
// product.dto.ts
import { createZodDto } from 'nestjs-zod';
import { productSchema } from './product.schema';

export class ProductDto extends createZodDto(productSchema) {}
```

```typescript
// products.controller.ts
@Get()
@ApiRes('Get products', ProductResponse, HttpStatus.OK, { isArray: true, validate: true })
async findAll() {
  return this.respondOk(await this.productService.getAll(), 'Products fetched');
}
```

---

## 🧪 Testing

```bash
npm test           # Run all tests (NODE_ENV=test, jest --config ./test/jest.json)
```

Tests live next to sources as `*.spec.ts`. E2E-style tests boot the Nest app with `@nestjs/testing` + `supertest`.

---

## 📜 Available Scripts

| Script | Description |
| :----- | :---------- |
| `build` | Compiles TypeScript to `dist/` |
| `dev` / `start:dev` | Starts in watch mode (development) |
| `start` / `start:prod` | Runs compiled app from `dist/main` |
| `lint` | Lints and fixes code using ESLint |
| `lint:check` | Lint without fixing (CI-friendly) |
| `typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `format` | Formats code using Prettier |
| `test` | Runs Jest test suite |

Git hooks (Husky):
- **pre-commit**: `format`, `lint`, `git add -u`
- **pre-push**: `typecheck`, `build`, `test`

---

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Required | Default |
| :------- | :---------- | :------- | :------ |
| `PORT` | HTTP server port | ✅ Yes | `9000` |
| `NODE_ENV` | `development`, `production`, `test` | No | `development` |
| `VALIDATE_RESPONSES` | Validate outgoing responses against Zod response schemas | No | `false` |
| `BASE_URL` | Used for Swagger server URL | No | `http://localhost:<PORT>` |

> Note: `.env.test` is loaded automatically when `NODE_ENV=test` (used by the test suite).

---

## 📄 License

This project is licensed under the MIT License (see [LICENSE](./LICENSE)).
