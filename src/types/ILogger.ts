import ansi from "ansi-escape-sequences";
import moment from "moment";
import util from "util";

export interface ILogger {
    log(param: any, ...extras: any[]): void;

    info(param: any, ...extras: any[]): void;

    warn(param: any, ...extras: any[]): void;

    error(param: any, ...extras: any[]): void;

    logF(format: string, ...params: any[]): void;

    infoF(format: string, ...params: any[]): void;

    warnF(format: string, ...params: any[]): void;

    errorF(format: string, ...params: any[]): void;
}