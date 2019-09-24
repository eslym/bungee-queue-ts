"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var QueueState_1 = require("./enums/QueueState");
var moment_1 = __importDefault(require("moment"));
var bungeecord_message_1 = __importDefault(require("bungeecord-message"));
var events_1 = require("events");
var util_1 = __importDefault(require("util"));
var WrappedClient = (function (_super) {
    __extends(WrappedClient, _super);
    function WrappedClient(client, service) {
        var _this = _super.call(this) || this;
        _this.ready = false;
        _this.queueState = QueueState_1.QueueState.NONE;
        _this.realUUID = null;
        _this.prevNumber = null;
        _this.client = client;
        _this.service = service;
        client.wrappedClient = _this;
        bungeecord_message_1.default(client).uuid();
        _this.lastEnter = moment_1.default(0);
        client.once("bungeecord:UUID", function (data) {
            _this.realUUID = data.uuid;
            _this.ready = true;
            _this.emit('ready');
        });
        return _this;
    }
    WrappedClient.prototype.getClient = function () {
        return this.client;
    };
    WrappedClient.prototype.enterGame = function () {
        if (this.lastEnter.clone().add({ s: 5 }).isAfter(moment_1.default())) {
            return;
        }
        bungeecord_message_1.default(this.client).connect(this.service.settings.queue.targetServer);
        this.queueState = QueueState_1.QueueState.ENTERING;
        this.lastEnter = moment_1.default();
    };
    WrappedClient.prototype.notifyQueue = function (queueNumber) {
        if (this.queueState === QueueState_1.QueueState.PENDING) {
            if (queueNumber <= 1) {
                return 1;
            }
            this.queueState = QueueState_1.QueueState.QUEUED;
            this.client.write('chat', {
                message: JSON.stringify(this.service.settings.language.serverFull),
                position: 1,
            });
        }
        if (this.prevNumber !== null && this.prevNumber > queueNumber) {
            this.client.write('chat', {
                position: 1,
                message: JSON.stringify(util_1.default.format(this.service.settings.language.queueUpdate, queueNumber))
            });
            this.client.write('experience', {
                experienceBar: 1,
                level: queueNumber,
                totalExperience: 0,
            });
            this.prevNumber = queueNumber;
        }
        if (this.prevNumber === null) {
            this.prevNumber = queueNumber;
        }
        return ++queueNumber;
    };
    WrappedClient.prototype.sendSystem = function (message) {
        this.client.write('chat', {
            position: 1,
            message: JSON.stringify(message)
        });
    };
    WrappedClient.prototype.sendChat = function (message) {
        this.client.write('chat', {
            position: 0,
            message: JSON.stringify(message)
        });
    };
    WrappedClient.prototype.hasPermission = function (permission) {
        return false;
    };
    return WrappedClient;
}(events_1.EventEmitter));
exports.WrappedClient = WrappedClient;
//# sourceMappingURL=WrappedClient.js.map