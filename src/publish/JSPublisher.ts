import {Parser, Token, TokenTypes} from "../runtime/interpreter/Parser";
import {ASSERT, UNREACHABLE} from "../core/Assertions";
import {AppConfig} from "../core/AppConfig";
import {AspectRatio} from "../geometry/AspectRatio";
import {DataField, DataFieldType} from "../state/modules/Data";
import {jsPublishTemplate} from "./jsPublishTemplate";
import {POI} from "../geometry/GrObject";


const OBJECT_MANAGER = "__objects";
const MODULE = "dapentry";
const DRAWING_FUNCTION_NAME = "drawing";
const RENDER_DRAWING_FUNCTION_NAME = "renderDrawing";
const CANVAS = "__canvas";

export function getOpCode(tokens: Array<Token>): string {
    ASSERT(tokens[0].type === TokenTypes.OPCODE, `${tokens[0]} is no opcode token`)
    return tokens[0].value as string;
}

export function getXYFromToken(token: Token): string {
    if (token.type === TokenTypes.POINT) {
        return `${getExpressionFromToken(token.value[0])}, ${getExpressionFromToken(token.value[1])}`;
    } else if (token.type === TokenTypes.REGISTERAT || token.type === TokenTypes.REGISTER) {
        return `${getVariableName(token)}.x, ${getVariableName(token)}.y`
    }

    UNREACHABLE();
}

export function getExpressionFromToken(token: Token): string {
    if (token.type === TokenTypes.EXPRESSION) {
        return Parser.constructCodeLine([token]);
    } else {
        ASSERT(token.type === TokenTypes.NUMBER || token.type === TokenTypes.REGISTER, `${token} is no number token`);
        return "" + token.value;
    }
}

export function getLiteralFromStringToken(token: Token): string {
    ASSERT(token.type === TokenTypes.STRING, `${token} is no string token`);
    return ( token.value as string ).replace(/\"/g, "");
}

const objects: { [key: string]: boolean } = {};

export function getVariableName(token: Token): string {
    if (objects[token.value as string]) {
        return getObjectVariable(token);
    } else if (token.value === AppConfig.Runtime.canvasObjectName) {
        return CANVAS;
    } else if (token.type == TokenTypes.REGISTERAT) {

        ASSERT(typeof token.value[1].value === "string", "Only string where supported");
        return getVariableName(token.value[0]) + "." + token.value[1].value;
    } else {
        return token.value as string;
    }
}

export function getObjectVariable(token: Token): string {
    let name: string;
    if (token.type === TokenTypes.REGISTER) {
        name = token.value as string;
    } else if (token.type === TokenTypes.REGISTERAT) {
        name = token.value[0].value as string;
    }

    if (name === AppConfig.Runtime.canvasObjectName) {
        return CANVAS;
    }

    objects[name] = true;
    return `${OBJECT_MANAGER}("${name}")`;
}

export function getObjectVariableSetter(token: Token, code: string): string {
    objects[token.value as string] = true;
    return `${OBJECT_MANAGER}("${token.value}", ${code})`;
}

export function getPoiFromRegisterAt(token: Token): number {
    ASSERT(token.type === TokenTypes.REGISTERAT, "Token is no REGISTERAT");
    return POI[token.value[1].value as string];
}


export function getDistance(tokenA: Token, tokenB: Token) {
    let r = "dapentry.distance(";
    r += getXYFromToken(tokenA);
    r += ", ";
    r += getXYFromToken(tokenB);
    r += ")";
    return r;
}

export function getMidpoint(tokenA: Token, tokenB: Token) {
    let r = "dapentry.midPoint(";
    r += getXYFromToken(tokenA);
    r += ", ";
    r += getXYFromToken(tokenB);
    r += ")";

    return r;
}

let loopVarIndex = 0;

function getDoStartForTokens(tokens: Array<Token>) {

    let doVar;
    let times;

    if (tokens.length === 2) {
        doVar = "$do" + loopVarIndex;
        loopVarIndex += 1;
        times = tokens[1].value;
    } else {
        doVar = tokens[1].value;
        times = tokens[2].value;
    }

    return `for(let ${doVar} = 0; ${doVar} < ${times}; ${doVar}++) {`
}

function getEndDoForTokens(tokens: Array<Token>) {
    return "}";
}

function getForEachStartForTokens(tokens: Array<Token>) {

    let itVar;
    let listVar;

    itVar = tokens[1].value;

    if (tokens.length === 3) {
        listVar = tokens[2].value;
    } else {
        listVar = itVar;
    }

    return `${listVar}.forEach(${itVar} => {`;
}

function getEndEachForTokens(tokens: Array<Token>) {
    return "});";
}

function getObjectCreationStatement(tokens: Array<Token>, creatorFunc: string, ...params): Array<string> {
    const add = [];
    add.push(`${MODULE}.${creatorFunc}("${tokens[1].value}"`)
    add.push(...params);

    return [
        getObjectVariableSetter(tokens[1], add.join(", ") + ")") + ";",
        `${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`
    ];
}

export class JSPublisher {


    public static getJSLine(code): Array<string> {
        const tokens = Parser.parseLine(code);
        const opCode = getOpCode(tokens);

        const r = [];

        switch (opCode) {
            case AppConfig.Runtime.Opcodes.Circle.Legacy:
            case AppConfig.Runtime.Opcodes.Circle.CenterRadius:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "circleCenterRadius",
                    getXYFromToken(tokens[3]),
                    getExpressionFromToken(tokens[4])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Circle.CenterPoint:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "circleCenterPoint",
                    getXYFromToken(tokens[3]),
                    getXYFromToken(tokens[4])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Circle.PointPoint:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "circlePointPoint",
                    getXYFromToken(tokens[3]),
                    getXYFromToken(tokens[4])
                ));
                break;


            case AppConfig.Runtime.Opcodes.Rect.PointPoint:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectanglePointPoint",
                    getXYFromToken(tokens[3]),
                    getXYFromToken(tokens[4])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Rect.CenterWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleCenter",
                    getXYFromToken(tokens[3]),
                    getExpressionFromToken(tokens[4]),
                    getExpressionFromToken(tokens[5])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Rect.TopLeftWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleTopLeft",
                    getXYFromToken(tokens[3]),
                    getExpressionFromToken(tokens[4]),
                    getExpressionFromToken(tokens[5])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Rect.TopRightWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleTopRight",
                    getXYFromToken(tokens[3]),
                    getExpressionFromToken(tokens[4]),
                    getExpressionFromToken(tokens[5])
                ));
                break;
            case AppConfig.Runtime.Opcodes.Rect.BottomLeftWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleBottomLeft",
                    getXYFromToken(tokens[3]),
                    getExpressionFromToken(tokens[4]),
                    getExpressionFromToken(tokens[5])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Rect.BottomRightWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleBottomRight",
                    getXYFromToken(tokens[3]),
                    getExpressionFromToken(tokens[4]),
                    getExpressionFromToken(tokens[5])
                ));
                break;


            case AppConfig.Runtime.Opcodes.Line.PointPoint:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "linePointPoint",
                    getXYFromToken(tokens[3]),
                    getXYFromToken(tokens[4])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Line.PointVectorLength:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.linePointVectorLength("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getXYFromToken(tokens[4])}, ` +
                    `${getExpressionFromToken(tokens[5])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;

            case AppConfig.Runtime.Opcodes.Do:
                r.push(getDoStartForTokens(tokens));
                break;

            case AppConfig.Runtime.Opcodes.EndDo:
                r.push(getEndDoForTokens(tokens));
                break;

            case AppConfig.Runtime.Opcodes.ForEach:
                r.push(getForEachStartForTokens(tokens));
                break;

            case AppConfig.Runtime.Opcodes.EndEach:
                r.push(getEndEachForTokens(tokens));
                break;


            case AppConfig.Runtime.Opcodes.Scale.Factor:
                r.push(`${MODULE}.scaleObject(` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getExpressionFromToken(tokens[2])}, ` +
                    `${getExpressionFromToken(tokens[3])}, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[4])}.x, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[4])}.y` +
                    `);`)
                break;
            case AppConfig.Runtime.Opcodes.Scale.FactorUniform:
                r.push(`${MODULE}.scaleObjectUniform(` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getExpressionFromToken(tokens[2])}, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[3])}.x, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[3])}.y` +
                    `);`)
                break;
            case AppConfig.Runtime.Opcodes.Scale.ToPoint:
                r.push(`${MODULE}.scaleObjectToPoint(` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[2])}.x, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[2])}.y, ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[4])}.x, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[4])}.y` +
                    `);`)
                break;

            case AppConfig.Runtime.Opcodes.Scale.ToPointUniform:
                r.push(`${MODULE}.scaleObjectToPointUniform(` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[2])}.x, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[2])}.y, ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[4])}.x, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[4])}.y` +
                    `);`)
                break;


            case AppConfig.Runtime.Opcodes.Move.ByVector:
                r.push(`${MODULE}.moveObject(` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getPoiFromRegisterAt(tokens[1])}, ` +
                    `${getXYFromToken(tokens[2])}` +
                    `);`);
                break;

            case AppConfig.Runtime.Opcodes.Move.AlongX:
                r.push(`${MODULE}.moveObjectAlongX(` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getPoiFromRegisterAt(tokens[1])}, ` +
                    `${getExpressionFromToken(tokens[2])}` +
                    `);`);
                break;
            case AppConfig.Runtime.Opcodes.Move.AlongY:
                r.push(`${MODULE}.moveObjectAlongY(` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getPoiFromRegisterAt(tokens[1])}, ` +
                    `${getExpressionFromToken(tokens[2])}` +
                    `);`);
                break;

            case AppConfig.Runtime.Opcodes.Move.ToPoint:
                r.push(`${MODULE}.moveObjectToPoint
                (` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getPoiFromRegisterAt(tokens[1])}, ` +
                    `${getObjectVariable(tokens[2])}, ` +
                    `${getPoiFromRegisterAt(tokens[2])}` +
                    `);`);
                break;

            default:
                UNREACHABLE(`Exporting of OPCODE "${opCode}" is not implemented.`);
        }
        return r;
    }

    public static getRawJSCode(code): Array<string> {
        const lines = code.trim().split("\n");

        const r = [];

        lines.forEach(l => r.push(...JSPublisher.getJSLine(l)));

        return r;
    }

    public static getCodeForExpression(token: Token): string {

        const walk = (token: Token): string => {
            switch (token.type) {
                case TokenTypes.REGISTER:
                case TokenTypes.NONLOCALREGISTER:
                case TokenTypes.REGISTERAT:
                case TokenTypes.NUMBER:
                case TokenTypes.OPERATOR:
                    return token.value as string;

                case TokenTypes.EXPRESSION:
                    return walk(token.value[0]) + " " +
                        walk(token.value[1]) + " " +
                        walk(token.value[2]);

                case TokenTypes.MATHFUNC:
                    return `${MODULE}.${token.value[0].value}(${walk(token.value[1])})`


                default:
                    UNREACHABLE(`Unsupported token type ${TokenTypes[token.type]} in expression`);

            }
        }

        return walk(token);

    }

    public static getCodeForField(field: DataField): string {
        switch (field.type) {
            case DataFieldType.Number:
                return `${field.name} = ${field.value}`;

            case DataFieldType.List:
                return `${field.name} = [${( field.value as Array<number> ).join(", ")}]`;

            case DataFieldType.String:
                try {
                    const token = Parser.parseExpression(field.value as string);
                    if (token) {
                        return `${field.name} = ${JSPublisher.getCodeForExpression(token)}`;
                    }
                } catch (e) {
                    return `${field.name} = "${field.value}"`;
                }
                return `${field.name} = "${field.value}"`;

            case DataFieldType.Table:
                return `${field.name} =  [${( field.value as Array<any> ).map(r => JSON.stringify(r)).join(", ")}]`;

            default:
                UNREACHABLE();
        }
    }

    public static getArgsCode(args: Array<DataField>): string {
        const a = args.map(a => JSPublisher.getCodeForField(a));
        return a.join(", ");
    }

    public static getFieldsCode(fields: Array<DataField>): Array<string> {
        return fields.map(f => `const ${JSPublisher.getCodeForField(f)};`);
    }


    public static getDrawingFunctionBody(code: string,
                                         fields: Array<DataField>,
                                         publishedNames: Array<string>): Array<string> {
        const res = [];
        res.push(...JSPublisher.getFieldsCode(fields));
        res.push(`const ${OBJECT_MANAGER} = dapentry.makeObjectManager();`)
        res.push(...JSPublisher.getRawJSCode(code));
        res.push(`return [${publishedNames.map(n => `${OBJECT_MANAGER}("${n}")`).join(", ")}];`);

        return res;
    }

    public static getDrawingFunctionCode(
        code: string,
        args: Array<DataField>,
        fields: Array<DataField>,
        publishedNames: Array<string>): Array<string> {

        const res = [`function ${DRAWING_FUNCTION_NAME}(${JSPublisher.getArgsCode(args)}) {`];
        res.push(...JSPublisher.getDrawingFunctionBody(code, fields, publishedNames))
        res.push("}");
        return res;
    }

    public static getRenderDrawingFunctionCode(args: Array<DataField>): Array<string> {
        const res = [];
        res.push(`function ${RENDER_DRAWING_FUNCTION_NAME}(${JSPublisher.getArgsCode(args)}) {`)
        res.push(`\trenderObjects(${DRAWING_FUNCTION_NAME}(${args.map(a => a.name).join(",\n")}));`)
        res.push("}");
        return res;
    }

    public static getDrawingModule(
        code: string,
        aspect: AspectRatio,
        height: number,
        args: Array<DataField>,
        fields: Array<DataField>,
        publishedNames: Array<string>): string {

        const r = jsPublishTemplate
            .replace("<DRAWING_FUNCTION_NAME>", DRAWING_FUNCTION_NAME)
            .replace("<VIEWBOX_HEIGHT>", "" + height)
            .replace("<ASPECT_RATIO>", AspectRatio[aspect])
            .replace("<DRAWING_FUNCTION>", JSPublisher.getDrawingFunctionCode(code, args, fields, publishedNames).join("\n"))
            .replace("<RENDER_DRAWING_FUNCTION>", JSPublisher.getRenderDrawingFunctionCode(args).join("\n"));

        return r;
    }
}