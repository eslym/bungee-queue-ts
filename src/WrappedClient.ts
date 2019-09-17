import {QueueState} from "./enums/QueueState";
import moment from "moment";
import {Client} from "minecraft-protocol";
import bungee from "bungeecord-message";
import {EventEmitter} from "events";
import util from "util";
import {QueueService} from "./QueueService";
import JsonText from "./types/JsonText";

export class WrappedClient extends EventEmitter{
    protected _client: Client;
    protected service: QueueService;

    public ready: boolean = false;
    public queueState: QueueState = QueueState.NONE;
    public realUUID: string|null = null;
    public prevNumber: number|null = null;
    public lastEnter: moment.Moment;

    public constructor(client: Client, service: QueueService) {
        super();
        this._client = client;
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

    public client(): Client{
        return this._client;
    }

    public enterGame(){
        if(this.lastEnter.clone().add({s: 5}).isAfter(moment())){
            return;
        }
        bungee(this._client).connect(this.service.settings.queue.targetServer);
        this.queueState = QueueState.ENTERING;
        this.lastEnter = moment();
    }

    public notifyQueue(queueNumber: number): number{
        if(this.queueState === QueueState.PENDING){
            if(queueNumber <= 1){
                return 1;
            }
            this.queueState = QueueState.QUEUED;
            this._client.write('login', {
                entityId: 1,
                levelType: 'default',
                gameMode: 0,
                dimension: 1,
                difficulty: 0,
                maxPlayers: 1,
                reducedDebugInfo: false
            });
            this._client.write('position', {
                x: 87,
                y: 87,
                z: 87,
                yaw: 0,
                pitch: 0,
                flags: 0x00
            });
            this._client.write('chat', {
                message: JSON.stringify(this.service.settings.language.serverFull),
                position: 1,
            });
        }
        if(this.prevNumber !== null && this.prevNumber > queueNumber){
            this._client.write('chat', {
                position: 1,
                message: JSON.stringify(util.format(this.service.settings.language.queueUpdate, queueNumber))
            });
            this._client.write('experience', {
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
        this._client.write('chat', {
            position: 1,
            message: JSON.stringify(message)
        });
    }

    public sendChat(message: JsonText){
        this._client.write('chat', {
            position: 0,
            message: JSON.stringify(message)
        });
    }

    public hasPermission(permission: string): boolean{
        return true;
    }
}