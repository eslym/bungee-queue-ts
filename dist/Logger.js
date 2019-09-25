"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ansi_escape_sequences_1 = __importDefault(require("ansi-escape-sequences"));
var moment_1 = __importDefault(require("moment"));
var util_1 = __importDefault(require("util"));
var console_1 = require("console");
var Logger = (function () {
    function Logger(cli) {
        this.cli = cli;
        this.output = cli.output;
        this.console = new console_1.Console(this.output, this.output);
    }
    Logger.prototype.log = function (param) {
        var _a;
        var extras = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extras[_i - 1] = arguments[_i];
        }
        this.output.write(ansi_escape_sequences_1.default.erase.inLine(2) + ansi_escape_sequences_1.default.style.reset + "[" + moment_1.default().toISOString() + "][LOG]");
        (_a = this.console).log.apply(_a, __spreadArrays([param], extras));
        this.cli._refreshLine();
    };
    Logger.prototype.info = function (param) {
        var _a;
        var extras = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extras[_i - 1] = arguments[_i];
        }
        this.output.write(ansi_escape_sequences_1.default.erase.inLine(2) + ansi_escape_sequences_1.default.style.reset + "[" + moment_1.default().toISOString() + "][INFO]");
        (_a = this.console).info.apply(_a, __spreadArrays([param], extras));
        this.cli._refreshLine();
    };
    Logger.prototype.warn = function (param) {
        var _a;
        var extras = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extras[_i - 1] = arguments[_i];
        }
        this.output.write(ansi_escape_sequences_1.default.erase.inLine(2) + ansi_escape_sequences_1.default.style.yellow + "[" + moment_1.default().toISOString() + "][WARN]");
        (_a = this.console).warn.apply(_a, __spreadArrays([param], extras));
        this.cli._refreshLine();
    };
    Logger.prototype.error = function (param) {
        var _a;
        var extras = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extras[_i - 1] = arguments[_i];
        }
        this.output.write(ansi_escape_sequences_1.default.erase.inLine(2) + ansi_escape_sequences_1.default.style.red + "[" + moment_1.default().toISOString() + "][ERROR]");
        (_a = this.console).error.apply(_a, __spreadArrays([param], extras));
        this.cli._refreshLine();
    };
    Logger.prototype.logf = function (format) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.log(util_1.default.format.apply(util_1.default, __spreadArrays([format], params)));
    };
    Logger.prototype.infof = function (format) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.info(util_1.default.format.apply(util_1.default, __spreadArrays([format], params)));
    };
    Logger.prototype.warnf = function (format) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.warn(util_1.default.format.apply(util_1.default, __spreadArrays([format], params)));
    };
    Logger.prototype.errorf = function (format) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.error(util_1.default.format.apply(util_1.default, __spreadArrays([format], params)));
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map