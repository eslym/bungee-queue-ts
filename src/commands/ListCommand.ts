import {QueueService} from "../QueueService";
import {CommandContext, literal, LiteralArgumentBuilder} from "node-brigadier";
import {IExecutor} from "../types/IExecutor";

export function ListCommand(service: QueueService): LiteralArgumentBuilder<IExecutor>{
    return literal<IExecutor>("list").executes((context: CommandContext<IExecutor>)=>{
        context.getSource().sendChat([
            {
                translate: "Players: %s",
                with: [service.getClients().map((client)=>client.username).join(', ')]
            }
            ]);
        return 0;
    }).requires((executor: IExecutor) => executor.hasPermission('queue.list'));
}