# 🚀 NestJS Starter Template

A production-ready **NestJS boilerplate** designed for scalability, consistency, and developer experience.

This starter provides a solid foundation for building RESTful APIs with **standardized responses**, **advanced error handling**, **automated Swagger documentation**, **event-driven architecture**, and **type-safe configuration**.

---

## Table of Contents

- [Features Overview](#-features-overview)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Core Concepts](#-core-concepts)
  - [Standardized API Responses](#standardized-api-responses)
  - [Global Validation](#global-validation)
  - [Error Handling](#error-handling)
  - [Swagger Documentation](#swagger-documentation)
  - [Event-Driven Architecture](#event-driven-architecture)
  - [Configuration Management](#configuration-management)
- [Base Classes](#-base-classes)
  - [BaseController](#basecontroller)
  - [BaseService](#baseservice)
- [Custom Decorators](#-custom-decorators)
  - [@ApiRes](#apires)
  - [@ExposeApiProperty](#exposeapiproperty)
- [Response Interceptor](#-response-interceptor)
- [Logging System](#-logging-system)
- [Development Guide](#-development-guide)
- [Testing](#-testing)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## ✨ Features Overview

| Feature | Description |
| :------ | :---------- |
| **🛡️ Global Validation** | Automatic DTO validation and transformation using `class-validator` and `class-transformer` |
| **📦 Standardized Responses** | Uniform API response structure (`success`, `message`, `data`) via Global Interceptor |
| **🚨 Centralized Error Handling** | Global Exception Filter with comprehensive error codes and consistent error formatting |
| **📚 Swagger Documentation** | Auto-generated API docs at `/api/docs` with custom decorators for clean controller code |
| **⚡ Event-Driven Architecture** | Built-in EventEmitter2 integration for decoupled, event-based communication |
| **⚙️ Type-Safe Config** | Environment variable management with validation and mode helpers |
| **🏗️ Base Classes** | `BaseController` and `BaseService` with helper methods and built-in logging |
| **🎨 Custom Decorators** | `@ApiRes`, `@ExposeApiProperty` for cleaner, more maintainable code |
| **🔧 Response Transformation** | Automatic response stripping and validation via interceptor |

---

## 🛠 Prerequisites

- **Node.js**: v18 or higher
- **Package Manager**: [pnpm](https://pnpm.io/) (recommended), npm, or yarn

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/faraz9901/nestjs-starter
cd nestjs-starter
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=9000
NODE_ENV=development
STRIP_RESPONSES=true
VALIDATE_RESPONSES=true
```

### 4. Run the Application

```bash
# Development (Watch Mode)
pnpm run dev

# Production Mode
pnpm run start:prod
```

The server will start on `http://localhost:9000`.  
Swagger documentation will be available at `http://localhost:9000/api/docs` (Development mode only).

---

## 📂 Project Structure

```
src/
├── common/                      # Shared utilities, base classes, and filters
│   ├── base.controller.ts       # BaseController with response helpers
│   ├── base.service.ts          # BaseService with logger & event emitter
│   ├── errors.ts                # ErrorCode enum, ApiError, HTTPEXCEPTION, Global Filter
│   ├── logger.service.ts        # AppLogger with colored output
│   └── swagger.ts               # ApiSuccessResponse decorator & helper types
├── config/
│   └── config.service.ts        # Type-safe environment configuration
├── decorators/
│   ├── api-responses.decorator.ts    # @ApiRes decorator for Swagger
│   └── expose-api-property.decorator.ts  # Combined @Expose + @ApiProperty
├── events/
│   └── UserUpdatedEvent.ts      # Example event class
├── interceptors/
│   └── responses.interceptor.ts # Global response transformation interceptor
├── modules/                     # Feature modules (Business Logic)
│   └── users/                   # Example User module
│       ├── user.responses.ts    # Response DTOs (what gets returned)
│       ├── users.controller.ts  # User controller
│       ├── users.dto.ts         # Input DTOs (what comes in)
│       ├── users.module.ts      # User module definition
│       └── users.service.ts     # User service with event emission
├── app.controller.ts            # Root controller (health check)
├── app.module.ts                # Root module with EventEmitterModule
└── main.ts                      # Application entry point
```

---

## 🧠 Core Concepts

### Standardized API Responses

All API responses follow a consistent envelope structure, automatically applied by the `ResponseInterceptor`:

#### Success Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... } | [...] | null
}
```

#### Error Response Format

```json
{
  "success": false,
  "message": "Resource not found",
  "code": "RESOURCE_NOT_FOUND",
  "details": null | { ... } / [...]
}
```

This consistency makes frontend integration predictable and simplifies error handling on the client side.

---

### Global Validation

The application uses a globally configured `ValidationPipe` with the following options:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Strip properties not in DTO
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
    transform: true,            // Automatically transform payloads to DTO instances
  }),
);
```

**Benefits:**
- Prevents extra properties from being passed to your handlers
- Automatically transforms plain objects to class instances
- Validates all incoming data against DTO constraints

**Example DTO:**

```typescript
import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}
```

---

### Error Handling

The starter provides a comprehensive error handling system with three layers:

#### 1. ErrorCode Enum

A complete set of standardized error codes organized by category:

```typescript
enum ErrorCode {
  // Generic / System
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  BAD_REQUEST = 'BAD_REQUEST',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // Validation / Request
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  INVALID_QUERY_PARAMS = 'INVALID_QUERY_PARAMS',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',

  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_MISSING = 'TOKEN_MISSING',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Authorization
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ACCESS_DENIED = 'ACCESS_DENIED',

  // Resource
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_LOCKED = 'RESOURCE_LOCKED',

  // Business Logic
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  INVALID_STATE = 'INVALID_STATE',
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',

  // External / Integrations
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  EXTERNAL_SERVICE_UNAVAILABLE = 'EXTERNAL_SERVICE_UNAVAILABLE',
  EXTERNAL_TIMEOUT = 'EXTERNAL_TIMEOUT',
  THIRD_PARTY_FAILURE = 'THIRD_PARTY_FAILURE',
}
```

#### 2. HTTPEXCEPTION Helper

A namespace with factory methods for creating standardized errors:

```typescript
import { HTTPEXCEPTION, ErrorCode } from 'src/common/errors';

// 400 Bad Request
throw HTTPEXCEPTION.BAD_REQUEST('Invalid data format', ErrorCode.INVALID_FORMAT);

// 400 Validation Error (convenience method)
throw HTTPEXCEPTION.VALIDATION('Email is required', { field: 'email' });

// 401 Unauthorized
throw HTTPEXCEPTION.UNAUTHORIZED('Please log in');
throw HTTPEXCEPTION.TOKEN_EXPIRED();

// 403 Forbidden
throw HTTPEXCEPTION.FORBIDDEN('You cannot access this resource', ErrorCode.INSUFFICIENT_PERMISSIONS);

// 404 Not Found
throw HTTPEXCEPTION.NOT_FOUND('User not found');

// 409 Conflict
throw HTTPEXCEPTION.CONFLICT('Email already exists', ErrorCode.RESOURCE_ALREADY_EXISTS);

// 422 Unprocessable Entity
throw HTTPEXCEPTION.UNPROCESSABLE('Cannot delete active subscription');

// 500 Internal Server Error
throw HTTPEXCEPTION.INTERNAL('Database connection failed');

// 503 Service Unavailable
throw HTTPEXCEPTION.SERVICE_UNAVAILABLE('Payment gateway is down');
```

#### 3. AllExceptionsFilter

A global exception filter that catches all errors and formats them consistently:

- Catches `ApiError` instances (custom errors)
- Catches NestJS `HttpException` instances
- Catches unknown errors and wraps them appropriately
- Maps HTTP status codes to error codes automatically
- Hides stack traces in production mode

---

### Swagger Documentation

The starter provides custom decorators to reduce Swagger boilerplate while maintaining full documentation capabilities.

#### @ApiSuccessResponse Decorator

Located in `src/common/swagger.ts`, this decorator generates the standard response envelope in Swagger:

```typescript
import { ApiSuccessResponse } from 'src/common/swagger';

@Get()
@ApiSuccessResponse(UserDto, { 
  isArray: true, 
  message: 'Users fetched successfully',
  status: HttpStatus.OK 
})
findAll() { ... }
```

#### Swagger Configuration

Swagger is automatically configured in `main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Swagger APIs')
  .setDescription('API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```

**Access:** `http://localhost:9000/api/docs` (only in development mode)

---

### Event-Driven Architecture

The starter includes `@nestjs/event-emitter` for decoupled, event-based communication.

#### Event Base Class

Extend the `Event` class for type-safe events:

```typescript
// src/events/UserUpdatedEvent.ts
import { Event } from 'src/common/base.service';

export class UserUpdatedEvent extends Event {
  constructor(public readonly userId: string) {
    super(UserUpdatedEvent.name);
  }
}
```

#### Emitting Events

Use the `emit` or `emitAsync` methods from `BaseService`:

```typescript
@Injectable()
export class UsersService extends BaseService {
  updateUser(userId: string) {
    // ... update logic
    
    // Emit synchronously (fire and forget)
    this.emit(new UserUpdatedEvent(userId));
    
    // Or emit asynchronously (wait for handlers)
    await this.emitAsync(new UserUpdatedEvent(userId));
  }
}
```

#### Listening to Events

Use the `@OnEvent` decorator:

```typescript
@Injectable()
export class UsersService extends BaseService {
  @OnEvent(UserUpdatedEvent.name)
  handleUserUpdatedEvent(event: UserUpdatedEvent) {
    this.logger.info('User updated', { userId: event.userId });
    // ... handle event (e.g., send email, update cache)
  }
}
```

**EventEmitterModule Configuration:**

```typescript
// app.module.ts
EventEmitterModule.forRoot({
  wildcard: false,
  delimiter: '.',
  global: true,
})
```

---

### Configuration Management

Type-safe environment variable management via `ConfigService`:

#### Available Methods

```typescript
import { configService } from 'src/config/config.service';

// Get raw value
configService.getValue(ENV_VARIABLES.PORT);

// Get specific values
configService.getPort();           // Returns PORT value
configService.isProduction();      // Returns NODE_ENV === 'production'
configService.isDevelopment();     // Returns NODE_ENV === 'development'
configService.stripResponses();    // Returns STRIP_RESPONSES === 'true'
configService.validateResponses(); // Returns VALIDATE_RESPONSES === 'true'

// Validate required variables
configService.ensureValues([ENV_VARIABLES.PORT]);
```

#### Environment Variables

| Variable | Description | Required | Default |
| :------- | :---------- | :------- | :------ |
| `PORT` | Server port | Yes | - |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | No | - |
| `STRIP_RESPONSES` | Enable response transformation | No | `false` |
| `VALIDATE_RESPONSES` | Enable response validation | No | `false` |

---

## 🏗️ Base Classes

### BaseController

Provides helper methods for consistent response formatting.

**Location:** `src/common/base.controller.ts`

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { ApiRes } from 'src/decorators/api-responses.decorator';

@Controller('products')
export class ProductsController extends BaseController {
  
  @Get()
  @ApiRes('Get all products', ProductResponse, HttpStatus.OK, { isArray: true })
  findAll() {
    const products = this.productService.findAll();
    // Returns: { success: true, message: 'Products fetched', data: [...] }
    return this.respondOk(products, 'Products fetched');
  }

  @Post()
  @ApiRes('Create product', ProductResponse, HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    const product = this.productService.create(dto);
    // Returns: { success: true, message: 'Created', data: {...} }
    // HTTP Status: 201
    return this.respondCreated(product, 'Product created successfully');
  }
}
```

**Available Methods:**

| Method | HTTP Status | Description |
| :----- | :---------- | :---------- |
| `respondOk(data, message?)` | 200 | Standard success response |
| `respondCreated(data, message?)` | 201 | Resource created response |

---

### BaseService

Provides a pre-configured logger and event emitter.

**Location:** `src/common/base.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { UserUpdatedEvent } from 'src/events/UserUpdatedEvent';

@Injectable()
export class ProductsService extends BaseService {
  
  // Logger is automatically initialized with service name as context
  // this.logger = new AppLogger('ProductsService')
  
  findAll() {
    this.logger.info('Fetching all products');
    return this.products;
  }

  create(dto: CreateProductDto) {
    const product = { ...dto, id: Date.now() };
    
    this.logger.info('Creating product', { product });
    this.logger.debug({ dto }); // Debug-level logging
    
    this.emit(new ProductCreatedEvent(product.id));
    
    return product;
  }

  handleError(error: unknown) {
    this.logger.error(error);
  }
}
```

**Available Properties:**

| Property | Type | Description |
| :------- | :--- | :---------- |
| `logger` | `AppLogger` | Pre-configured logger with service name as context |
| `eventEmitter` | `EventEmitter2` | Injected event emitter |

**Available Methods:**

| Method | Description |
| :----- | :---------- |
| `emit(event)` | Emit event synchronously (fire and forget) |
| `emitAsync(event)` | Emit event asynchronously (returns Promise) |
| `onModuleInit()` | Logs service initialization automatically |

---

## 🎨 Custom Decorators

### @ApiRes

Combines `@ApiOperation` and `@ApiSuccessResponse` with response metadata for the interceptor.

**Location:** `src/decorators/api-responses.decorator.ts`

```typescript
import { ApiRes } from 'src/decorators/api-responses.decorator';

@Controller('items')
export class ItemsController {
  
  @Get()
  @ApiRes('Get all items', ItemResponse, HttpStatus.OK, { isArray: true })
  findAll() { ... }

  @Get(':id')
  @ApiRes('Get item by ID', ItemResponse, HttpStatus.OK)
  findOne(@Param('id') id: string) { ... }

  @Post()
  @ApiRes('Create item', ItemResponse, HttpStatus.CREATED)
  create(@Body() dto: CreateItemDto) { ... }
}
```

**Parameters:**

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `summary` | `string` | Operation summary for Swagger |
| `responseType` | `Type<unknown>` | DTO class for response shape |
| `status` | `HttpStatus` | HTTP status code (default: `OK`) |
| `options.isArray` | `boolean` | Whether response is an array |

---

### @ExposeApiProperty

Combines `@Expose` (class-transformer), `@ApiProperty` (Swagger), and `@Type` (class-transformer) into a single decorator.

**Location:** `src/decorators/expose-api-property.decorator.ts`

```typescript
import { IsString, IsNumber } from 'class-validator';
import { ExposeApiProperty } from 'src/decorators/expose-api-property.decorator';

export class UserResponse {
  @ExposeApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ExposeApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  // Nested object with type transformation
  @ExposeApiProperty({ type: AddressResponse })
  address: AddressResponse;
}
```

**Benefits:**
- Single decorator instead of three
- Automatic type transformation for nested DTOs
- Properties are exposed in response transformation
- Swagger documentation auto-generated

**Parameters:**

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `example` | `any` | Example value for Swagger |
| `type` | `ClassConstructor` | Class for nested object transformation |
| `...options` | `ApiPropertyOptions` | All standard ApiProperty options |

---

## 🔄 Response Interceptor

The `ResponseInterceptor` automatically transforms and validates responses.

**Location:** `src/interceptors/responses.interceptor.ts`

### Features

1. **Response Envelope Wrapping**: Wraps all responses in `{ success, message, data }`
2. **Response Stripping**: Removes properties not decorated with `@Expose` (when `STRIP_RESPONSES=true`)
3. **Response Validation**: Validates outgoing data against DTO (when `VALIDATE_RESPONSES=true`)

### How It Works

```typescript
// Controller returns ApiResponse
return this.respondOk(users, 'Users fetched');

// Interceptor transforms to:
{
  success: true,
  message: 'Users fetched',
  data: users // transformed and validated
}
```

### Response Stripping Example

```typescript
// Input DTO (from service)
const user = { id: 1, name: 'John', password: 'secret123' };

// Response DTO
export class UserResponse {
  @ExposeApiProperty() id: number;
  @ExposeApiProperty() name: string;
  // password is NOT exposed
}

// When STRIP_RESPONSES=true, output is:
{
  success: true,
  message: 'OK',
  data: { id: 1, name: 'John' }  // password stripped!
}
```

### Configuration

Enable in `.env`:

```env
STRIP_RESPONSES=true    # Enable property stripping
VALIDATE_RESPONSES=true # Enable response validation
```

---

## 📝 Logging System

The `AppLogger` extends NestJS's built-in Logger with additional features.

**Location:** `src/common/logger.service.ts`

### Features

- Colored output in development mode
- Multiple log levels
- Metadata support
- Context-aware logging (service name)

### Usage

```typescript
import { AppLogger } from 'src/common/logger.service';

@Injectable()
export class MyService {
  private readonly logger = new AppLogger(MyService.name);
  // Or extend BaseService to get this.logger automatically

  doSomething() {
    this.logger.info('Processing started');
    this.logger.info('User action', { color: 'green' }); // Colored in dev
    this.logger.debug({ userId: 123, action: 'login' });
    this.logger.warn('Rate limit approaching');
    this.logger.error(new Error('Something failed'));
  }
}
```

### Available Methods

| Method | Description | Output Level |
| :----- | :---------- | :----------- |
| `info(message, meta?)` | Informational messages | `LOG` |
| `debug(data)` | Debug data (objects, etc.) | `DEBUG` |
| `warn(message)` | Warning messages | `WARN` |
| `error(err)` | Error objects | `ERROR` |

### Colors

Available colors for development mode:

```typescript
'green' | 'red' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'gray'
```

---

## 👨‍💻 Development Guide

### Creating a New Module

1. Generate the resource using NestCLI:

```bash
nest g resource modules/products
```

2. Create separate files for:
   - Input DTOs (`products.dto.ts`)
   - Response DTOs (`product.responses.ts`)
   - Controller (`products.controller.ts`)
   - Service (`products.service.ts`)
   - Module (`products.module.ts`)

3. Extend base classes:

```typescript
// Controller
@Controller('products')
export class ProductsController extends BaseController {
  constructor(private readonly productsService: ProductsService) {
    super();
  }
  // ...
}

// Service
@Injectable()
export class ProductsService extends BaseService {
  // this.logger and this.eventEmitter available
  // ...
}
```

### Full Module Example

```typescript
// products.dto.ts (Input)
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ExposeApiProperty } from 'src/decorators/expose-api-property.decorator';

export class CreateProductDto {
  @ExposeApiProperty({ example: 'Widget' })
  @IsString()
  name: string;

  @ExposeApiProperty({ example: 99.99 })
  @IsNumber()
  price: number;

  @ExposeApiProperty({ example: 'A useful widget' })
  @IsString()
  @IsOptional()
  description?: string;
}

// product.responses.ts (Output)
import { IsString, IsNumber } from 'class-validator';
import { ExposeApiProperty } from 'src/decorators/expose-api-property.decorator';

export class ProductResponse {
  @ExposeApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ExposeApiProperty({ example: 'Widget' })
  @IsString()
  name: string;

  @ExposeApiProperty({ example: 99.99 })
  @IsNumber()
  price: number;
}

// products.controller.ts
@Controller('products')
@ApiTags('products')
export class ProductsController extends BaseController {
  constructor(private readonly productsService: ProductsService) {
    super();
  }

  @Get()
  @ApiRes('Get all products', ProductResponse, HttpStatus.OK, { isArray: true })
  findAll() {
    const products = this.productsService.findAll();
    return this.respondOk(products, 'Products fetched successfully');
  }

  @Post()
  @ApiRes('Create product', ProductResponse, HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    const product = this.productsService.create(dto);
    return this.respondCreated(product, 'Product created');
  }
}

// products.service.ts
@Injectable()
export class ProductsService extends BaseService {
  private products: ProductResponse[] = [];

  findAll() {
    this.logger.info('Fetching all products');
    return this.products;
  }

  create(dto: CreateProductDto) {
    const product = { ...dto, id: Date.now() };
    this.products.push(product);
    this.logger.info('Product created', { productId: product.id });
    return product;
  }
}
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# Unit tests with watch mode
pnpm run test:watch

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Debug tests
pnpm run test:debug
```

Test configuration files:
- `test/jest.json` - Unit test configuration
- `test/jest-e2e.json` - E2E test configuration
- `.env.test` - Environment variables for testing

---

## 📜 Available Scripts

| Script | Description |
| :----- | :---------- |
| `build` | Compiles TypeScript to `dist/` |
| `format` | Formats code using Prettier |
| `start` | Starts the app (no watch) |
| `start:dev` / `dev` | Starts in watch mode (development) |
| `start:debug` | Starts with debugger attached |
| `start:prod` | Runs compiled app from `dist/main.js` |
| `lint` | Lints and fixes code using ESLint |
| `test` | Runs unit tests |
| `test:watch` | Runs tests in watch mode |
| `test:cov` | Runs tests with coverage report |
| `test:e2e` | Runs E2E tests |
| `test:debug` | Runs tests with debugger |

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Required
PORT=9000

# Optional
NODE_ENV=development
STRIP_RESPONSES=true
VALIDATE_RESPONSES=true
```

| Variable | Description | Required | Default |
| :------- | :---------- | :------- | :------ |
| `PORT` | HTTP server port | ✅ Yes | - |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | No | - |
| `STRIP_RESPONSES` | Enable response property stripping | No | `false` |
| `VALIDATE_RESPONSES` | Enable response validation | No | `false` |

---

## 📄 License

This project is licensed under the MIT License.
