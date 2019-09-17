import {IPermissionManager} from "./types/IPermissionManager";
import {Client} from "minecraft-protocol";
import {QueueService} from "./QueueService";
import * as fs from "fs";

declare type PlayerType = string | Client;

const herobrine = {
    name: "Herobrine",
    uuid: "f84c6a79-0a4e-45e0-879b-cd49ebd4c4e2"
};

interface Player {
    name: string;
    uuid?: string;
}

interface PlayerPermission extends Player{
    permissions: [];
}

interface GroupInfo {
    permissions: string[];
    members: Player[];
}

interface Groups {
    [name: string]: GroupInfo
}

export class FileBasedPermissionManager implements IPermissionManager{
    protected readonly groupPath: string;
    protected readonly permissionPath: string;
    protected service?: QueueService;

    protected groups: Groups;
    protected permissions: PlayerPermission[];

    protected nameGroupIndex: Map<string, string[]> = new Map();
    protected uuidGroupIndex: Map<string, string[]> = new Map();

    protected nameIndex: Map<string, PlayerPermission> = new Map();
    protected uuidIndex: Map<string, PlayerPermission> = new Map();

    constructor(groupPath: string, permissionPath: string){
        this.groupPath = groupPath;
        this.permissionPath = permissionPath;
        this.groups = this.loadGroups();
        this.permissions = this.loadPermissions();
        this.buildIndices();
    }

    public addPermission(player: PlayerType, permission: string): this {

        return this;
    }

    public groupAddMember(group: string, member: PlayerType): this {
        return this;
    }

    public groupPermissionAdd(group: string, permission: string): this {
        return this;
    }

    public groupPermissionRemove(group: string, permission: string): this {
        return this;
    }

    public groupRemoveMember(group: string, member: PlayerType): this {
        return this;
    }

    public removePermission(player: PlayerType, permission: string): this {
        return this;
    }

    public setQueueService(service: QueueService): this {
        this.service = service;
        return this;
    }

    public hasPermission(client: Client, permission: string): boolean {
        return false;
    }

    protected getService(): QueueService{
        return this.service as QueueService;
    }

    protected loadGroups(): Groups{
        if(fs.existsSync(this.groupPath)){
            return JSON.parse(fs.readFileSync(this.groupPath).toString('utf8'));
        } else {
            let groups = {
                "admin": {
                    permissions: [
                        "queue.list",
                        "queue.prioritize"
                    ],
                    members: [herobrine]
                }
            };
            fs.writeFile(this.groupPath, JSON.stringify(groups, null, 2), ()=>{});
            return groups;
        }
    }

    protected loadPermissions(): PlayerPermission[]{
        if(fs.existsSync(this.permissionPath)){
            return JSON.parse(fs.readFileSync(this.permissionPath).toString('utf8'));
        } else {
            let permissions: PlayerPermission[] = [{
                name: herobrine.name,
                uuid: herobrine.uuid,
                permissions: []
            }];
            fs.writeFile(this.permissionPath, JSON.stringify(permissions, null, 2), ()=>{});
            return permissions;
        }
    }

    protected buildIndices(){
        Object.entries(this.groups).forEach((pairs)=>{
            pairs[1].members.forEach((member)=>{
                if(!this.nameGroupIndex.has(member.name)){
                    this.nameGroupIndex.set(member.name, []);
                }
                (this.nameGroupIndex.get(member.name) as string[]).push(pairs[0]);
                if((member.hasOwnProperty('uuid'))){
                    if(!this.uuidGroupIndex.has(member.uuid as string)){
                        this.uuidGroupIndex.set(member.uuid as string, []);
                    }
                    (this.uuidGroupIndex.get(member.uuid as string) as string[]).push(pairs[0]);
                }
            });
        });
        this.permissions.forEach((player) => {
            this.nameIndex.set(player.name, player);
            if(player.hasOwnProperty('uuid')){
                this.uuidIndex.set(player.uuid as string, player);
            }
        })
    }
}