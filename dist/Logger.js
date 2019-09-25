"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ansi = __importStar(require("ansi-escape-sequences"));
var Logger = (function () {
    function Logger(cli) {
        this.cli = cli;
    }
    Logger.prototype.log = function (param) {
        var extras = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extras[_i - 1] = arguments[_i];
        }
        var output = this.cli.output;
        output.write(ansi.erase.inLine(2));
        console.log.apply(this.cli.output, Array.prototype.slice.call(arguments));
        this.cli._refreshLine();
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map