import JsonText from "./JsonText";
import { Client } from "minecraft-protocol";
export interface IExecutor {
    hasPermission(permission: string): boolean;
    sendChat(content: JsonText): void;
    sendSystem(content: JsonText): void;
    getClient(): Client | null;
}
//# sourceMappingURL=IExecutor.d.ts.map