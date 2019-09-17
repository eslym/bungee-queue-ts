import * as mc from 'minecraft-protocol';
import {Settings} from "./types/Settings";
import bungee from "bungeecord-message";
import util from "util";
import {ClientWrapper} from "./ClientWrapper";
import {QueueState} from "./enums/QueueState";
import {CommandDispatcher} from "node-brigadier";
import CommandFactory from "./types/CommandFactory";
import {EventEmitter} from "events";
import {PacketBuilder} from "./PacketBuilder";

export class QueueService{

    protected _server?: mc.Server = undefined;
    protected wrapper: ClientWrapper;
    protected commandDispatcher: CommandDispatcher<mc.Client>;
    protected commands: CommandFactory[] = [];

    protected usernameIndex: {[username: string]: mc.Client} = {};
    protected uuidIndex: {[uuid: string]: mc.Client} = {};

    public queue: {
        priority: {[id: string]: mc.Client};
        normal: {[id: string]: mc.Client};
        entering: {[id: string]: mc.Client};
    } = {
        priority: {},
        normal: {},
        entering: {},
    };

    public settings: Settings;

    constructor(settings: Settings){
        this.wrapper = new ClientWrapper(this);
        this.settings = settings;
        this.commandDispatcher = new CommandDispatcher<mc.Client>();
    }

    public start(){
        this.commands.forEach((factory: CommandFactory)=>{
            this.commandDispatcher.register(factory(this));
        });
        let builder = new PacketBuilder<mc.Client>();
        this._server = mc.createServer({
            host: this.settings.listen.host,
            port: this.settings.listen.port,
            version: this.settings.queue.version,
            maxPlayers: this.settings.queue.maxPlayers,
            'online-mode': false,
            keepAlive: true,
        });
        this._server.on("login", (client: mc.Client) => {
            let packet = builder.buildPacket(this.commandDispatcher, client);
            if(this.settings.queue.maxInQueue > 0 && this.clients().length > this.server().maxPlayers){
                client.end(this.settings.language.queueFull);
                return;
            }
            console.info(util.format("%s joined the queue.", client.username));
            bungee(client);
            let cleanup = ()=>{
                delete this.queue.priority[client.uuid];
                delete this.queue.normal[client.uuid];
                delete this.queue.entering[client.uuid];
                delete this.uuidIndex[client.uuid];
                delete this.usernameIndex[client.username];
                console.info(util.format("%s left the queue.", client.username));
            };
            client.on('end', cleanup).on('error', cleanup);
            let wrapped = this.wrap(client).on('ready', ()=>{
                this.usernameIndex[client.username] = client;
                this.uuidIndex[client.uuid] = client;
                wrapped.queueState = QueueState.PENDING;
                if(this.isPrioritized(client)){
                    this.queue.priority[client.uuid] = client;
                } else {
                    this.queue.normal[client.uuid] = client;
                }
            });
            (client as EventEmitter).on('bungeecord:PlayerCount', (data)=>{
                if((data.count + Object.values(this.queue.entering).length) < this.settings.queue.maxPlayers){
                    let queue = Object.values(this.queue.priority).concat(Object.values(this.queue.normal))
                    if(queue.length > 0){
                        let target = queue[0];
                        delete this.queue.priority[target.uuid];
                        delete this.queue.normal[target.uuid];
                    }
                }
                Object.values(this.queue.entering).forEach((client) => {
                    this.wrap(client).enterGame();
                });
            });
        });

        setInterval(()=>{
            if(Object.values(this.clients()).length > 0){
                bungee(Object.values(this.clients())[0]).playerCount(this.settings.queue.targetServer);
            }
        }, 200);
    }

    public server(): mc.Server{
        if(this._server !== undefined){
            return this._server;
        }
        throw Error('Server not started!');
    }

    public clients(): mc.Client[]{
        return this.server().clients as any as mc.Client[];
    }

    public registerCommand(factory: CommandFactory): this{
        this.commands.push(factory);
        return this;
    }

    public wrap(client: mc.Client){
        return this.wrapper.wrap(client);
    }

    public lookup(idOrName: string): mc.Client | undefined {
        if(this.usernameIndex.hasOwnProperty(idOrName)){
            return this.usernameIndex[idOrName];
        } else if (this.uuidIndex.hasOwnProperty(idOrName)){
            return this.uuidIndex[idOrName];
        }
        return undefined;
    }

    public declareCommands(client: mc.Client){
        let root = this.commandDispatcher.getRoot();
        console.log(root);
    }

    protected isPrioritized(client: mc.Client):boolean{
        return false;
    }
}