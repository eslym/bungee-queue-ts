import { Client } from 'minecraft-protocol';
import { QueueService } from "./QueueService";
import { WrappedClient } from "./WrappedClient";
export declare class ClientWrapper {
    private readonly service;
    private wrapped;
    constructor(service: QueueService);
    wrap(client: Client): WrappedClient;
}
//# sourceMappingURL=ClientWrapper.d.ts.map