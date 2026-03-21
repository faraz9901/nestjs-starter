import type { Logger as WinstonLogger } from 'winston';
import * as winston from 'winston';
// nest-winston.logger.ts
import { LoggerService } from '@nestjs/common';
import { getRequestId } from './request-logging/request.context';

export const winstonLogger: WinstonLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((payload) => {

            const { level, message, context, timestamp } = payload;

            const ctx = `[${context}]`

            return `[${timestamp}] ${level.toUpperCase()} ${ctx} ${message}`;
        }),
    ),
    transports: [new winston.transports.Console()],
});



//This is for NestJS Default Logging 
export class NestWinstonLogger implements LoggerService {
    constructor(private readonly logger: WinstonLogger) { }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { context, trace });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }
}


// A helper class for logging in base service
export class AppLogger {
    constructor(
        private readonly logger: WinstonLogger,
        private readonly context: string,
    ) { }

    private log(level: string, message: string, meta?: any) {
        const requestId = getRequestId();

        const reqPart = requestId ? `[${requestId}]` : '';

        this.logger.log(level, `${reqPart} ${message} `, {
            context: this.context,
            ...meta,
        });
    }

    info(message: string, meta?: Record<string, any>) {
        this.log('info', message);

        if (meta) {
            this.log('debug', JSON.stringify(meta));
        }
    }

    warn(message: string, meta?: any) {
        this.log('warn', message);

        if (meta) {
            this.log('debug', JSON.stringify(meta));
        }
    }

    error(message: string, meta?: any) {
        this.log('error', message);

        if (meta) {
            this.log('debug', JSON.stringify(meta));
        }
    }
}