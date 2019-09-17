"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_brigadier_1 = require("node-brigadier");
function ListCommand(service) {
    return node_brigadier_1.literal("list").executes(function (context) {
        context.getSource().write('chat', {
            message: [{
                    translate: "Players: %s",
                    with: [service.clients().map(function (client) { return client.username; }).join(', ')]
                }],
            position: 1
        });
        return 0;
    });
}
exports.ListCommand = ListCommand;
//# sourceMappingURL=ListCommand.js.map