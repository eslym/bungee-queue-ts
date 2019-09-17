import {ClickEventAction} from "../enums/ClickEventAction";
import {HoverEventAction} from "../enums/HoverEventAction";

interface BaseComponent{
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;
    insertion?: string;
    clickEvent?: ClickEvent;
    hoverEvent?: HoverEvent;
    extra?: JsonText;
}

export interface ClickEvent{
    action: ClickEventAction;
    value: string;
}

export interface HoverEvent{
    action: HoverEventAction;
    value: string;
}

export interface TranslateComponent extends BaseComponent{
    translate: string;
    with?: JsonTextComponent[];
}

export interface ScoreComponent extends BaseComponent{
    score: {
        name: string;
        objective: string;
        value?: string;
    };
}

export interface SelectorComponent extends BaseComponent{
    selector: string;
}

export interface KeybindComponent extends BaseComponent{
    keybind: string;
}

export interface TextComponent extends BaseComponent{
    text: string;
}

declare type JsonTextComponent = string | TranslateComponent | ScoreComponent | SelectorComponent | KeybindComponent | TextComponent;

declare type JsonText = JsonTextComponent[] | JsonTextComponent | string;

export default JsonText;