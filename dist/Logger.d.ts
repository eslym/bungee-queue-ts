/// <reference types="node" />
import { Interface } from "readline";
import { Writable } from "stream";
import { ILogger } from "./types/ILogger";
export declare class Logger implements ILogger {
    protected cli: Interface;
    protected console: Console;
    protected output: Writable;
    private readonly clearLine;
    constructor(cli: Interface);
    log(param: any, ...extras: any[]): void;
    info(param: any, ...extras: any[]): void;
    warn(param: any, ...extras: any[]): void;
    error(param: any, ...extras: any[]): void;
    logF(format: string, ...params: any[]): void;
    infoF(format: string, ...params: any[]): void;
    warnF(format: string, ...params: any[]): void;
    errorF(format: string, ...params: any[]): void;
}
//# sourceMappingURL=Logger.d.ts.map