# NestJS Backend Starter

An opinionated NestJS starter template focused on **consistent API responses**, **environment-based configuration**, and **ready-to-use Swagger documentation** — designed to scale cleanly as your application grows.

This project uses **pnpm by default**, but includes instructions for **npm** and **yarn** as well.

This template reduces boilerplate by providing:
- Unified response envelopes
- Reusable Swagger decorators
- Centralized error handling
- A clear and scalable module organization strategy

---

## Why this starter?

NestJS is powerful, but large projects often suffer from:
- Inconsistent API responses
- Swagger drift from real responses
- Repetitive controller boilerplate
- Scattered configuration and error handling

This starter enforces **consistency by default** while staying flexible enough
to grow into real production systems.



## When this starter may not be a good fit

- Apps that require GraphQL-only APIs
- Very small throwaway services
- Teams that prefer unopinionated Nest defaults


## Features

- **Global validation** using Nest `ValidationPipe` with:
  - Payload whitelisting
  - Rejection of unknown fields
  - Automatic transformation to DTO classes

- **Unified API responses** via:
  - `ApiResponse` and `BaseController` (`src/common/base.controller.ts`)
  - `ResponseInterceptor` (`src/interceptors/responses.interceptor.ts`)

- **Centralized error handling**
  - Global `AllExceptionsFilter` (`src/common/errors.ts`)
  - Consistent error response format

- **Environment-driven config**
  - Custom `configService` (`src/config/config.service.ts`)
  - Application fails fast if required env vars are missing

- **Swagger out of the box**
  - Auto-generated Swagger docs
  - Reusable decorators (`ApiSuccessResponse`, `ApiRes`, `ApiWithBody`)
  - Swagger enabled only in non-production environments

- **Production / development awareness**
  - Controlled via `NODE_ENV`

---

## Project Structure (Relevant Parts)

```txt
src/
├── common/
│   ├── base.controller.ts
│   ├── errors.ts
│   └── swagger.ts
├── config/
│   └── config.service.ts
├── decorators/
│   └── api-responses.decorator.ts
├── interceptors/
│   └── responses.interceptor.ts
├── modules/
│   └── users/
│       ├── users.controller.ts
│       ├── users.dto.ts
│       └── users.module.ts
├── main.ts
```

---

## Core Concepts

### BaseController & ApiResponse

All controllers **extend `BaseController`** to return standardized success responses.

```ts
return this.respondOk(data, 'Success message');
return this.respondCreated(data, 'Created successfully');
```

The global `ResponseInterceptor` wraps responses into:

```ts
{
  success: boolean;
  message: string;
  data: T | T[] | null;
}
```
---

## Error Handling Strategy

- All exceptions are caught globally
- HTTP errors preserve status codes
- Unknown errors return a safe generic message
- Stack traces are hidden in production

### Error Response

The global `AllExceptionsFilter` wraps errors into:

```ts
{
  success: false,
  message: string,
  code: ErrorCode,
  details?: any
}
```
---

## Swagger Helpers

### ApiSuccessResponse

Located at:

```txt
src/common/swagger.ts
```

Documents responses using the shared response envelope instead of raw DTOs.

---

## Custom Swagger Decorators (Recommended)

To avoid repetitive Swagger annotations, this starter provides composed decorators.

### Location

```txt
src/decorators/api-responses.decorator.ts
```

### ApiRes – Endpoints without request body

```ts
@ApiRes(
  summary: string,
  responseType: Type<unknown>,
  status?: HttpStatus,
  options?: { isArray?: boolean }
)
```

#### Example

```ts
@Get()
@ApiRes('Get all users', UserDto, HttpStatus.OK, { isArray: true })
findAll() {
  return this.respondOk(users, 'Users fetched successfully');
}
```

---

### ApiWithBody – Endpoints with request body

```ts
@ApiWithBody(
  summary: string,
  bodyDto: Type<unknown>,
  responseType: Type<unknown>,
  status?: HttpStatus,
  options?: { isArray?: boolean }
)
```

#### Example

```ts
@Post()
@ApiWithBody(
  'Create user',
  CreateUserDto,
  UserDto,
  HttpStatus.CREATED,
)
create(@Body() dto: CreateUserDto) {
  return this.respondCreated(dto, 'User created successfully');
}
```

---

## Modules Folder Convention

All user-generated features live inside **`src/modules`**.

```txt
src/modules/<feature>/
├── <feature>.controller.ts
├── <feature>.dto.ts
├── <feature>.service.ts (optional)
└── <feature>.module.ts
```

### Why this structure?

- Keeps business logic isolated
- Scales well for large applications
- Easy to generate, move, or remove features
- Keeps `common`, `decorators`, and `config` truly shared

---

## Environment Configuration

Create a `.env` file in the project root:

```dotenv
PORT=9000
NODE_ENV=development
```

### Required variables

- **PORT** – HTTP server port (app fails on startup if missing)

### Optional variables

- **NODE_ENV**
  - `development`
  - `production`
  - Controls Swagger availability (`/api/docs` disabled in production)

---

## Running the App

### Development (watch mode)

```bash
pnpm run start:dev
# or: npm run start:dev / yarn start:dev
```

### Standard start

```bash
pnpm run start
```

### Production build & run

```bash
pnpm run build
pnpm run start:prod
```

By default, the app listens on the `PORT` from `.env` (fallback `9000` in `main.ts`).

---

## API Documentation (Swagger)

When `NODE_ENV !== production`, Swagger is available at:

```txt
http://localhost:<PORT>/api/docs
```

All endpoints are documented using the common response envelope.

---

## Example: Users Module

This template ships with a small, fully wired **Users** feature.

### Controller Example

```ts
@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController {

  @Get()
  @ApiRes('Get all users', UserDto, HttpStatus.OK, { isArray: true })
  findAll() {
    const users: UserDto[] = [
      { id: 1, name: 'John Doe' },
    ];

    return this.respondOk(users, 'Users fetched successfully');
  }
}
```

Response:

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    { "id": 1, "name": "John Doe" }
  ]
}
```

---

## Testing

```bash
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```

Watch mode:

```bash
pnpm run test:watch
```

---

## Linting & Formatting

```bash
pnpm run lint
pnpm run format
```

---

## Package Manager Cheat Sheet

- Install deps
  - `pnpm install`
  - `npm install`
  - `yarn install`

- Run scripts
  - `pnpm run <script>`
  - `npm run <script>`
  - `yarn <script>`

---

## License

This project is currently marked as **UNLICENSED**.
Update `package.json` before distributing.
