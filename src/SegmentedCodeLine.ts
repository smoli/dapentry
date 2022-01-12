import {Token} from "./runtime/interpreter/Parser";

export interface SegmentedCodeLine {
    index: number,
    tokens: Array<Token>,
    level?:number,
    selected:boolean
}