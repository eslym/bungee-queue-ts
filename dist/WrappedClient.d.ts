/// <reference types="node" />
import { QueueState } from "./enums/QueueState";
import moment from "moment";
import { Client } from "minecraft-protocol";
import { EventEmitter } from "events";
import { QueueService } from "./QueueService";
import JsonText from "./types/JsonText";
export declare class WrappedClient extends EventEmitter {
    protected client: Client;
    protected service: QueueService;
    ready: boolean;
    queueState: QueueState;
    realUUID: string | null;
    prevNumber: number | null;
    lastEnter: moment.Moment;
    constructor(client: Client, service: QueueService);
    getClient(): Client;
    enterGame(): void;
    notifyQueue(queueNumber: number): number;
    sendSystem(message: JsonText): void;
    sendChat(message: JsonText): void;
}
//# sourceMappingURL=WrappedClient.d.ts.map