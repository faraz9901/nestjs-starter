import { Event } from "src/common/base.service";

export class UserUpdatedEvent extends Event {
    constructor(public readonly userId: string) {
        super(UserUpdatedEvent.name);
    }
}