import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Event Emitter
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      global: true,
    }),

    UsersModule,

  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
