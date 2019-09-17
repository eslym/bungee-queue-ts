"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mc = __importStar(require("minecraft-protocol"));
var bungeecord_message_1 = __importDefault(require("bungeecord-message"));
var util_1 = __importDefault(require("util"));
var ClientWrapper_1 = require("./ClientWrapper");
var QueueState_1 = require("./enums/QueueState");
var node_brigadier_1 = require("node-brigadier");
var PacketBuilder_1 = require("./PacketBuilder");
var QueueService = (function () {
    function QueueService(settings) {
        this._server = undefined;
        this.commands = [];
        this.usernameIndex = {};
        this.uuidIndex = {};
        this.queue = {
            priority: {},
            normal: {},
            entering: {},
        };
        this.wrapper = new ClientWrapper_1.ClientWrapper(this);
        this.settings = settings;
        this.commandDispatcher = new node_brigadier_1.CommandDispatcher();
    }
    QueueService.prototype.start = function () {
        var _this = this;
        this.commands.forEach(function (factory) {
            _this.commandDispatcher.register(factory(_this));
        });
        var builder = new PacketBuilder_1.PacketBuilder();
        this._server = mc.createServer({
            host: this.settings.listen.host,
            port: this.settings.listen.port,
            version: this.settings.queue.version,
            maxPlayers: this.settings.queue.maxPlayers,
            'online-mode': false,
            keepAlive: true,
        });
        this._server.on("login", function (client) {
            var packet = builder.buildPacket(_this.commandDispatcher, client);
            if (_this.settings.queue.maxInQueue > 0 && _this.clients().length > _this.server().maxPlayers) {
                client.end(_this.settings.language.queueFull);
                return;
            }
            console.info(util_1.default.format("%s joined the queue.", client.username));
            bungeecord_message_1.default(client);
            var cleanup = function () {
                delete _this.queue.priority[client.uuid];
                delete _this.queue.normal[client.uuid];
                delete _this.queue.entering[client.uuid];
                delete _this.uuidIndex[client.uuid];
                delete _this.usernameIndex[client.username];
                console.info(util_1.default.format("%s left the queue.", client.username));
            };
            client.on('end', cleanup).on('error', cleanup);
            var wrapped = _this.wrap(client).on('ready', function () {
                _this.usernameIndex[client.username] = client;
                _this.uuidIndex[client.uuid] = client;
                wrapped.queueState = QueueState_1.QueueState.PENDING;
                if (_this.isPrioritized(client)) {
                    _this.queue.priority[client.uuid] = client;
                }
                else {
                    _this.queue.normal[client.uuid] = client;
                }
            });
            client.on('bungeecord:PlayerCount', function (data) {
                if ((data.count + Object.values(_this.queue.entering).length) < _this.settings.queue.maxPlayers) {
                    var queue = Object.values(_this.queue.priority).concat(Object.values(_this.queue.normal));
                    if (queue.length > 0) {
                        var target = queue[0];
                        delete _this.queue.priority[target.uuid];
                        delete _this.queue.normal[target.uuid];
                    }
                }
                Object.values(_this.queue.entering).forEach(function (client) {
                    _this.wrap(client).enterGame();
                });
            });
        });
        setInterval(function () {
            if (Object.values(_this.clients()).length > 0) {
                bungeecord_message_1.default(Object.values(_this.clients())[0]).playerCount(_this.settings.queue.targetServer);
            }
        }, 200);
    };
    QueueService.prototype.server = function () {
        if (this._server !== undefined) {
            return this._server;
        }
        throw Error('Server not started!');
    };
    QueueService.prototype.clients = function () {
        return this.server().clients;
    };
    QueueService.prototype.registerCommand = function (factory) {
        this.commands.push(factory);
        return this;
    };
    QueueService.prototype.wrap = function (client) {
        return this.wrapper.wrap(client);
    };
    QueueService.prototype.lookup = function (idOrName) {
        if (this.usernameIndex.hasOwnProperty(idOrName)) {
            return this.usernameIndex[idOrName];
        }
        else if (this.uuidIndex.hasOwnProperty(idOrName)) {
            return this.uuidIndex[idOrName];
        }
        return undefined;
    };
    QueueService.prototype.declareCommands = function (client) {
        var root = this.commandDispatcher.getRoot();
        console.log(root);
    };
    QueueService.prototype.isPrioritized = function (client) {
        return false;
    };
    return QueueService;
}());
exports.QueueService = QueueService;
//# sourceMappingURL=QueueService.js.map