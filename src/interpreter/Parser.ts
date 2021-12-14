export enum TokenTypes {
    OPCODE,
    REGISTER,
    NUMBER,
    STRING,
    LABEL,
    OTHER
}

export interface Token {
    type: TokenTypes,
    value: number | string
}

export class Parser {

    public static parseLine(line: string): Array<Token> {
        const tokens = [];

        let value: string = null

        let type: TokenTypes = null;


        for (let c of line) {
            switch (c) {

                case ":":
                    if (value !== null && type !== TokenTypes.STRING) {
                        if (tokens.length) {
                            throw new Error(`Label ${value} must be the only token on the line`)
                        }
                        tokens.push({type: TokenTypes.LABEL, value});
                        value = null;
                        type = null;
                    } else {
                        if (value !== null) {
                            value += c;
                        } else {
                            value = c
                        }
                    }

                    break;

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


        if (tokens.length > 1 && tokens[0].type === TokenTypes.LABEL) {
            throw new Error(`Label "${tokens[0].value}" must be the only token on the line.`)
        }

        return tokens.map((token, index) => {

            if (index === 0 && token.type !== TokenTypes.LABEL) {
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