import { Client } from "minecraft-protocol";
import { Moment } from "moment";
declare type PlayerType = string | Client;
export interface BanInfo {
    isBan: boolean;
    reason: string;
    expires?: Moment;
}
export interface IBanManager {
    getBanInfo(client: Client): BanInfo;
    ban(player: PlayerType, reason: string, expires?: Moment): void;
    unBan(player: PlayerType): void;
}
export {};
//# sourceMappingURL=IBanManager.d.ts.map