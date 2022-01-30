import {Token, TokenTypes} from "../../src/runtime/interpreter/Parser";

export function T_OPCODE(opcode): Token {
    return {type: TokenTypes.OPCODE, value: opcode}
}

export function T_NUMBER(value): Token {
    return {type: TokenTypes.NUMBER, value}
}

export function T_STRING(value): Token {
    return {type: TokenTypes.STRING, value}
}

export function T_REGISTER(value): Token {
    return {type: TokenTypes.REGISTER, value}
}

export function T_POINT_NN(x: number, y: number): Token {
    return {type: TokenTypes.POINT, value: [T_NUMBER(x), T_NUMBER(y)]}
}