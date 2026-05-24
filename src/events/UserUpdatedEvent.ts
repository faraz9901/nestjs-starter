import { Event } from "@/common/base.service";

export class UserUpdatedEvent extends Event {
    constructor(public readonly userId: string) {
        super(UserUpdatedEvent.name);
    }
}