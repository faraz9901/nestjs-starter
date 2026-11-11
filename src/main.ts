import { BadRequestException } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/express-api-reference';
import redoc from 'redoc-express';
import { cleanupOpenApiDoc, createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/errors';
import { NestWinstonLogger, winstonLogger } from './common/logger.service';
import { ErrorBody, SuccessBody } from './common/swagger';
import { configService } from './config/config.service';
import { ResponseInterceptor } from './interceptors/responses.interceptor';
import { json, type Request, type Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';

// Map zod errors to the same BadRequestException shape ValidationPipe produced:
// { message: string[] } which AllExceptionsFilter turns into { message, details }
const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: unknown) => {
    const issues = error instanceof ZodError ? error.issues : [];
    const messages = issues.map((issue) =>
      issue.path.length > 0
        ? `${issue.path.join('.')}: ${issue.message}`
        : issue.message,
    );
    return new BadRequestException({
      message: messages.length > 0 ? messages : ['Validation failed'],
    });
  },
});

// Application entrypoint: creates the Nest app and wires up global behavior
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new NestWinstonLogger(winstonLogger),
  });

  // Validate/transform incoming request bodies against zod DTO schemas
  app.useGlobalPipes(new ZodValidationPipe());

  const port = configService.getPort() || 9000;

  // Use a global interceptor to wrap all responses in a consistent `{ success, message, data }` structure
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  // Global error handler for catching and formatting unhandled exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // Only expose Swagger docs when not running in production
  if (!configService.isProduction()) {
    const config = new DocumentBuilder()
      .setTitle('APIs Documentation')
      .setDescription('API documentation for this project')
      .setVersion('1.0')
      .addServer(
        configService.getValue('BASE_URL', false) || `http://localhost:${port}`,
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'bearer',
      )
      .build();

    const document = cleanupOpenApiDoc(
      SwaggerModule.createDocument(app, config, {
        extraModels: [SuccessBody, ErrorBody],
      }),
    );

    app
      .getHttpAdapter()
      .get('/api/openapi.json', (_req: Request, res: Response) => {
        return res.json(document);
      });

    SwaggerModule.setup('api/docs', app, document);

    // Scalar - primary modern docs
    app.use(
      '/api/scalar',
      apiReference({
        url: '/api/openapi.json',
      }),
    );

    // Redoc - polished alternate docs
    app.use(
      '/api/redoc',
      redoc({
        title: 'Redoc API Docs',
        specUrl: '/api/openapi.json',
      }),
    );
  }

  //Sensible defaults for security and performance - customize as needed for your project
  app.use(compression());
  app.use(helmet());
  app.use(json({ limit: '1mb' }));

  app.enableShutdownHooks();

  // Enable CORS (customize allowed origins via configService and uncomment below)
  // app.enableCors({
  //   origin: configService.getOrigins(),
  //   credentials: true
  // })

  // Start HTTP server on configured port
  await app.listen(port);
}

void bootstrap();
