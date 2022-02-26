import {Parameter} from "./Parameter";
import {TokenTypes} from "./TokenTypes";
import {AtParameter} from "./types/AtParameter";
import {Point2Parameter} from "./types/Point2Parameter";
import {ArrayParameter} from "./types/ArrayParameter";
import {ExpressionParameter} from "./types/ExpressionParameter";
import {MathFuncParameter} from "./types/MathFuncParameter";

export function makeParameter(token): Parameter {
    switch (token.type) {

        case TokenTypes.REGISTER:   //pass through
        case TokenTypes.NUMBER:     //pass through
        case TokenTypes.STRING:
            return new Parameter(token.type === TokenTypes.REGISTER, token.value);

        case TokenTypes.NONLOCALREGISTER:
            return new Parameter(token.type === TokenTypes.NONLOCALREGISTER, token.value, true);

        case TokenTypes.REGISTERAT:
            return new AtParameter(token.value[0].value, token.value[1].value, token.value[1].type);

        case TokenTypes.POINT:
            return new Point2Parameter(
                makeParameter(token.value[0]),
                makeParameter(token.value[1])
            )

        case TokenTypes.ARRAY:
            return new ArrayParameter(
                (token.value as Array<any>).map(token => makeParameter(token))
            )

        case TokenTypes.ANNOTATION:
            // Annotations are ignored for execution
            break;

        case TokenTypes.EXPRESSION:
            return new ExpressionParameter(token);

        case TokenTypes.MATHFUNC:
            return new MathFuncParameter(
                token.value[0].value,
                makeParameter(token.value[1])
            )

        case TokenTypes.OTHER:
            break;
    }
}