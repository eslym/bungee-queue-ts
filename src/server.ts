import {QueueService} from './QueueService';
import * as fs from 'fs';
import * as path from 'path';
import {ListCommand} from "./commands/ListCommand";
import {PrioritizeCommand} from "./commands/PrioritizeCommand";
import {Settings} from "./types/Settings";

let settingsPath = path.join(process.cwd(), 'settings.json');

if(!fs.existsSync(settingsPath)){
    fs.copyFileSync(path.join(__dirname, '../settings.json.example'), settingsPath);
}
const settings: Settings = JSON.parse(fs.readFileSync(settingsPath).toString('utf8'));

(new QueueService(settings))
    .registerCommand(ListCommand)
    .registerCommand(PrioritizeCommand)
    .start();