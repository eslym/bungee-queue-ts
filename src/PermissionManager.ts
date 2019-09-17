import {IPermissionManager} from "./types/IPermissionManager";
import {Client} from "minecraft-protocol";
import {QueueService} from "./QueueService";

export class PermissionManager implements IPermissionManager{
    constructor(){

    }

    addPermission(player: string | Client, permission: string): this {
        return this;
    }

    groupAddMember(group: string, member: string | Client): this {
        return this;
    }

    groupPermissionAdd(group: string, permission: string): this {
        return this;
    }

    groupPermissionRemove(group: string, permission: string): this {
        return this;
    }

    groupRemoveMember(group: string, member: string | Client): this {
        return this;
    }

    removePermission(player: string | Client, permission: string): this {
        return this;
    }

    setQueueService(service: QueueService): this {
        return this;
    }

    hasPermission(client: Client, permission: string): boolean {
        return false;
    }

}