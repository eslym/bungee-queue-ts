import {Client} from "minecraft-protocol";

interface IPriorityManager {
    isPrioritize(client: Client): boolean;
}