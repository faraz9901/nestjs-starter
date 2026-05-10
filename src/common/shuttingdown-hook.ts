import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { AppLogger, winstonLogger } from "./logger.service";

@Injectable()
export class ShuttingDownHook implements OnApplicationShutdown {
    private readonly logger = new AppLogger(winstonLogger, "ShuttingDownHook");
    async onApplicationShutdown(signal?: string) {
        this.logger.info(`Shutting down: ${signal}`);
    }
}