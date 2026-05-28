import { BaseService } from "@/common/base.service";
import { UserUpdatedEvent } from "@/events/UserUpdatedEvent";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SwrCacheService } from "../cache/services/cache.service";
import { UserDto } from "./users.dto";

@Injectable()
export class UsersService extends BaseService {

    constructor(
        private readonly cacheService: SwrCacheService
    ) {
        super();
    }

    async getUsers() {

        const cache = await this.cacheService.get('users');

        if (cache.type === "hit") {
            this.logger.info('Get all users from cache');
            return cache.data
        }

        // the password will be stripped from the response
        const users: UserDto[] = [
            { id: 1, name: 'John Doe', password: "StrongPassword" },
        ];

        await this.cacheService.set('users', users, 1 * 60 * 1000, 2 * 60 * 1000);

        return users;
    }

    createUser(user: UserDto) {
        this.logger.info('Created user', { user });
    }

    updateUser(userId: string) {
        this.logger.info('Update user', { userId });

        this.emitAsync(new UserUpdatedEvent(userId));
    }



    @OnEvent(UserUpdatedEvent.name)
    handleUserUpdatedEvent(event: UserUpdatedEvent) {
        this.logger.info('User updated', { event });
    }
}