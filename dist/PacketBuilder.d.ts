import { CommandDispatcher, CommandNode, ArgumentType } from "node-brigadier";
export declare enum NodeType {
    ROOT = 0,
    LITERAL = 1,
    ARGUMENT = 2
}
export declare enum SuggestionType {
    ASK_SERVER = "minecraft:ask_server",
    ALL_RECIPES = "minecraft:all_recipes",
    AVAILABLE_SOUNDS = "minecraft:available_sounds",
    SUMMONABLE_ENTITIES = "minecraft:summonable_entities"
}
export declare type NodeIdentifier = number | string;
export interface DeclareCommandsPacket {
    nodes: NodePacket[];
    rootIndex: number;
}
export interface NodePacket {
    children: NodeIdentifier[];
    flags: {
        has_redirect_node?: 0 | 1;
        command_node_type: NodeType;
        has_custom_suggestions?: 0 | 1;
        min_present?: 0 | 1;
        max_present?: 0 | 1;
    };
    redirectNode?: NodeIdentifier;
    extraNodeData?: string | {
        name: string;
        parser: string;
        properties?: number | {
            min?: number;
            max?: number;
        };
        suggests?: SuggestionType;
    };
}
export declare class PacketBuilder<S> {
    protected dispatcher: CommandDispatcher<S>;
    protected nodeIndex: Map<string, number>;
    protected nodes: NodePacket[];
    protected source?: S;
    buildPacket(dispatcher: CommandDispatcher<S>, source: S): DeclareCommandsPacket;
    protected makeNodePacket(node: CommandNode<S>): void;
    protected findParser(type: ArgumentType<unknown>): string;
    protected normalizePacket(): void;
}
//# sourceMappingURL=PacketBuilder.d.ts.map