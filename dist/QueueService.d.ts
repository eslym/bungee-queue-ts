import * as mc from 'minecraft-protocol';
import { Settings } from "./types/Settings";
import { ClientWrapper } from "./ClientWrapper";
import { CommandDispatcher } from "node-brigadier";
import CommandFactory from "./types/CommandFactory";
import { Moment } from "moment";
import { IPermissionManager } from "./types/IPermissionManager";
export declare class QueueService {
    protected server?: mc.Server;
    protected wrapper: ClientWrapper;
    protected commandDispatcher: CommandDispatcher<mc.Client>;
    protected commands: CommandFactory[];
    protected permissionManager?: IPermissionManager;
    protected usernameIndex: {
        [username: string]: mc.Client;
    };
    protected uuidIndex: {
        [uuid: string]: mc.Client;
    };
    protected nextCheck: Moment;
    queue: {
        priority: {
            [id: string]: mc.Client;
        };
        normal: {
            [id: string]: mc.Client;
        };
        entering: {
            [id: string]: mc.Client;
        };
    };
    readonly settings: Settings;
    constructor(settings: Settings);
    start(): void;
    getServer(): mc.Server;
    getClients(): mc.Client[];
    getPermissionManager(): IPermissionManager;
    setPermissionManager(permissionManager: IPermissionManager): this;
    registerCommand(factory: CommandFactory): this;
    wrap(client: mc.Client): import("./WrappedClient").WrappedClient;
    lookup(idOrName: string): mc.Client | undefined;
    protected declareCommands(client: mc.Client): void;
    getQueue(): mc.Client[];
    protected isPrioritized(client: mc.Client): boolean;
    protected updateQueue(): void;
}
//# sourceMappingURL=QueueService.d.ts.map