"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var ClientWrapper_1 = require("./ClientWrapper");
var QueueState_1 = require("./enums/QueueState");
var node_brigadier_1 = require("node-brigadier");
var PacketBuilder_1 = require("./PacketBuilder");
var moment_1 = __importDefault(require("moment"));
var States = mc.states;
var QueueService = (function () {
    function QueueService(settings, cli) {
        this.server = undefined;
        this.commands = [];
        this.usernameIndex = {};
        this.uuidIndex = {};
        this.nextCheck = moment_1.default();
        this.checking = false;
        this.queue = {
            priority: {},
            normal: {},
            entering: {},
        };
        this.wrapper = new ClientWrapper_1.ClientWrapper(this);
        this.settings = settings;
        this.commandDispatcher = new node_brigadier_1.CommandDispatcher();
        this.cli = cli;
    }
    QueueService.prototype.start = function () {
        var _this = this;
        this.getLogger().infoF("Listening on %s:%d", this.settings.listen.host, this.settings.listen.port);
        this.cli.on('SIGINT', this.stop.bind(this));
        this.cli.on('line', function (line) {
            _this.cli._refreshLine();
        });
        this.commands.forEach(function (factory) {
            _this.commandDispatcher.register(factory(_this));
        });
        this.server = mc.createServer({
            host: this.settings.listen.host,
            port: this.settings.listen.port,
            version: this.settings.queue.version,
            maxPlayers: this.settings.queue.maxPlayers,
            'online-mode': false,
            keepAlive: true,
        });
        this.server.on("login", function (client) {
            if (_this.settings.queue.maxInQueue > 0 && _this.getClients().length > _this.getServer().maxPlayers) {
                client.end(_this.settings.language.queueFull);
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
            _this.getLogger().infoF("%s joined the queue.", client.username);
            if (client.protocolVersion >= 343) {
                _this.getPermissionManager().preparePermissions(client).then(function () {
                    _this.declareCommands(client);
                });
            }
            bungeecord_message_1.default(client);
            var cleanup = function () {
                delete _this.queue.priority[client.uuid];
                delete _this.queue.normal[client.uuid];
                delete _this.queue.entering[client.uuid];
                delete _this.uuidIndex[client.uuid];
                delete _this.usernameIndex[client.username];
                _this.getLogger().infoF("%s left the queue.", client.username);
                _this.updateQueue();
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
            }).on('bungeecord:ServerIP', function (data) {
                mc.ping({
                    host: data.ip,
                    port: data.port,
                }, function (err, result) {
                    _this.checking = true;
                    if (err) {
                        _this.nextCheck = moment_1.default().add(_this.settings.queue.availabilityDelay);
                        _this.getClients().forEach(function (client) {
                            _this.wrap(client).sendSystem(_this.settings.language.serverDown);
                        });
                    }
                    else {
                        var clients = _this.getClients();
                        for (var i = 0; i < clients.length; i++) {
                            if (clients[i].state !== States.PLAY) {
                                continue;
                            }
                            bungeecord_message_1.default(clients[i]).playerCount(_this.settings.queue.targetServer);
                            return;
                        }
                    }
                    _this.checking = false;
                });
            });
            _this.updateQueue();
        });
        setInterval(function () {
            if (moment_1.default().isSameOrAfter(_this.nextCheck) && _this.getClients().length > 0) {
                var clients = _this.getClients();
                for (var i = 0; i < clients.length; i++) {
                    if (clients[i].state !== States.PLAY) {
                        continue;
                    }
                    bungeecord_message_1.default(clients[i]).serverIp(_this.settings.queue.targetServer);
                    return;
                }
            }
        }, 200);
    };
    QueueService.prototype.getServer = function () {
        if (this.server !== undefined) {
            return this.server;
        }
        throw Error('Server not started!');
    };
    QueueService.prototype.getClients = function () {
        return Object.values(this.getServer().clients);
    };
    QueueService.prototype.getPermissionManager = function () {
        return this.permissionManager;
    };
    QueueService.prototype.setPermissionManager = function (permissionManager) {
        this.permissionManager = permissionManager;
        return this;
    };
    QueueService.prototype.setLogger = function (logger) {
        this.logger = logger;
        return this;
    };
    QueueService.prototype.getLogger = function () {
        return this.logger;
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
        var builder = new PacketBuilder_1.PacketBuilder();
        var packet = builder.buildPacket(this.commandDispatcher, this.wrap(client));
        client.write('declare_commands', packet);
    };
    QueueService.prototype.getQueue = function () {
        return Object.values(this.queue.priority)
            .concat(Object.values(this.queue.normal));
    };
    QueueService.prototype.hasPermission = function (permission) {
        return true;
    };
    QueueService.prototype.sendChat = function (content) {
    };
    QueueService.prototype.sendSystem = function (content) {
    };
    QueueService.prototype.getClient = function () {
        return null;
    };
    QueueService.prototype.isPrioritized = function (client) {
        return false;
    };
    QueueService.prototype.updateQueue = function () {
        var _this = this;
        var number = 1;
        this.getQueue().forEach(function (client) {
            number = _this.wrap(client).notifyQueue(number);
        });
    };
    QueueService.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.cli.pause();
                this.getLogger().infoF("Stopping queue server.");
                process.exit();
                return [2];
            });
        });
    };
    return QueueService;
}());
exports.QueueService = QueueService;
//# sourceMappingURL=QueueService.js.map