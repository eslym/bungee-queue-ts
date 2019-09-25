import {Interface} from "readline";
import Socket = NodeJS.Socket;
import * as ansi from "ansi-escape-sequences";

export class Logger{
    protected cli: Interface;

    constructor(cli: Interface){
        this.cli = cli;
    }

    public log(param: any, ...extras: any[]){
        let output: Socket = (this.cli as any).output;
        output.write(ansi.erase.inLine(2));
        console.log.apply((this.cli as any).output, Array.prototype.slice.call(arguments) as any);
        (this.cli as any)._refreshLine();
    }


}