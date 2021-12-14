export enum TokenTypes {
    OPCODE,
    REGISTER,
    NUMBER,
    STRING,
    OTHER
}

export interface Token {
    type: TokenTypes,
    value: number | string
}

export class Parser {

    public static parseLine(line: string): Array<Token> {
        const tokens = [];

        let value = null

        let type: TokenTypes = null;


        for (let c of line) {
            switch (c) {
                case "#":
                    if (value !== null && type !== TokenTypes.STRING) {
                        tokens.push({type: TokenTypes.OTHER, value});
                    } else if (type === TokenTypes.STRING) {
                        if (value !== null) {
                            value += c;
                        } else {
                            value = c
                        }
                    }
                    break;

                case " ":
                    if (type !== TokenTypes.STRING && value !== null) {
                        tokens.push({type: TokenTypes.OTHER, value});
                        value = null;
                        type = null
                    } else if (type === TokenTypes.STRING) {
                        value += c;
                    }
                    break;

                case "\"":
                    if (type === TokenTypes.STRING) {
                        tokens.push({type, value});
                        value = null
                        type = null
                    } else {
                        value = "";
                        type = TokenTypes.STRING
                    }
                    break;

                default:
                    if (value) {
                        value += c
                    } else {
                        value = c;
                    }
            }

            if (c === "#" && type !== TokenTypes.STRING) {
                break;
            }
        }

        if (value && value.length) {
            tokens.push({type: TokenTypes.OTHER, value})
        }

        return tokens.map((token, index) => {

            if (index === 0) {
                token.type = TokenTypes.OPCODE;
            } else if (token.type === TokenTypes.OTHER) {
                if (isNaN(token.value)) {
                    token.type = TokenTypes.REGISTER;
                } else {
                    token.type = TokenTypes.NUMBER;
                    token.value = Number(token.value)
                }
            }
            return token;

        });
    }
}