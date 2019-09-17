"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_brigadier_1 = require("node-brigadier");
var StringArgumentType = node_brigadier_1.string().__proto__.constructor;
var BoolArgumentType = node_brigadier_1.bool().__proto__.constructor;
var FloatArgumentType = node_brigadier_1.float().__proto__.constructor;
var IntegerArgumentType = node_brigadier_1.integer().__proto__.constructor;
var NodeType;
(function (NodeType) {
    NodeType[NodeType["ROOT"] = 0] = "ROOT";
    NodeType[NodeType["LITERAL"] = 1] = "LITERAL";
    NodeType[NodeType["ARGUMENT"] = 2] = "ARGUMENT";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
var SuggestionType;
(function (SuggestionType) {
    SuggestionType["ASK_SERVER"] = "minecraft:ask_server";
    SuggestionType["ALL_RECIPES"] = "minecraft:all_recipes";
    SuggestionType["AVAILABLE_SOUNDS"] = "minecraft:available_sounds";
    SuggestionType["SUMMONABLE_ENTITIES"] = "minecraft:summonable_entities";
})(SuggestionType = exports.SuggestionType || (exports.SuggestionType = {}));
var TypeMap = {
    root: NodeType.ROOT,
    literal: NodeType.LITERAL,
    argument: NodeType.ARGUMENT,
};
var StringPropertiesMap = {
    words_with_underscores: 0,
    "\"quoted phrase\"": 1,
    "words with spaces": 2
};
var PacketBuilder = (function () {
    function PacketBuilder() {
        this.dispatcher = new node_brigadier_1.CommandDispatcher();
        this.nodeIndex = new Map();
        this.nodes = [];
    }
    PacketBuilder.prototype.buildPacket = function (dispatcher, source) {
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
    };
    PacketBuilder.prototype.makeNodePacket = function (node) {
        var _this = this;
        if (!node.canUse(this.source)) {
            return;
        }
        var children = Array.from(node.getChildren());
        var packet = {
            children: children.map(function (n) { return _this.dispatcher.getPath(n).join('->'); }),
            flags: {
                command_node_type: TypeMap[node.getNodeType()]
            }
        };
        if (node.getRedirect() !== null) {
            packet.flags.has_redirect_node = 1;
            packet.redirectNode = this.dispatcher.getPath(node.getRedirect()).join('->');
        }
        switch (packet.flags.command_node_type) {
            case NodeType.LITERAL:
                packet.extraNodeData = node.getName();
                break;
            case NodeType.ARGUMENT:
                var arg = node;
                packet.extraNodeData = {
                    name: node.getName(),
                    parser: this.findParser(arg.getType())
                };
                if (arg.getCustomSuggestions()) {
                    packet.flags.has_custom_suggestions = 1;
                    packet.extraNodeData.suggests = SuggestionType.ASK_SERVER;
                }
                if (arg.getType() instanceof StringArgumentType) {
                    packet.extraNodeData.properties = StringPropertiesMap[arg.getType().getType()];
                }
                else if (arg.getType() instanceof FloatArgumentType || arg.getType() instanceof IntegerArgumentType) {
                    var prop = {};
                    var cast = arg.getType();
                    if (cast.getMaximum() !== Infinity) {
                        prop.max = cast.getMaximum();
                        packet.extraNodeData.properties = prop;
                    }
                    if (cast.getMinimum() !== -Infinity) {
                        prop.min = cast.getMinimum();
                        packet.extraNodeData.properties = prop;
                    }
                }
                break;
        }
        this.nodeIndex.set(this.dispatcher.getPath(node).join('->'), this.nodes.length);
        this.nodes.push(packet);
        children.forEach(function (child) {
            _this.makeNodePacket(child);
        });
    };
    PacketBuilder.prototype.findParser = function (type) {
        if (type instanceof StringArgumentType) {
            return "brigadier:string";
        }
        else if (type instanceof BoolArgumentType) {
            return "brigadier:bool";
        }
        else if (type instanceof FloatArgumentType) {
            return "brigadier:float";
        }
        else if (type instanceof IntegerArgumentType) {
            return "brigadier:integer";
        }
        return "";
    };
    PacketBuilder.prototype.normalizePacket = function () {
        var _this = this;
        this.nodes.forEach(function (packet) {
            packet.children = packet.children.map(function (i) { return _this.nodeIndex.get(i); });
            if (packet.redirectNode) {
                packet.redirectNode = _this.nodeIndex.get(packet.redirectNode);
            }
        });
    };
    return PacketBuilder;
}());
exports.PacketBuilder = PacketBuilder;
//# sourceMappingURL=PacketBuilder.js.map