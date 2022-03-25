import {Parser, Token, TokenTypes} from "../runtime/interpreter/Parser";
import {ASSERT, UNREACHABLE} from "../core/Assertions";
import {AppConfig} from "../core/AppConfig";
import {AspectRatio} from "../geometry/AspectRatio";
import {DataField, DataFieldType} from "../state/modules/Data";
import {jsPublishTemplate} from "./jsPublishTemplate";


const OBJECT_MANAGER = "__objects";
const MODULE = "dapentry";
const DRAWING_FUNCTION_NAME = "drawing";
const CANVAS = "__canvas";

export function getOpCode(tokens: Array<Token>): string {
    ASSERT(tokens[0].type === TokenTypes.OPCODE, `${tokens[0]} is no opcode token`)
    return tokens[0].value as string;
}

export function getXYFromToken(token: Token): string {
    if (token.type === TokenTypes.POINT) {
        return `${getNumOrRegFromToken(token.value[0])}, ${getNumOrRegFromToken(token.value[1])}`;
    } else if (token.type === TokenTypes.REGISTERAT || token.type === TokenTypes.REGISTER) {
        return `${getVariableName(token)}.x, ${getVariableName(token)}.y`
    }

    UNREACHABLE();
}

export function getNumOrRegFromToken(token: Token): string {
    ASSERT(token.type === TokenTypes.NUMBER || token.type === TokenTypes.REGISTER, `${token} is no number token`);
    return "" + token.value;
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
    objects[token.value as string] = true;
    return `${OBJECT_MANAGER}("${token.value}")`;
}

export function getObjectVariableSetter(token: Token, code: string): string {
    objects[token.value as string] = true;
    return `${OBJECT_MANAGER}("${token.value}", ${code})`;
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
                    getNumOrRegFromToken(tokens[4])
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
                    getNumOrRegFromToken(tokens[4]),
                    getNumOrRegFromToken(tokens[5])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Rect.TopLeftWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleTopLeft",
                    getXYFromToken(tokens[3]),
                    getNumOrRegFromToken(tokens[4]),
                    getNumOrRegFromToken(tokens[5])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Rect.TopRightWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleTopRight",
                    getXYFromToken(tokens[3]),
                    getNumOrRegFromToken(tokens[4]),
                    getNumOrRegFromToken(tokens[5])
                ));
                break;
            case AppConfig.Runtime.Opcodes.Rect.BottomLeftWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleBottomLeft",
                    getXYFromToken(tokens[3]),
                    getNumOrRegFromToken(tokens[4]),
                    getNumOrRegFromToken(tokens[5])
                ));
                break;

            case AppConfig.Runtime.Opcodes.Rect.BottomRightWH:
                r.push(...getObjectCreationStatement(
                    tokens,
                    "rectangleBottomRight",
                    getXYFromToken(tokens[3]),
                    getNumOrRegFromToken(tokens[4]),
                    getNumOrRegFromToken(tokens[5])
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
                    `${getNumOrRegFromToken(tokens[5])}` +
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
                    `${getNumOrRegFromToken(tokens[2])}, ` +
                    `${getNumOrRegFromToken(tokens[3])}, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[4])}.x, ` +
                    `${getObjectVariable(tokens[1])}.${getLiteralFromStringToken(tokens[4])}.y` +
                    `);`)
                break;
            case AppConfig.Runtime.Opcodes.Scale.FactorUniform:
                r.push(`${MODULE}.scaleObjectUniform(` +
                    `${getObjectVariable(tokens[1])}, ` +
                    `${getNumOrRegFromToken(tokens[2])}, ` +
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

    public static getCodeForField(field: DataField): string {
        switch (field.type) {
            case DataFieldType.Number:
                return `${field.name} = ${field.value}`;

            case DataFieldType.List:
                return `${field.name} = [${( field.value as Array<number> ).join(", ")}]`;

            case DataFieldType.String:
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

        return r;
    }
}