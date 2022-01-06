import {TokenTypes} from "./TokenTypes";
const pegParser = require("./language")

export {TokenTypes} from "./TokenTypes";

export interface Token {
    type: TokenTypes,
    value: number | string | Array<any>
}

export class Parser {

    public static parseLine(line):Array<Token> {

        if (!line.trim()) {
            return [];
        }

        try {
            const r = pegParser.parse(line.trim(), {}) || [];
            return r;
        } catch (e) {
            console.log("SYNTAX ERROR IN: ", line.trim());
            console.log(e.message);
            throw e;
        }
    }

    public static constructCodeLine(tokens:Array<Token>):string {
        let code = "";
        const construct = (code, tokens): Array<string> => {

            for (const t of tokens) {
                if (t.type === TokenTypes.POINT) {
                    code.push("(");
                    code.push(t.value[0].value);
                    code.push(t.value[1].value);
                    code.push(")");
                } else if (t.type === TokenTypes.STRING) {
                    code.push(`"${t.value}"`);
                } else {
                    code.push(t.value);
                }
            }

            return code;
        }

        return construct([], tokens).join(" ");
    }
}

