import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/express-api-reference';
import redoc from 'redoc-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/errors';
import { ErrorBody, SuccessBody } from './common/swagger';
import { configService } from './config/config.service';
import { ResponseInterceptor } from './interceptors/responses.interceptor';

// Application entrypoint: creates the Nest app and wires up global behavior
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally so all incoming DTOs are validated
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.getPort() || 9000;


  // Use a global interceptor to wrap all responses in a consistent `{ success, message, data }` structure
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global error handler for catching and formatting unhandled exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // Only expose Swagger docs when not running in production
  if (!configService.isProduction()) {
    const config = new DocumentBuilder()
      .setTitle('APIs Documentation')
      .setDescription('API documentation for this project')
      .setVersion('1.0')
      .addServer(configService.getValue("BASE_URL", false) || `http://localhost:${port}`)
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

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [SuccessBody, ErrorBody],
    });

    app.getHttpAdapter().get('/api/openapi.json', (_req, res) => {
      return res.json(document);
    });

    SwaggerModule.setup('api/docs', app, document)

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

  // Enable CORS (customize allowed origins via configService and uncomment below)
  // app.enableCors({
  //   origin: configService.getOrigins(),
  //   credentials: true
  // })

  // Start HTTP server on configured port
  await app.listen(port);
}


bootstrap();
