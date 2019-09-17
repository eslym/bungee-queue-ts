import {QueueService} from "../QueueService";
import {CommandContext, literal, LiteralArgumentBuilder} from "node-brigadier";
import {Client} from "minecraft-protocol";

export function ListCommand(service: QueueService): LiteralArgumentBuilder<Client>{
    return literal<Client>("list").executes((context: CommandContext<Client>)=>{
        context.getSource().write('chat', {
            message: [{
                translate: "Players: %s",
                with: [service.getClients().map((client)=>client.username).join(', ')]
            }],
            position: 1
        });
        return 0;
    }).requires((client) => service.getPermissionManager().hasPermission(client, 'queue.list'));
}