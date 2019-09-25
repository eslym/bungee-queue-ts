import {Interface} from "readline";
import ansi from "ansi-escape-sequences";
import moment from "moment";
import util from "util";
import {Console} from "console";
import {Writable} from "stream";
import {ILogger} from "./types/ILogger";

export class Logger implements ILogger{
    protected cli: Interface;
    protected console: Console;
    protected output: Writable;
    private readonly clearLine: string = ansi.erase.inLine(2) + ansi.cursor.horizontalAbsolute(0);

    constructor(cli: Interface){
        this.cli = cli;
        this.output = (cli as any).output;
        this.console = new Console(this.output, this.output);
    }

    public log(param: any, ...extras: any[]): void{
        this.output.write(this.clearLine + ansi.style.reset + "[" + moment().toISOString() + "][LOG] ");
        this.console.log(param, ...extras);
        (this.cli as any)._refreshLine();
    }

    public info(param: any, ...extras: any[]): void{
        this.output.write(this.clearLine + ansi.style.reset + "[" + moment().toISOString() + "][INFO] ");
        this.console.info(param, ...extras);
        (this.cli as any)._refreshLine();
    }

    public warn(param: any, ...extras: any[]): void{
        this.output.write(this.clearLine + ansi.style.yellow + "[" + moment().toISOString() + "][WARN] ");
        this.console.warn(param, ...extras);
        (this.cli as any)._refreshLine();
    }

    public error(param: any, ...extras: any[]): void{
        this.output.write(this.clearLine + ansi.style.red + "[" + moment().toISOString() + "][ERROR] ");
        this.console.error(param, ...extras);
        (this.cli as any)._refreshLine();
    }

    public logF(format: string, ...params: any[]): void{
        this.log(util.format(format, ...params));
    }

    public infoF(format: string, ...params: any[]): void{
        this.info(util.format(format, ...params));
    }

    public warnF(format: string, ...params: any[]): void{
        this.warn(util.format(format, ...params));
    }

    public errorF(format: string, ...params: any[]): void{
        this.error(util.format(format, ...params));
    }
}