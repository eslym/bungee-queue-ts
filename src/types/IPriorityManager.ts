import {Client} from "minecraft-protocol";

interface IPriorityManager {
    isPrioritize(client: Client): boolean;

    prioritize(client: Client): void;

    prioritize(player: string): void;

    unPrioritize(client: Client): void;

    unPrioritize(player: string): void;

    prioritizeOnce(client: Client): void;

    prioritizeOnce(player: string): void;
}