import {Client} from "minecraft-protocol";
import {QueueService} from "../QueueService";

declare type PlayerType = string | Client;

export interface IPermissionManager{
    setQueueService(service: QueueService): this;

    groupPermissionAdd(group: string, permission: string): this;
    groupPermissionRemove(group: string, permission: string): this;

    groupAddMember(group: string, member: PlayerType): this;
    groupRemoveMember(group: string, member: PlayerType): this;

    addPermission(player: PlayerType, permission: string): this;
    removePermission(player: PlayerType, permission: string): this;

    preparePermissions(client: Client): Promise<void>;

    hasPermission(client: Client, permission: string): boolean;
}