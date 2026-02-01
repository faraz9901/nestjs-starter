import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/errors';
import { ApiResponseDto } from './common/swagger';
import { configService } from './config/config.service';
import { ResponseInterceptor } from './interceptors/responses.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  // For streamline responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global error handler
  app.useGlobalFilters(new AllExceptionsFilter());

  if (!configService.isProduction()) {
    const config = new DocumentBuilder()
      .setTitle('Swagger APIs')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ApiResponseDto],
    });

    SwaggerModule.setup('api/docs', app, document);
  }

  // Enable CORS
  // app.enableCors({
  //   origin: configService.getOrigins(),
  //   credentials: true
  // })

  await app.listen(configService.getPort() ?? 9000);
}


bootstrap();
