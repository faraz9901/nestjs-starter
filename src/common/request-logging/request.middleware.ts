// request.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { winstonLogger } from '../logger.service';
import { als } from './request.context';


@Injectable()
export class RequestMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = randomUUID().slice(0, 6);
        const start = Date.now();

        const store = new Map();
        store.set('requestId', requestId);

        als.run(store, () => {
            // 👉 incoming log
            winstonLogger.info(`[${requestId}] Incoming Request ${req.method} ${req.originalUrl}`, {
                context: 'HTTP',
            });

            res.on('finish', () => {
                const duration = Date.now() - start;

                // 👉 outgoing log
                winstonLogger.info(
                    `[${requestId}] Request Completed ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
                    { context: 'HTTP' },
                );
            });

            next();
        });
    }
}