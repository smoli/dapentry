import {Token, TokenTypes} from "../../src/runtime/interpreter/Parser";

export function T_OPCODE(opcode): Token {
    return { type: TokenTypes.OPCODE, value: opcode }
}

export function T_NUMBER(value): Token {
    return { type: TokenTypes.NUMBER, value }
}

export function T_STRING(value): Token {
    return { type: TokenTypes.STRING, value }
}

export function T_REGISTER(value): Token {
    return { type: TokenTypes.REGISTER, value }
}

export function T_NAME(name: string): Token {
    return { type: TokenTypes.NAME, value: name };
}

export function T_REGISTERAT(name: string, where: ( string | number )): Token {
    if (typeof where === "string") {
        return { type: TokenTypes.REGISTERAT, value: [T_REGISTER(name), T_NAME(where)] }
    } else {
        return { type: TokenTypes.REGISTERAT, value: [T_REGISTER(name), T_NUMBER(where)] }
    }
}

export function T_POINT_NN(x: number, y: number): Token {
    return { type: TokenTypes.POINT, value: [T_NUMBER(x), T_NUMBER(y)] }
}

export function T_OPERATOR(value: string): Token {
    return { type: TokenTypes.OPERATOR, value }
}

export function T_LABEL(value: string): Token {
    return { type: TokenTypes.LABEL, value }
}

export function T_ANNOTATION(name: string, ...args): Token {
    return { type: TokenTypes.ANNOTATION, value: name, args }
}

export function T_EXPRESSION(value1: Token, operator: string, value2: Token): Token {
    return { type: TokenTypes.EXPRESSION, value: [value1, T_OPERATOR(operator), value2] };
}