import {Token, TokenTypes} from "../../runtime/interpreter/Parser";

export function getTextIdForTokens(tokens: Array<Token>): string {
    const firstToken = tokens[0];
    switch (firstToken.value) {

        case 'DO':
            if (tokens.length === 2) {
                return "DO_NONE";
            } else if (tokens.length === 3) {
                return "DO_VALUE";
            } else if (tokens.length === 4) {
                return "DO_VALUE_INDEX";
            }
            break;

        case 'MOVE':
            if (tokens.length === 3) {
                if (tokens[2].type === TokenTypes.REGISTERAT) {
                    return "MOVE_TO"
                }
            }

    }
    return firstToken.value as string;
}