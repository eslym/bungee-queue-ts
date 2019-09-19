import {Client} from "minecraft-protocol";
import {QueueService} from "../QueueService";

export interface IPermissionManager{
    setQueueService(service: QueueService): this;

    groupPermissionAdd(group: string, permission: string): this;
    groupPermissionRemove(group: string, permission: string): this;

    groupAddMember(group: string, member: Client): this;
    groupAddMember(group: string, member: string): this;

    groupRemoveMember(group: string, member: Client): this;
    groupRemoveMember(group: string, member: string): this;

    addPermission(client: Client, permission: string): this;
    addPermission(player: string, permission: string): this;

    removePermission(client: Client, permission: string): this;
    removePermission(player: string, permission: string): this;

    preparePermissions(client: Client): Promise<void>;

    hasPermission(client: Client, permission: string): boolean;
}