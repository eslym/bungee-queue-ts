import {
    ArgumentCommandNode, CommandDispatcher, CommandNode, ArgumentType, string, bool, float, integer,
    StringArgumentType as _StrArgType, IntegerArgumentType as _IntArgType, FloatArgumentType as _FloatArgType,
} from "node-brigadier";

// There are not actually exported by node-bredadier
const StringArgumentType = (string() as any).__proto__.constructor;
const BoolArgumentType = (bool() as any).__proto__.constructor;
const FloatArgumentType = (float() as any).__proto__.constructor;
const IntegerArgumentType = (integer() as any).__proto__.constructor;

export enum NodeType{
    ROOT,
    LITERAL,
    ARGUMENT
}

export enum SuggestionType{
    ASK_SERVER = "minecraft:ask_server",
    ALL_RECIPES = "minecraft:all_recipes",
    AVAILABLE_SOUNDS = "minecraft:available_sounds",
    SUMMONABLE_ENTITIES = "minecraft:summonable_entities",
}

const TypeMap: {[name: string]: NodeType} = {
    root: NodeType.ROOT,
    literal: NodeType.LITERAL,
    argument: NodeType.ARGUMENT,
};

const StringPropertiesMap: {[type: string]: number} = {
    words_with_underscores: 0,
    "\"quoted phrase\"": 1,
    "words with spaces": 2
};

export type NodeIdentifier = number | string;

export interface DeclareCommandsPacket{
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
        suggests? : SuggestionType;
    };
}

export class PacketBuilder<S> {
    protected dispatcher: CommandDispatcher<S> = new CommandDispatcher<S>();
    protected nodeIndex: Map<string, number> = new Map();
    protected nodes: NodePacket[] = [];
    protected source?: S;

    public buildPacket(dispatcher: CommandDispatcher<S>, source: S): DeclareCommandsPacket{
        this.nodeIndex = new Map();
        this.nodes = [];
        this.dispatcher = dispatcher;
        this.source = source;
        this.makeNodePacket(dispatcher.getRoot());
        this.normalizePacket();
        return {
            nodes: this.nodes,
            rootIndex: 0
        };
    }

    protected makeNodePacket(node: CommandNode<S>){
        if(!node.canUse(this.source as S)){
            return;
        }
        let children: CommandNode<S>[] = Array.from(node.getChildren());
        let packet: NodePacket = {
            children: children.map(n=>this.dispatcher.getPath(n).join('->')),
            flags: {
                command_node_type: TypeMap[node.getNodeType()]
            }
        };
        if(node.getRedirect() !== null){
            packet.flags.has_redirect_node = 1;
            packet.redirectNode = this.dispatcher.getPath(node.getRedirect()).join('->')
        }
        switch (packet.flags.command_node_type) {
            case NodeType.LITERAL:
                packet.extraNodeData = node.getName();
                break;
            case NodeType.ARGUMENT:
                let arg: ArgumentCommandNode<S, unknown> = (node as ArgumentCommandNode<S, unknown>);
                packet.extraNodeData = {
                    name: node.getName(),
                    parser: this.findParser(arg.getType())
                };
                if (arg.getCustomSuggestions()){
                    packet.flags.has_custom_suggestions = 1;
                    packet.extraNodeData.suggests = SuggestionType.ASK_SERVER;
                }
                if (arg.getType() instanceof StringArgumentType){
                    packet.extraNodeData.properties = StringPropertiesMap[(arg.getType() as _StrArgType).getType()];
                } else if (arg.getType() instanceof FloatArgumentType || arg.getType() instanceof IntegerArgumentType){
                    let prop: any = {};
                    let cast = arg.getType() as unknown as { getMaximum():number, getMinimum(): number};
                    if(cast.getMaximum() !== Infinity){
                        prop.max = cast.getMaximum();
                        packet.extraNodeData.properties = prop;
                    }
                    if(cast.getMinimum() !== -Infinity){
                        prop.min = cast.getMinimum();
                        packet.extraNodeData.properties = prop;
                    }
                }
                break;
        }
        this.nodeIndex.set(this.dispatcher.getPath(node).join('->'), this.nodes.length);
        this.nodes.push(packet);
        children.forEach((child: CommandNode<S>)=>{
            this.makeNodePacket(child);
        });
    }

    protected findParser(type: ArgumentType<unknown>): string{
        if(type instanceof StringArgumentType){
            return "brigadier:string";
        } else if (type instanceof BoolArgumentType){
            return "brigadier:bool";
        } else if (type instanceof FloatArgumentType){
            return "brigadier:float";
        } else if (type instanceof IntegerArgumentType){
            return "brigadier:integer";
        }
        return "";
    }

    protected normalizePacket(){
        this.nodes.forEach((packet)=>{
            packet.children = packet.children.map((i) => this.nodeIndex.get(i as string)) as number[];
            if(packet.redirectNode){
                packet.redirectNode = this.nodeIndex.get(packet.redirectNode as string);
            }
        });
    }
}