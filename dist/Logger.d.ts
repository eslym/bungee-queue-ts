/// <reference types="node" />
import { Interface } from "readline";
import { Writable } from "stream";
export declare class Logger {
    protected cli: Interface;
    protected console: Console;
    protected output: Writable;
    constructor(cli: Interface);
    log(param: any, ...extras: any[]): void;
    info(param: any, ...extras: any[]): void;
    warn(param: any, ...extras: any[]): void;
    error(param: any, ...extras: any[]): void;
    logf(format: string, ...params: any[]): void;
    infof(format: string, ...params: any[]): void;
    warnf(format: string, ...params: any[]): void;
    errorf(format: string, ...params: any[]): void;
}
//# sourceMappingURL=Logger.d.ts.map