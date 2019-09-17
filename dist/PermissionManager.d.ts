import { IPermissionManager } from "./types/IPermissionManager";
import { Client } from "minecraft-protocol";
import { QueueService } from "./QueueService";
export declare class PermissionManager implements IPermissionManager {
    constructor();
    addPermission(player: string | Client, permission: string): this;
    groupAddMember(group: string, member: string | Client): this;
    groupPermissionAdd(group: string, permission: string): this;
    groupPermissionRemove(group: string, permission: string): this;
    groupRemoveMember(group: string, member: string | Client): this;
    removePermission(player: string | Client, permission: string): this;
    setQueueService(service: QueueService): this;
    hasPermission(client: Client, permission: string): boolean;
}
//# sourceMappingURL=PermissionManager.d.ts.map