export enum TokenTypes {
    OPCODE,
    REGISTER,
    NUMBER,
    STRING,
    LABEL,
    STARTPOINT,
    ENDPOINT,
    POINT,
    OTHER
}

export interface Token {
    type: TokenTypes,
    value: number | string | Array<any>
}

export class Parser {

    /**
     * Parse a line
     *
     * TODO: This get ugly. Maybe create a grammar using
     *          https://pegjs.org/
     *
     * @param line
     */
    public static parseLine(line: string): Array<Token> {
        const tokens = [];

        let value: string = null

        let type: TokenTypes = null;

        let braceStack = [];

        for (let c of line) {
            switch (c) {

                case "(":
                    if (value !== null && type !== TokenTypes.STRING) {
                        throw new Error("Unexpected character (");
                    } else if (type === TokenTypes.STRING) {
                        if (value !== null) {
                            value += c;
                        } else {
                            value = c
                        }
                    } else {
                        if (braceStack.length) {
                            throw new Error("Closing Point with ) expected'")
                        }
                        tokens.push({ type: TokenTypes.STARTPOINT, value: "("});
                        braceStack.push("(");
                        value = null;
                        type = null;
                    }

                    break;

                case ")":

                    if (type === TokenTypes.STRING) {
                        if (value !== null) {
                            value += c;
                        } else {
                            value = c
                        }
                    } else {
                        if (braceStack.length === 0) {
                            throw new Error("Closing Point without opening it'")
                        }

                        if (tokens.length < 2
                            || tokens[tokens.length - 1].type === TokenTypes.STARTPOINT
                            || tokens[tokens.length - 2].type === TokenTypes.STARTPOINT
                        )  {
                          throw new Error("Points consist of at least two coordinates")
                        }

                        const parts = [];
                        let t = tokens.pop();
                        while (t.type !== TokenTypes.STARTPOINT) {
                            if (t.type === TokenTypes.OTHER) {
                                t.type = TokenTypes.REGISTER;
                            }
                            parts.unshift(t);
                            t = tokens.pop();
                        }

                        tokens.push({ type: TokenTypes.POINT, value: parts});
                        braceStack.pop()
                        value = null;
                        type = null;
                    }

                    break;

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
                        if (!isNaN(Number(value))) {
                            tokens.push({type: TokenTypes.NUMBER, value: Number(value)});
                        } else {
                            tokens.push({type: TokenTypes.OTHER, value});
                        }
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

            if (index === 0 && token.type === TokenTypes.OTHER) {
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