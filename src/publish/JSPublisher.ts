import {Parser, Token, TokenTypes} from "../runtime/interpreter/Parser";
import {ASSERT, UNREACHABLE} from "../core/Assertions";
import {AppConfig} from "../core/AppConfig";
import {AspectRatio} from "../geometry/AspectRatio";
import {DataField, DataFieldType} from "../state/modules/Data";
import {jsPublishTemplate} from "./jsPublishTemplate";


const OBJECT_MAP = "__objects";
const MODULE = "dapentry";
const DRAWING_FUNCTION_NAME = "drawing";
const CANVAS = "__canvas";

export function getOpCode(tokens: Array<Token>): string {
    ASSERT(tokens[0].type === TokenTypes.OPCODE, `${tokens[0]} is no opcode token`)
    return tokens[0].value as string;
}

export function getXYFromToken(token: Token): string {
    if (token.type === TokenTypes.POINT) {
        return `${getNumberFromToken(token.value[0])}, ${getNumberFromToken(token.value[1])}`;
    } else if (token.type === TokenTypes.REGISTERAT || token.type === TokenTypes.REGISTER) {
        return `${getVariableName(token)}.x, ${getVariableName(token)}.y`
    }

    UNREACHABLE();
}

export function getNumberFromToken(token: Token): string {
    ASSERT(token.type === TokenTypes.NUMBER, `${token} is no number token`);
    return "" + token.value;
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
    return `${OBJECT_MAP}["${token.value}"]`;
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

export class JSPublisher {


    public static getJSLine(code): Array<string> {
        const tokens = Parser.parseLine(code);
        const opCode = getOpCode(tokens);

        const r = [];

        switch (opCode) {
            case AppConfig.Runtime.Opcodes.Circle.Legacy:
            case AppConfig.Runtime.Opcodes.Circle.CenterRadius:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.circleCenterRadius("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getNumberFromToken(tokens[4])});`);
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;

            case AppConfig.Runtime.Opcodes.Circle.CenterPoint:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.circleCenterPoint("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getXYFromToken(tokens[4])});`);
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;

            case AppConfig.Runtime.Opcodes.Circle.PointPoint:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.circlePointPoint("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getXYFromToken(tokens[4])});`);
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;


            case AppConfig.Runtime.Opcodes.Rect.PointPoint:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.rectanglePointPoint("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getXYFromToken(tokens[4])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;
            case AppConfig.Runtime.Opcodes.Rect.CenterWH:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.rectangleCenter("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getNumberFromToken(tokens[4])}, ` +
                    `${getNumberFromToken(tokens[5])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;
            case AppConfig.Runtime.Opcodes.Rect.TopLeftWH:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.rectangleTopLeft("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getNumberFromToken(tokens[4])}, ` +
                    `${getNumberFromToken(tokens[5])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;
            case AppConfig.Runtime.Opcodes.Rect.TopRightWH:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.rectangleTopRight("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getNumberFromToken(tokens[4])}, ` +
                    `${getNumberFromToken(tokens[5])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;
            case AppConfig.Runtime.Opcodes.Rect.BottomLeftWH:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.rectangleBottomLeft("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getNumberFromToken(tokens[4])}, ` +
                    `${getNumberFromToken(tokens[5])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;

            case AppConfig.Runtime.Opcodes.Rect.BottomRightWH:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.rectangleBottomRight("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getNumberFromToken(tokens[4])}, ` +
                    `${getNumberFromToken(tokens[5])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;


            case AppConfig.Runtime.Opcodes.Line.PointPoint:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.linePointPoint("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getXYFromToken(tokens[4])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
                break;

            case AppConfig.Runtime.Opcodes.Line.PointVectorLength:
                r.push(`${getObjectVariable(tokens[1])} = ${MODULE}.linePointVectorLength("${tokens[1].value}", ` +
                    `${getXYFromToken(tokens[3])}, ` +
                    `${getXYFromToken(tokens[4])}, ` +
                    `${getNumberFromToken(tokens[5])}` +
                    ");"
                );
                r.push(`${getObjectVariable(tokens[1])}.style = ${MODULE}.${tokens[2].value};`);
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
                `${field.name} = [${( field.value as Array<number> ).join(", ")}]`;
                break;

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
        res.push(`const ${OBJECT_MAP} = {};`)
        res.push(...JSPublisher.getRawJSCode(code));
        res.push(`return [${publishedNames.map(n => `${OBJECT_MAP}["${n}"]`).join(", ")}];`);

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
            .replace("<DRAWING_FUNCTION>", this.getDrawingFunctionCode(code, args, fields, publishedNames).join("\n"))

        return r;
    }
}