# 🚀 NestJS Production-Ready Starter Kit

A production-ready **NestJS boilerplate** designed for scalability, consistency, and developer experience. This starter provides a solid foundation for building RESTful APIs with standardized responses, advanced error handling, automated documentation, and high-performance caching.

---

## 📖 Table of Contents
- [✨ Why this Starter exists](#-starter-exists)
- [✨ Features Overview](#-features-overview)
- [🛠 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [📂 Project Structure](#-project-structure)
- [🧠 Core Concepts](#-core-concepts)
  - [Standardized API Responses](#standardized-api-responses)
  - [Global Validation](#global-validation)
  - [Error Handling](#error-handling)
  - [Documentation (Swagger, Scalar, ReDoc)](#documentation-swagger-scalar-redoc)
  - [🔄 SWR Cache System](#-swr-cache-system)
  - [📁 Static Assets & File Management](#-static-assets--file-management)
  - [🏥 Health Check](#-health-check)
  - [Event-Driven Architecture](#event-driven-architecture)
  - [Configuration Management](#configuration-management)
- [🏗️ Base Classes](#-base-classes)
  - [BaseController](#basecontroller)
  - [BaseService](#baseservice)
- [🎨 Custom Decorators](#-custom-decorators)
  - [@ApiRes](#apires)
  - [@ExposeApiProperty](#exposeapiproperty)
  - [@SwrCache](#swrcache)
  - [@SkipResponseTransform](#skipresponsetransform)
- [🛡️ Security & Performance](#-security--performance)
- [🔄 Response Interceptor](#-response-interceptor)
- [📝 Logging System](#-logging-system)
  - [Winston Logging](#winston-based-logging)
  - [Request ID Traceability](#request-scoped-request-id-in-logs)
  - [⏱️ Timing Metrics](#timing-metrics)
- [🚦 Rate Limiting](#-rate-limiting)
- [🛑 Graceful Shutdown](#-graceful-shutdown)
- [👨‍💻 Development Guide](#-development-guide)
  - [Database & ORM](#database--orm)
  - [Security & CORS](#security--cors)
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
| **🛡️ Global Validation** | Automatic DTO validation and transformation using `class-validator`. |
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
| **✨ Custom Decorators** | Clean, maintainable code with `@ApiRes`, `@SwrCache`, and `@ExposeApiProperty`. |

---

## 🛠 Prerequisites

- **Node.js**: v18 or higher
- **Package Manager**: [pnpm](https://pnpm.io/) (recommended), npm, or yarn

---

## 🚀 Quick Start

### 1. Setup the Project
```bash
# Clone the repository
git clone https://github.com/faraz9901/nestjs-starter
cd nestjs-starter

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
```

### 🚀 Running the Application
```bash
# Development mode (with hot-reload)
pnpm run dev

# Production mode
pnpm run build
pnpm run start:prod
```

### 🐳 Docker Setup
Run the entire stack (including any services you add) with one command:
```bash
docker-compose up --build
```
The app will be available at `http://localhost:9000`.

The server will start on `http://localhost:9000`.

### 3. Explore the Documentation
Access your API documentation in three different styles (Development only):
- **Swagger UI**: `http://localhost:9000/api/docs`
- **Scalar Reference**: `http://localhost:9000/api/scalar`
- **ReDoc**: `http://localhost:9000/api/redoc`

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
│   ├── request-logging/          # Request ID + HTTP lifecycle logging
│   ├── shuttingdown-hook.ts     # 🛑 Graceful shutdown handler
│   └── swagger.ts               # Swagger helper types & SuccessBody model
├── config/
│   └── config.service.ts        # Type-safe environment configuration
├── decorators/
│   ├── api-responses.decorator.ts    # @ApiRes decorator
│   ├── expose-api-property.decorator.ts  # Combined @Expose + @ApiProperty
│   └── skip-response-transform.decorator.ts # Bypass interceptor
├── events/
│   └── UserUpdatedEvent.ts      # Example event class
├── interceptors/
│   └── responses.interceptor.ts # Global response transformation
├── assets/                      # 🖼️ Static assets (images, templates, etc.)
├── modules/                     # Feature modules (Business Logic)
│   ├── cache/                   # 🔥 SWR Cache Module (Storage, Locks, Decorators)
│   └── users/                   # 👤 Example User module
├── app.controller.ts            # Root controller
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

### Global Validation

The application uses a globally configured `ValidationPipe`. It strips properties not in your DTO and automatically transforms payloads into class instances.

**Example DTO:**
```typescript
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```

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
@SwrCache({
  key: (req) => `users:list:${req.query.page}`, // Custom cache key
  softTtlMs: 30000, // 30 seconds
  hardTtlMs: 60000, // 60 seconds
})
async findAll() {
  return this.userService.getUsers();
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
    await this.cache.set(key, product, 30000, 60000);
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

**Example Usage in a Service:**
```typescript
import { getAssetPath } from 'src/common/get-assets';

@Injectable()
export class UsersService {
  async processImage(filename: string) {
    // Resolves to: /absolute/path/to/src/assets/images/logo.png
    const imagePath = await getAssetPath('images', filename);
    
    // ... logic to read/process the file
    return imagePath;
  }
}
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
    this.emit(new UserUpdatedEvent(userId));
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
- `this.respondOk(data, message?)` -> Returns 200 OK
- `this.respondCreated(data, message?)` -> Returns 201 Created

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
Combines `@ApiOperation` and Swagger response documentation into one.
```typescript
@ApiRes('Get all users', UserResponse, HttpStatus.OK, { isArray: true })
```

### @ExposeApiProperty
Combines `@Expose` (class-transformer) and `@ApiProperty` (Swagger). Essential for the `ResponseInterceptor` to know which fields to return.
```typescript
export class UserResponse {
  @ExposeApiProperty({ example: 1 })
  id: number;
}
```

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
import { AppLogger, winstonLogger } from 'src/common/logger.service';

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
2. Create separate files for:
   - `product.dto.ts` (Input validation)
   - `product.responses.ts` (Output transformation)
3. Extend `BaseController` and `BaseService`.
4. Use `@ApiRes` and `@ExposeApiProperty` for documentation and transformation.

---

## 🧪 Testing

```bash
pnpm run test        # Unit tests
pnpm run test:e2e    # End-to-end tests
pnpm run test:cov    # Coverage report
```

---

## 📜 Available Scripts

| Script | Description |
| :----- | :---------- |
| `build` | Compiles TypeScript to `dist/` |
| `dev` | Starts in watch mode (development) |
| `start:prod` | Runs compiled app from `dist/main.js` |
| `lint` | Lints and fixes code using ESLint |
| `format` | Formats code using Prettier |

---

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Required | Default |
| :------- | :---------- | :------- | :------ |
| `PORT` | HTTP server port | ✅ Yes | `9000` |
| `NODE_ENV` | `development`, `production`, `test` | No | `development` |
| `STRIP_RESPONSES` | Removes fields not marked with `@Expose` | No | `false` |
| `VALIDATE_RESPONSES` | Validates outgoing data against DTO | No | `false` |
| `BASE_URL` | Used for Swagger server URL | No | `http://localhost:<PORT>` |

---

## 📄 License

This project is licensed under the MIT License.
