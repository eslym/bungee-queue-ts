import {QueueService} from "../QueueService";
import {Client} from "minecraft-protocol";

import {
    word,
    argument,
    CommandContext,
    literal,
    LiteralArgumentBuilder, LiteralMessage,
    StringArgumentType, Suggestions,
    SuggestionsBuilder
} from "node-brigadier";
import {QueueState} from "..";
import {IExecutor} from "../types/IExecutor";

export function PrioritizeCommand(service: QueueService): LiteralArgumentBuilder<IExecutor> {
    return literal<IExecutor>('prioritize')
        .then(
            argument<IExecutor, String>('Player', word())
                .executes((context: CommandContext<IExecutor>) => {
                    let player = StringArgumentType.getString(context, 'Player');
                    let selected = undefined;
                    if (player === "@s") {
                        selected = context.getSource().getClient();
                    } else {
                        selected = service.lookup(player);
                    }
                    if (selected && service.wrap(selected).queueState === QueueState.QUEUED) {
                        if (service.queue.priority.hasOwnProperty(selected.uuid)) {
                            context.getSource().sendSystem({
                                translate: "%s is already in priority queue.",
                                with: [player],
                                color: "red"
                            });
                        } else {
                            delete service.queue.normal[selected.uuid];
                            service.queue.priority[selected.uuid] = selected;
                            context.getSource().sendSystem({
                                translate: "%s has queued into priority queue.",
                                with: [player],
                                color: "yellow"
                            });
                        }
                    } else {
                        context.getSource().sendSystem({
                            translate: "Could not find any player: %s",
                            with: [player],
                            color: "red",
                        });
                    }
                    return 0;
                })
                .suggests(
                {
                    async getSuggestions(context: CommandContext<IExecutor>, builder: SuggestionsBuilder): Promise<Suggestions> {
                        Object.values(service.queue.normal).forEach((client) => {
                            builder.suggest(client.username, new LiteralMessage(service.wrap(client).realUUID as string));
                        });
                        if(context.getSource().getClient()){
                            builder.suggest("@s", new LiteralMessage("Yourself"));
                        }
                        return builder.build();
                    }
                })
        ).executes((context: CommandContext<IExecutor>) => {
            context.getSource().sendSystem({
                text: "Missing argument player.",
                color: "red"
            });
            return 0;
        }).requires((executor: IExecutor)=>{
            return executor.hasPermission('queue.prioritize');
        });
}