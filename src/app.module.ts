import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from './common/logger/logger.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    LoggerModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
