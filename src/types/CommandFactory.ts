import {QueueService} from "../QueueService";
import {LiteralArgumentBuilder} from "node-brigadier";
import {Client} from "minecraft-protocol";

declare type CommandFactory = (service: QueueService) => LiteralArgumentBuilder<Client>;

export default CommandFactory;