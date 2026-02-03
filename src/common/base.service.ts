import { OnModuleInit } from '@nestjs/common';
import { AppLogger } from './logger.service';


export abstract class BaseService implements OnModuleInit {
    // Automatically create logger with the class name as context
    protected readonly logger = new AppLogger(this.constructor.name);

    onModuleInit() {
        this.logger.info(`${this.constructor.name} initialized`, { color: 'reset' });
    }
}
