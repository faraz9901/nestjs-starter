// logger.service.ts
import { Injectable, Logger } from '@nestjs/common';

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
}


interface Meta {
    color?: keyof typeof colors;
    [key: string]: any;
}


@Injectable()
export class AppLogger extends Logger {
    step(step: string, context?: string, meta?: Meta) {
        const color = meta?.color ?? 'reset';

        const coloredStep = `${colors[color]} ${step}`;

        this.log(coloredStep, context);

        if (meta) {
            const { color: _, ...rest } = meta;

            if (Object.keys(rest).length > 0) {
                this.debug(
                    `${colors.gray}${JSON.stringify(rest, null, 2)}${colors.reset}`,
                    context
                );
            }
        }
    }
}
