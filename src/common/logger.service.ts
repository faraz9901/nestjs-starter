import { Injectable, Logger } from '@nestjs/common';
import { configService } from 'src/config/config.service';

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

export type LogColors = keyof typeof colors;

export interface Meta {
    color?: LogColors;
    [key: string]: any;
}


@Injectable()
export class AppLogger extends Logger {
    constructor(readonly context?: string) {
        super(context ?? AppLogger.name);
    }

    info(message: string, meta?: Meta) {
        this.output('INFO', message, meta);
    }

    debug(data: any) {
        this.output('DEBUG', JSON.stringify(data, null, 2));
    }

    warn(message: string,) {
        this.output('WARN', message);
    }

    error(err: any) {
        this.output('ERROR', JSON.stringify(err, null, 2));
    }

    private output(
        level: string,
        message: string,
        meta?: Meta,
    ) {

        const color: LogColors = meta?.color ?? 'reset';
        const formattedMessage = configService.isProduction() ? message : `${colors[color]}${message}`;


        switch (level) {
            case 'DEBUG':
                super.debug(formattedMessage);
                break;
            case 'WARN':
                super.warn(formattedMessage);
                break;
            case 'ERROR':
                super.error(formattedMessage);
                break;
            default:
                super.log(formattedMessage);
        }


        const { color: _, ...rest } = meta ?? {}

        if (Object.keys(rest).length > 0) {
            super.debug(JSON.stringify(rest, null, 2));
        }
    }
}
