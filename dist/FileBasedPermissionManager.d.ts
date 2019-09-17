import { IPermissionManager } from "./types/IPermissionManager";
import { Client } from "minecraft-protocol";
import { QueueService } from "./QueueService";
declare type PlayerType = string | Client;
interface Player {
    name: string;
    uuid?: string;
}
interface PlayerPermission extends Player {
    permissions: [];
}
interface GroupInfo {
    permissions: string[];
    members: Player[];
}
interface Groups {
    [name: string]: GroupInfo;
}
export declare class FileBasedPermissionManager implements IPermissionManager {
    protected readonly groupPath: string;
    protected readonly permissionPath: string;
    protected service?: QueueService;
    protected groups: Groups;
    protected permissions: PlayerPermission[];
    protected nameGroupIndex: Map<string, string[]>;
    protected uuidGroupIndex: Map<string, string[]>;
    protected nameIndex: Map<string, PlayerPermission>;
    protected uuidIndex: Map<string, PlayerPermission>;
    constructor(groupPath: string, permissionPath: string);
    addPermission(player: PlayerType, permission: string): this;
    groupAddMember(group: string, member: PlayerType): this;
    groupPermissionAdd(group: string, permission: string): this;
    groupPermissionRemove(group: string, permission: string): this;
    groupRemoveMember(group: string, member: PlayerType): this;
    removePermission(player: PlayerType, permission: string): this;
    setQueueService(service: QueueService): this;
    hasPermission(client: Client, permission: string): boolean;
    protected getService(): QueueService;
    protected loadGroups(): Groups;
    protected loadPermissions(): PlayerPermission[];
    protected buildIndices(): void;
}
export {};
//# sourceMappingURL=FileBasedPermissionManager.d.ts.map