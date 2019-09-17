import JsonText from "./JsonText";
import {Duration} from "moment";

interface DurationObject {
    years?: number;
    quarters?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
    y?: number;
    Q?: number;
    M?: number;
    w?: number;
    d?: number;
    h?: number;
    m?: number;
    s?: number;
    ms?: number;
}

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
        availabilityDelay: DurationObject | Duration;
    },
    language: {
        queueFull: string;
        serverFull: JsonText;
        serverDown: JsonText;
        queueUpdate: string;
    }
}