import {Interface} from "readline";
import Socket = NodeJS.Socket;
import ansi from "ansi-escape-sequences";
import moment from "moment";
import util from "util";
import {Console} from "console";
import {Writable} from "stream";

export class Logger{
    protected cli: Interface;
    protected console: Console;
    protected output: Writable;

    constructor(cli: Interface){
        this.cli = cli;
        this.output = (cli as any).output;
        this.console = new Console(this.output, this.output);
    }

    public log(param: any, ...extras: any[]){
        this.output.write(ansi.erase.inLine(2) + ansi.style.reset + "[" + moment().toISOString() + "][LOG]");
        this.console.log(param, ...extras);
        (this.cli as any)._refreshLine();
    }

    public info(param: any, ...extras: any[]){
        this.output.write(ansi.erase.inLine(2) + ansi.style.reset + "[" + moment().toISOString() + "][INFO]");
        this.console.info(param, ...extras);
        (this.cli as any)._refreshLine();
    }

    public warn(param: any, ...extras: any[]){
        this.output.write(ansi.erase.inLine(2) + ansi.style.yellow + "[" + moment().toISOString() + "][WARN]");
        this.console.warn(param, ...extras);
        (this.cli as any)._refreshLine();
    }

    public error(param: any, ...extras: any[]){
        this.output.write(ansi.erase.inLine(2) + ansi.style.red + "[" + moment().toISOString() + "][ERROR]");
        this.console.error(param, ...extras);
        (this.cli as any)._refreshLine();
    }

    public logf(format: string, ...params: any[]){
        this.log(util.format(format, ...params));
    }

    public infof(format: string, ...params: any[]){
        this.info(util.format(format, ...params));
    }

    public warnf(format: string, ...params: any[]){
        this.warn(util.format(format, ...params));
    }

    public errorf(format: string, ...params: any[]){
        this.error(util.format(format, ...params));
    }
}