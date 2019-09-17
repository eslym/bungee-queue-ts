"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedClient_1 = require("./WrappedClient");
var ClientWrapper = (function () {
    function ClientWrapper(service) {
        this.wrapped = {};
        this.service = service;
    }
    ClientWrapper.prototype.wrap = function (client) {
        var _this = this;
        if (this.wrapped.hasOwnProperty(client.uuid)) {
            return this.wrapped[client.uuid];
        }
        this.wrapped[client.uuid] = new WrappedClient_1.WrappedClient(client, this.service);
        var cleanup = function () {
            delete _this.wrapped[client.uuid];
        };
        client.on('end', cleanup).on('error', cleanup);
        return this.wrapped[client.uuid];
    };
    return ClientWrapper;
}());
exports.ClientWrapper = ClientWrapper;
//# sourceMappingURL=ClientWrapper.js.map