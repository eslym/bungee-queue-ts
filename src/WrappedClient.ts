import {QueueState} from "./enums/QueueState";
import moment from "moment";
import {Client} from "minecraft-protocol";
import bungee from "bungeecord-message";
import {EventEmitter} from "events";
import util from "util";
import {QueueService} from "./QueueService";
import JsonText from "./types/JsonText";

export class WrappedClient extends EventEmitter{
    protected client: Client;
    protected service: QueueService;

    public ready: boolean = false;
    public queueState: QueueState = QueueState.NONE;
    public realUUID: string|null = null;
    public prevNumber: number|null = null;
    public lastEnter: moment.Moment;

    public constructor(client: Client, service: QueueService) {
        super();
        this.client = client;
        this.service = service;
        (client as any).wrappedClient = this;
        bungee(client).uuid();
        this.lastEnter = moment(0);
        (client as EventEmitter).once("bungeecord:UUID", (data) => {
            this.realUUID = data.uuid;
            this.ready = true;
            this.emit('ready');
        });
    }

    public getClient(): Client{
        return this.client;
    }

    public enterGame(){
        if(this.lastEnter.clone().add({s: 5}).isAfter(moment())){
            return;
        }
        bungee(this.client).connect(this.service.settings.queue.targetServer);
        this.queueState = QueueState.ENTERING;
        this.lastEnter = moment();
    }

    public notifyQueue(queueNumber: number): number{
        if(this.queueState === QueueState.PENDING){
            if(queueNumber <= 1){
                return 1;
            }
            this.queueState = QueueState.QUEUED;
            this.client.write('chat', {
                message: JSON.stringify(this.service.settings.language.serverFull),
                position: 1,
            });
        }
        if(this.prevNumber !== null && this.prevNumber > queueNumber){
            this.client.write('chat', {
                position: 1,
                message: JSON.stringify(util.format(this.service.settings.language.queueUpdate, queueNumber))
            });
            this.client.write('experience', {
                experienceBar: 1,
                level: queueNumber,
                totalExperience: 0,
            });
            this.prevNumber = queueNumber;
        }
        if(this.prevNumber === null){
            this.prevNumber = queueNumber;
        }
        return ++queueNumber;
    }

    public sendSystem(message: JsonText){
        this.client.write('chat', {
            position: 1,
            message: JSON.stringify(message)
        });
    }

    public sendChat(message: JsonText){
        this.client.write('chat', {
            position: 0,
            message: JSON.stringify(message)
        });
    }
}