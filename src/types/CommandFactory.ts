import {QueueService} from "../QueueService";
import {LiteralArgumentBuilder} from "node-brigadier";
import {IExecutor} from "./IExecutor";

declare type CommandFactory = (service: QueueService) => LiteralArgumentBuilder<IExecutor>;

export default CommandFactory;