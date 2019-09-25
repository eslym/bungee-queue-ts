import {QueueService} from './QueueService';
import * as fs from 'fs';
import * as path from 'path';
import {ListCommand} from "./commands/ListCommand";
import {PrioritizeCommand} from "./commands/PrioritizeCommand";
import {Settings} from "./types/Settings";
import readline, {Interface} from "readline";
import {ILogger} from "./types/ILogger";
import {Logger} from "./Logger";
import {FileBasedPermissionManager} from "./FileBasedPermissionManager";

let settingsPath = path.join(process.cwd(), 'settings.json');

if(!fs.existsSync(settingsPath)){
    fs.copyFileSync(path.join(__dirname, '../settings.json.example'), settingsPath);
}
const settings: Settings = JSON.parse(fs.readFileSync(settingsPath).toString('utf8'));

const cli: Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
});

const logger: ILogger = new Logger(cli);

(new QueueService(settings, cli))
    .setLogger(logger)
    .setPermissionManager(new FileBasedPermissionManager('', ''))
    .registerCommand(ListCommand)
    .registerCommand(PrioritizeCommand)
    .start();