import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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


  // Use a global interceptor to wrap all responses in a consistent `{ success, message, data }` structure
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global error handler for catching and formatting unhandled exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // Only expose Swagger docs when not running in production
  if (!configService.isProduction()) {
    const config = new DocumentBuilder()
      .setTitle('Swagger APIs')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [SuccessBody, ErrorBody],
    });

    SwaggerModule.setup('api/docs', app, document);
  }

  // Enable CORS (customize allowed origins via configService and uncomment below)
  // app.enableCors({
  //   origin: configService.getOrigins(),
  //   credentials: true
  // })

  // Start HTTP server on configured port (falls back to 9000 if none is set)
  await app.listen(configService.getPort() ?? 9000);
}


bootstrap();
