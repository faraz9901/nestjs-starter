# AGENTS.md

Guidance for AI agents (and new contributors) working on this codebase.

## What this is

NestJS 11 production starter kit. REST API with:
- standardized `{ success, message, data }` response envelope
- **Zod** validation (via `nestjs-zod`) for requests and optional response validation
- Swagger/Scalar/ReDoc docs from one OpenAPI spec
- SWR cache, Winston logging, rate limiting, Docker

## Commands

| Command | Purpose |
| :------ | :------ |
| `npm run dev` | Watch mode dev server |
| `npm run build` | Compile to `dist/` |
| `npm run typecheck` | `tsc --noEmit` — run before finishing |
| `npm run lint:check` | ESLint without fix — run before finishing |
| `npm run lint` | ESLint with `--fix` |
| `npm run format` | Prettier write |
| `npm test` | Jest (`NODE_ENV=test`, config `test/jest.json`) |

Husky: pre-commit runs format+lint; pre-push runs typecheck+build+test.

## Project layout

```
src/
├── common/           # BaseController, BaseService, errors, swagger helpers, logger, assets helper
├── config/           # config.service.ts (env)
├── decorators/       # ApiRes, SkipResponseTransform
├── interceptors/     # ResponseInterceptor (envelope + zod response parse)
├── modules/
│   ├── cache/        # SWR cache (pluggable storage/locks)
│   └── users/        # Example module: schema → dto → controller/service
├── events/           # Event classes (extend Event from base.service)
└── main.ts           # Pipes, interceptor, filter, Swagger/Scalar/ReDoc
```

Path alias: `@/*` → `src/*` (tsconfig + jest `moduleNameMapper`).

## Conventions

### Validation (Zod — not class-validator)

- Define **pure Zod schemas** in `<module>/*.schema.ts`. No Nest imports in schema files so they can be shared with a frontend later.
- Wrap with `createZodDto(schema)` in `*.dto.ts` / `*.responses.ts` for `@Body()` typing and Swagger.
- Use `z.strictObject` for **request** schemas (rejects unknown keys).
- Use non-strict `z.object(...).pick(...)` for **response** schemas (strips extra fields, e.g. `password`).
- Put docs metadata on the schema: `.meta({ example: '...' })` — flows into OpenAPI.
- Global request validation: `ZodValidationPipe` in `main.ts` (custom exception factory → standard error envelope).

Do **not** add `class-validator` / `class-transformer` DTOs.

### Responses

- Controllers extend `BaseController`; return `this.respondOk(data, message?)` / `respondCreated(...)`.
- Document + attach response schema with one decorator:

```typescript
@ApiRes('Get all users', UserResponse, HttpStatus.OK, {
  isArray: true,   // optional
  validate: true,  // optional; omit → VALIDATE_RESPONSES env
})
```

- `ApiRes` reads the static `.schema` from the `createZodDto` class and stores it for the interceptor.
- When validation is on, interceptor does `schema.parse(data)` (validates **and** strips unknown keys).
- Raw/binary endpoints: `@SkipResponseTransform()`.

### Errors

- Throw with `HTTPEXCEPTION.*` helpers or `ApiError` from `src/common/errors.ts`.
- Never leak stack traces in production (`AllExceptionsFilter` handles this).

### Modules

1. `nest g resource modules/<name>` (or create manually).
2. `<name>.schema.ts` → `<name>.dto.ts` / `<name>.responses.ts` → controller + service.
3. Controller extends `BaseController`, service extends `BaseService`.
4. Register module in `app.module.ts` imports if root-level.

### Config

- All env access goes through `config.service.ts` (`ENV_VARIABLES` map + helpers).
- Add new vars to `.env.example` and the `ENV_VARIABLES` const.

### Logging

- Services: extend `BaseService` → `this.logger.info(...)`.
- Outside BaseService: `new AppLogger(winstonLogger, 'ContextName')`.
- Never `console.log` in app code.

## Key files to touch for common tasks

| Task | Files |
| :--- | :---- |
| New endpoint | `modules/<m>/<m>.controller.ts`, service, schema/dto |
| Change response envelope | `interceptors/responses.interceptor.ts`, `common/base.controller.ts` |
| Change validation behavior | `main.ts` (pipe), `decorators/api-responses.decorator.ts` |
| Swagger docs setup | `main.ts`, `common/swagger.ts` |
| Error shape / codes | `common/errors.ts` |
| New env var | `config/config.service.ts`, `.env.example` |
| Cache behavior | `modules/cache/**` |

## Verify before you finish

```bash
npm run typecheck
npm run lint:check
npm test
```

All three must pass. For doc-related changes, also boot (`npm run dev`) and check `/api/openapi.json` and `/api/docs`.

## Gotchas

- `ResponseInterceptor` is registered manually in `main.ts` with `new ResponseInterceptor(new Reflector())` — it needs `Reflector`.
- `EmptyResponse` is for `data: null` responses; do not attach a Zod schema to it.
- `@SwrCache` keys should include method+URL (or a stable business key) to avoid collisions.
- Tests load `.env.test` when `NODE_ENV=test`.
- Docker maps port `9000:9000`; local `.env` may use `8000` — docs URLs use `PORT` from env.
