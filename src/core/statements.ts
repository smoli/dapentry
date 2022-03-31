import {Token, TokenTypes} from "../runtime/interpreter/Parser";
import {AppConfig} from "./AppConfig";

export function isMakeStatement(tokens: Array<Token>) {
    return tokens[0].type === TokenTypes.OPCODE && tokens[0].value === AppConfig.Runtime.Opcodes.MakeInstance;
}

export function getLibraryEntryNameFromMakeStatement(tokens: Array<Token>):string {
    if (tokens[2].type === TokenTypes.STRING) {
        return tokens[2].value as string;
    } else {
        return null;
    }
}