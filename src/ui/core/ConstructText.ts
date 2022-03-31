import {Parser, Token, TokenTypes} from "../../runtime/interpreter/Parser";
import {getTextIdForTokens} from "./GetTextIdForTokens";

export function constructText(tokens, $t): string {
    const firstToken = tokens[0];

    if (!firstToken) {
        return "NO FIRST TOKEN!";
    }

    const tokenTexts = tokens.map((t: Token) => {
        switch (t.type) {
            case TokenTypes.NUMBER:
                return ( t.value as number ).toFixed(2);

            case TokenTypes.POINT:
                return `(${t.value[0].value}, ${t.value[1].value})`;

            case TokenTypes.REGISTERAT:
                if (t.value[1].type === TokenTypes.NUMBER) {
                    return `${t.value[0].value} at ${t.value[1].value}`;
                } else {
                    return `${t.value[0].value}'s ${t.value[1].value}`;
                }

            case TokenTypes.EXPRESSION:
                return Parser.constructCodeLine([t]);

            case TokenTypes.ARRAY:
                return `${( t.value as Array<Token> ).length} ${$t("ui.points")}`

            default:
                return t.value;
        }
    });

    if (firstToken.type === TokenTypes.ANNOTATION) {
        if (firstToken.args) {
            tokenTexts.push(...firstToken.args);
        }
    }

    return $t("statements." + getTextIdForTokens(tokens), tokenTexts).replace(/[\[\]]/g, "");
}