import { Inject, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppLogger, winstonLogger } from './logger.service';

// The sole purpose of this Event class is for type safety and can be removed
export class Event {
    eventName: string

    constructor(eventName?: string) {
        this.eventName = eventName ?? Event.name;
    }
}


export abstract class BaseService implements OnModuleInit {
    protected readonly logger: AppLogger;

    @Inject(EventEmitter2)
    protected readonly eventEmitter!: EventEmitter2;

    constructor() {
        this.logger = new AppLogger(winstonLogger, this.constructor.name);
    }

    protected emit(event: Event) {
        this.eventEmitter.emit(event.eventName, event);
    }

    protected emitAsync(event: Event) {
        return this.eventEmitter.emitAsync(event.eventName, event);
    }

    onModuleInit() {
        this.logger.info(`${this.constructor.name} initialized`);
    }
}