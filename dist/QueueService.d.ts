import * as mc from 'minecraft-protocol';
import { Settings } from "./types/Settings";
import { ClientWrapper } from "./ClientWrapper";
import { CommandDispatcher } from "node-brigadier";
import CommandFactory from "./types/CommandFactory";
export declare class QueueService {
    protected _server?: mc.Server;
    protected wrapper: ClientWrapper;
    protected commandDispatcher: CommandDispatcher<mc.Client>;
    protected commands: CommandFactory[];
    protected usernameIndex: {
        [username: string]: mc.Client;
    };
    protected uuidIndex: {
        [uuid: string]: mc.Client;
    };
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
    settings: Settings;
    constructor(settings: Settings);
    start(): void;
    server(): mc.Server;
    clients(): mc.Client[];
    registerCommand(factory: CommandFactory): this;
    wrap(client: mc.Client): import("./WrappedClient").WrappedClient;
    lookup(idOrName: string): mc.Client | undefined;
    declareCommands(client: mc.Client): void;
    protected isPrioritized(client: mc.Client): boolean;
}
//# sourceMappingURL=QueueService.d.ts.map