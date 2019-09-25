declare type linesFunc = (lines?: number)=>string;

declare module "ansi-escape-sequences" {
    const cursor: {
        readonly hide:string;
        readonly show:string;
        readonly up: linesFunc;
        readonly down: linesFunc;
        readonly forward: linesFunc;
        readonly back: linesFunc;
        readonly nextLine: linesFunc;
        readonly previousLine: linesFunc;
        horizontalAbsolute(column: number): string;
        position(row: number, column: number):string;
    };
    const erase: {
        display(mode?: 0 | 1 | 2): string;
        inLine(mode?: 0 | 1 | 2): string;
    };
    const style: {
        readonly reset: string;
        readonly bold: string;
        readonly italic: string;
        readonly underline: string;
        readonly fontDefault: string;
        readonly font2: string;
        readonly font3: string;
        readonly font4: string;
        readonly font5: string;
        readonly font6: string;
        readonly imageNegative: string;
        readonly imagePositive: string;
        readonly black: string;
        readonly red: string;
        readonly green: string;
        readonly yellow: string;
        readonly blue: string;
        readonly magenta: string;
        readonly cyan: string;
        readonly white: string;
        readonly grey: string;
        readonly gray: string;
        readonly "bg-black": string;
        readonly "bg-red": string;
        readonly "bg-green": string;
        readonly "bg-yellow": string;
        readonly "bg-blue": string;
        readonly "bg-magenta": string;
        readonly "bg-cyan": string;
        readonly "bg-white": string;
        readonly "bg-grey": string;
        readonly "bg-gray": string;
    };
    function styles(effects: string | string[]): string;
    function format(str: string, effects?: string| string[]): string;
}