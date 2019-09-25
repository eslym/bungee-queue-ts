import * as mc from 'minecraft-protocol';
import {Settings} from "./types/Settings";
import bungee from "bungeecord-message";
import {ClientWrapper} from "./ClientWrapper";
import {QueueState} from "./enums/QueueState";
import {CommandDispatcher} from "node-brigadier";
import CommandFactory from "./types/CommandFactory";
import {EventEmitter} from "events";
import {PacketBuilder} from "./PacketBuilder";
import moment, {Moment} from "moment";
import {IPermissionManager} from "./types/IPermissionManager";
import {IExecutor} from "./types/IExecutor";
import {Interface} from "readline";
import {ILogger} from "./types/ILogger";

const States: typeof mc.States = (mc as any).states as any as typeof mc.States;

export class QueueService implements IExecutor{

    protected server?: mc.Server = undefined;
    protected wrapper: ClientWrapper;
    protected commandDispatcher: CommandDispatcher<IExecutor>;
    protected commands: CommandFactory[] = [];
    protected permissionManager?: IPermissionManager;

    protected usernameIndex: {[username: string]: mc.Client} = {};
    protected uuidIndex: {[uuid: string]: mc.Client} = {};

    protected nextCheck: Moment = moment();
    protected logger?: ILogger;
    protected cli: Interface;

    private checking = false;

    public queue: {
        priority: {[id: string]: mc.Client};
        normal: {[id: string]: mc.Client};
        entering: {[id: string]: mc.Client};
    } = {
        priority: {},
        normal: {},
        entering: {},
    };

    public readonly settings: Settings;

    constructor(settings: Settings, cli: Interface){
        this.wrapper = new ClientWrapper(this);
        this.settings = settings;
        this.commandDispatcher = new CommandDispatcher<IExecutor>();
        this.cli = cli;
    }

    public start(){
        this.getLogger().infoF(
            "Listening on %s:%d",
            this.settings.listen.host,
            this.settings.listen.port
        );
        this.cli.on('SIGINT', this.stop.bind(this));
        this.cli.on('line', (line: string)=>{
            (this.cli as any)._refreshLine();
        });
        this.commands.forEach((factory: CommandFactory)=>{
            this.commandDispatcher.register(factory(this));
        });
        this.server = mc.createServer({
            host: this.settings.listen.host,
            port: this.settings.listen.port,
            version: this.settings.queue.version,
            maxPlayers: this.settings.queue.maxPlayers,
            'online-mode': false,
            keepAlive: true,
        });
        this.server.on("login", (client: mc.Client) => {
            if(this.settings.queue.maxInQueue > 0 && this.getClients().length > this.getServer().maxPlayers){
                client.end(this.settings.language.queueFull);
                return;
            }
            client.write('login', {
                entityId: 1,
                levelType: 'default',
                gameMode: 0,
                dimension: 1,
                difficulty: 0,
                maxPlayers: 1,
                reducedDebugInfo: false
            });
            client.write('position', {
                x: 87,
                y: 87,
                z: 87,
                yaw: 0,
                pitch: 0,
                flags: 0x00
            });
            this.getLogger().infoF("%s joined the queue.", client.username);
            if(client.protocolVersion >= 343){
                // Brigadier starts from protocol 343
                this.getPermissionManager().preparePermissions(client).then(()=>{
                    this.declareCommands(client);
                });
            }
            bungee(client);
            let cleanup = ()=>{
                delete this.queue.priority[client.uuid];
                delete this.queue.normal[client.uuid];
                delete this.queue.entering[client.uuid];
                delete this.uuidIndex[client.uuid];
                delete this.usernameIndex[client.username];
                this.getLogger().infoF("%s left the queue.", client.username);
                this.updateQueue();
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
                    let queue = Object.values(this.queue.priority).concat(Object.values(this.queue.normal));
                    if(queue.length > 0){
                        let target = queue[0];
                        delete this.queue.priority[target.uuid];
                        delete this.queue.normal[target.uuid];
                    }
                }
                Object.values(this.queue.entering).forEach((client) => {
                    this.wrap(client).enterGame();
                });
            }).on('bungeecord:ServerIP', (data)=>{
                mc.ping({
                    host: data.ip,
                    port: data.port,
                }, (err, result) => {
                    this.checking = true;
                    if(err){
                        this.nextCheck = moment().add(this.settings.queue.availabilityDelay);
                        this.getClients().forEach((client)=>{
                            this.wrap(client).sendSystem(this.settings.language.serverDown);
                        });
                    } else {
                        let clients = this.getClients();
                        for(let i = 0; i < clients.length; i++){
                            if(clients[i].state !== States.PLAY){
                                continue;
                            }
                            bungee(clients[i]).playerCount(this.settings.queue.targetServer);
                            return;
                        }
                    }
                    this.checking = false;
                });
            });
            this.updateQueue();
        });

        setInterval(()=>{
            if(moment().isSameOrAfter(this.nextCheck) && this.getClients().length > 0){
                let clients = this.getClients();
                for(let i = 0; i < clients.length; i++){
                    if(clients[i].state !== States.PLAY){
                        continue;
                    }
                    bungee(clients[i]).serverIp(this.settings.queue.targetServer);
                    return;
                }
            }
        }, 200);
    }

    public getServer(): mc.Server{
        if(this.server !== undefined){
            return this.server;
        }
        throw Error('Server not started!');
    }

    public getClients(): mc.Client[]{
        return Object.values(this.getServer().clients);
    }

    public getPermissionManager(): IPermissionManager{
        return this.permissionManager as IPermissionManager;
    }

    public setPermissionManager(permissionManager: IPermissionManager): this{
        this.permissionManager = permissionManager;
        return this;
    }

    public setLogger(logger: ILogger): this{
        this.logger = logger;
        return this;
    }

    public getLogger(): ILogger{
        return this.logger as any as ILogger;
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

    protected declareCommands(client: mc.Client){
        let builder = new PacketBuilder<IExecutor>();
        let packet = builder.buildPacket(this.commandDispatcher, this.wrap(client));
        client.write('declare_commands', packet);
    }

    public getQueue(): mc.Client[]{
        return Object.values(this.queue.priority)
            .concat(Object.values(this.queue.normal));
    }

    public hasPermission(permission: string): boolean {
        return true;
    }

    public sendChat(content: import("./types/JsonText").default): void {

    }

    public sendSystem(content: import("./types/JsonText").default): void {

    }

    public getClient(): mc.Client | null {
        return null;
    }

    protected isPrioritized(client: mc.Client):boolean{
        return false;
    }

    protected updateQueue(){
        let number = 1;
        this.getQueue().forEach((client)=>{
            number = this.wrap(client).notifyQueue(number);
        });
    }

    public async stop(){
        this.cli.pause();
        this.getLogger().infoF("Stopping queue server.");
        process.exit();
    }
}