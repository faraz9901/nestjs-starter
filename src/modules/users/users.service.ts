import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { BaseService } from "src/common/base.service";
import { UserUpdatedEvent } from "src/events/UserUpdatedEvent";
import { UserDto } from "./users.dto";

@Injectable()
export class UsersService extends BaseService {

    constructor() {
        super();
    }

    getUsers() {
        // the password will be stripped from the response
        const users: UserDto[] = [
            { id: 1, name: 'John Doe', password: "StrongPassword" },
        ];

        this.logger.info('Get all users', { users });
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