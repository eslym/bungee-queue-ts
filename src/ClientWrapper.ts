import {Client} from 'minecraft-protocol';
import {QueueService} from "./QueueService";
import {WrappedClient} from "./WrappedClient";

export class ClientWrapper{
    private readonly service: QueueService;
    private wrapped: {[id: string]: WrappedClient} = {};

    public constructor(service: QueueService) {
        this.service = service;
    }

    public wrap(client: Client): WrappedClient{
        if(this.wrapped.hasOwnProperty(client.uuid)){
            return this.wrapped[client.uuid];
        }
        this.wrapped[client.uuid] = new WrappedClient(client, this.service);
        let cleanup = ()=>{
            delete this.wrapped[client.uuid];
        };
        client.on('end', cleanup).on('error', cleanup);
        return this.wrapped[client.uuid];
    }
}
