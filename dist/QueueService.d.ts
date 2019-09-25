/// <reference types="node" />
import * as mc from 'minecraft-protocol';
import { Settings } from "./types/Settings";
import { ClientWrapper } from "./ClientWrapper";
import { CommandDispatcher } from "node-brigadier";
import CommandFactory from "./types/CommandFactory";
import { Moment } from "moment";
import { IPermissionManager } from "./types/IPermissionManager";
import { IExecutor } from "./types/IExecutor";
import { Interface } from "readline";
import { ILogger } from "./types/ILogger";
export declare class QueueService implements IExecutor {
    protected server?: mc.Server;
    protected wrapper: ClientWrapper;
    protected commandDispatcher: CommandDispatcher<IExecutor>;
    protected commands: CommandFactory[];
    protected permissionManager?: IPermissionManager;
    protected usernameIndex: {
        [username: string]: mc.Client;
    };
    protected uuidIndex: {
        [uuid: string]: mc.Client;
    };
    protected nextCheck: Moment;
    protected logger?: ILogger;
    protected cli: Interface;
    private checking;
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
    constructor(settings: Settings, cli: Interface);
    start(): void;
    getServer(): mc.Server;
    getClients(): mc.Client[];
    getPermissionManager(): IPermissionManager;
    setPermissionManager(permissionManager: IPermissionManager): this;
    setLogger(logger: ILogger): this;
    getLogger(): ILogger;
    registerCommand(factory: CommandFactory): this;
    wrap(client: mc.Client): import("./WrappedClient").WrappedClient;
    lookup(idOrName: string): mc.Client | undefined;
    protected declareCommands(client: mc.Client): void;
    getQueue(): mc.Client[];
    hasPermission(permission: string): boolean;
    sendChat(content: import("./types/JsonText").default): void;
    sendSystem(content: import("./types/JsonText").default): void;
    getClient(): mc.Client | null;
    protected isPrioritized(client: mc.Client): boolean;
    protected updateQueue(): void;
    stop(): Promise<void>;
}
//# sourceMappingURL=QueueService.d.ts.map