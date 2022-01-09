import {Parameter} from "../Parameter";
import {Token, TokenTypes} from "../Parser";

interface ExpressionToken extends Token {
    parameter?: Parameter;
}

export class ExpressionParameter extends Parameter {
    private _expression: ExpressionToken;

    constructor(expression: Token) {
        super(false, null)
        this._expression = this.parse(expression);
    }

    protected parse(thing: Token): ExpressionToken {

        const walk = (thing) => {
            switch (thing.type) {
                case TokenTypes.OPERATOR:
                case TokenTypes.STRING:
                case TokenTypes.NUMBER:
                    return {
                        type: thing.type,
                        value: thing.value
                    }

                case TokenTypes.REGISTER:
                    return {
                        type: thing.type,
                        value: null,
                        parameter: new Parameter(true, thing.value)
                    }

                default:
                    if (Array.isArray(thing.value)) {
                        return {
                            type: thing.type,
                            value: thing.value.map(walk)
                        }
                    } else {
                        return {
                            type: thing.type,
                            value: walk(thing)
                        }
                    }
            }
        }

        return {
            type: thing.type,
            value: walk(thing)
        };
    }

    protected evaluate(closure): any {

        const walk = token => {

            if (token.type !== TokenTypes.EXPRESSION) {

                switch (token.type) {
                    case TokenTypes.OPERATOR:
                        return token.value;
                    case TokenTypes.NUMBER:
                        return token.value;
                    case TokenTypes.STRING:
                        return token.value;
                    case TokenTypes.REGISTER:
                        return token.parameter.finalized(closure);
                    default:
                        throw new Error(`Unsupported token ${TokenTypes[token.type]} in expression`)
                }
            } else if (!Array.isArray(token.value)) {
                return walk(token.value);
            }


            const op1 = walk(token.value[0]);
            const operator = (token.value[1].value);
            const op2 = walk(token.value[2]);

            switch (operator) {
                case "+":
                    return op1 + op2
                case "-":
                    return op1 - op2
                case "*":
                    return op1 * op2
                case "/":
                    return op1 / op2
            }

        }

        return walk(this._expression);

    }

    finalized(closure): any {
        return this.evaluate(closure);
    }

}