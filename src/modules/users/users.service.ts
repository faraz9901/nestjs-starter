import { Injectable } from "@nestjs/common";
import { BaseService } from "src/common/base.service";
import { UserDto } from "./users.dto";

@Injectable()
export class UsersService extends BaseService {


    constructor() {
        super();
    }


    getUsers() {
        const users: UserDto[] = [
            { id: 1, name: 'John Doe' },
        ];

        this.logger.info('Get all users', { users });
        return users;
    }





}