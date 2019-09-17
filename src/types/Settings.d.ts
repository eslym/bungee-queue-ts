import JsonText from "./JsonText";

export interface Settings{
    listen: {
        host: string;
        port: number;
    },
    queue: {
        version: string;
        maxPlayers: number;
        maxInQueue: number;
        targetServer: string;
    },
    language: {
        queueFull: string;
        serverFull: JsonText;
        serverDown: JsonText;
        queueUpdate: string;
    }
}