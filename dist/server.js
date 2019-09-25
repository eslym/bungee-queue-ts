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
var QueueService_1 = require("./QueueService");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var ListCommand_1 = require("./commands/ListCommand");
var PrioritizeCommand_1 = require("./commands/PrioritizeCommand");
var readline_1 = __importDefault(require("readline"));
var Logger_1 = require("./Logger");
var FileBasedPermissionManager_1 = require("./FileBasedPermissionManager");
var settingsPath = path.join(process.cwd(), 'settings.json');
if (!fs.existsSync(settingsPath)) {
    fs.copyFileSync(path.join(__dirname, '../settings.json.example'), settingsPath);
}
var settings = JSON.parse(fs.readFileSync(settingsPath).toString('utf8'));
var cli = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
});
var logger = new Logger_1.Logger(cli);
(new QueueService_1.QueueService(settings, cli))
    .setLogger(logger)
    .setPermissionManager(new FileBasedPermissionManager_1.FileBasedPermissionManager('', ''))
    .registerCommand(ListCommand_1.ListCommand)
    .registerCommand(PrioritizeCommand_1.PrioritizeCommand)
    .start();
//# sourceMappingURL=server.js.map