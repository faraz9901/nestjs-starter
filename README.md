# 🚀 NestJS Starter Template

A production-ready **NestJS boilerplate** designed for scalability, consistency, and developer experience.

This starter provides a solid foundation for building RESTful APIs with **standardized responses**, **advanced error handling**, **automated Swagger documentation**, and **safe environment configuration**.

---

## ✨ Features

- **🛡️ Global Validation**: Automatic DTO validation and transformation using `class-validator` and `class-transformer`.
- **📦 Standardized Responses**: Uniform API response structure (`success`, `message`, `data`) via Global Interceptors.
- **🚨 Centralized Error Handling**: Global Exception Filter to catch and format errors consistently without leaking stack traces in production.
- **DOCUMENTATION Swagger UI**: Auto-generated API documentation available at `/api/docs` with custom decorators for clean controller code.
- **⚙️ Config Service**: Type-safe environment variable management using `dotenv`.
- **🏗️ Base Controller**: Helper methods (`respondOk`, `respondCreated`) to reduce boilerplate in your controllers.
- **📐 Modular Architecture**: Organized folder structure designed for feature expansion.

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

Create a `.env` file in the root directory. You can copy the structure below:

```env
PORT=9000
NODE_ENV=development
```

| Variable   | Description                                      | Default |
| :--------- | :----------------------------------------------- | :------ |
| `PORT`     | The port the application runs on                 | `9000`  |
| `NODE_ENV` | Environment mode (`development` or `production`) | -       |

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
├── common/             # Shared utilities, base classes, and filters
│   ├── base.controller.ts  # Base properties for Controllers
│   ├── errors.ts           # Global exception filter
│   └── swagger.ts          # Swagger helper types
├── config/             # Environment configuration service
├── decorators/         # Custom decorators (e.g., @ApiRes)
├── interceptors/       # Global response interceptors
├── modules/            # Feature modules (Business Logic)
│   └── users/          # Example User module
├── app.module.ts       # Root module
└── main.ts             # Application entry point
```

---

## 👨‍💻 Development Guide

### Creating a New Resource

Use the NestCLI to generate standardized resources:

```bash
nest g resource modules/my-feature
```

### Using the BaseController

Extend `BaseController` in your controllers to access helper methods for consistent responses:

```typescript
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { BaseController } from '../../common/base.controller';
import { ApiRes } from '../../decorators/api-responses.decorator';

@Controller('items')
export class ItemsController extends BaseController {
  
  @Get()
  @ApiRes('Get all items', ItemDto, HttpStatus.OK, { isArray: true })
  findAll() {
    const data = [{ id: 1, name: 'Item 1' }];
    // Returns: { success: true, message: 'Fetched successfully', data: [...] }
    return this.respondOk(data, 'Fetched successfully');
  }
}
```

### BaseService & Logger

The `BaseService` provides a pre-configured logger instance that automatically uses the service name as the context.

```typescript
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';

@Injectable()
export class ItemsService extends BaseService {
  
  doSomething() {
    this.logger.info('Performing action...');
    
    try {
      // business logic
      this.logger.debug({ someId: 123 });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
```

### Exception Handling

This starter includes a robust error handling system with pre-defined error codes and helpers.

#### throwing Exceptions

Use the `HTTPEXCEPTION` helper to throw standardized errors (that get auto-formatted by the global filter).

```typescript
import { HTTPEXCEPTION, ErrorCode } from '../../common/errors';

// ... inside a service or controller
if (!item) {
  throw HTTPEXCEPTION.NOT_FOUND('Item not found', ErrorCode.RESOURCE_NOT_FOUND);
}

if (item.isLocked) {
  throw HTTPEXCEPTION.FORBIDDEN('Item is locked', ErrorCode.RESOURCE_LOCKED);
}
```

#### Error Codes

A comprehensive list of `ErrorCode` enums is available in `src/common/errors.ts` covering:

- **Generic**: `INTERNAL_ERROR`, `BAD_REQUEST`, `TIMEOUT`...
- **Auth**: `UNAUTHORIZED`, `TOKEN_EXPIRED`, `FORBIDDEN`...
- **Resource**: `NOT_FOUND`, `RESOURCE_CONFLICT`, `RESOURCE_ALREADY_EXISTS`...
- **Business Logic**: `BUSINESS_RULE_VIOLATION`, `LIMIT_EXCEEDED`...

### Swagger Documentation

Instead of verbose Swagger decorators, use the custom `@ApiRes` and `@ApiWithBody` decorators found in `src/decorators/api-responses.decorator.ts`.

- **@ApiRes**: For GET/DELETE endpoints (no body).
- **@ApiWithBody**: For POST/PUT/PATCH endpoints (with body).

---

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

---

## 📜 Scripts

| Script        | Description                                     |
| :------------ | :---------------------------------------------- |
| `build`       | Compiles the application to `dist/`             |
| `format`      | Formats code using Prettier                     |
| `start:dev`   | Starts the app in watch mode                    |
| `start:prod`  | Starts the app from `dist/main.js`              |
| `lint`        | Lints code using ESLint                         |

---

## 📄 License

This project is licensed under the MIT License.
