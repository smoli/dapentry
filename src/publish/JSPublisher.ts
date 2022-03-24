import {Parser, Token, TokenTypes} from "../runtime/interpreter/Parser";
import {ASSERT, UNREACHABLE} from "../core/Assertions";
import {AppConfig} from "../core/AppConfig";
import {AspectRatio} from "../geometry/AspectRatio";
import {DataField, DataFieldType} from "../state/modules/Data";
import {jsPublishTemplate} from "./jsPublishTemplate";


const OBJECT_MAP = "__objects";
const MODULE = "dapentry";
const DRAWING_FUNCTION_NAME = "drawing";

export class JSPublisher {

    protected static getOpCode(tokens: Array<Token>): string {
        ASSERT(tokens[0].type === TokenTypes.OPCODE, `${tokens[0]} is no opcode token`)
        return tokens[0].value as string;
    }

    protected static getXYFromPointToken(token: Token): string {
        ASSERT(token.type === TokenTypes.POINT, `${token} is no point token`);
        return `${JSPublisher.getNumberFromToken(token.value[0])}, ${JSPublisher.getNumberFromToken(token.value[1])}`;
    }

    protected static getNumberFromToken(token: Token): string {
        ASSERT(token.type === TokenTypes.NUMBER, `${token} is no number token`);
        return "" + token.value;
    }

    protected static getObjectVariable(token: Token): string {
        return `${OBJECT_MAP}.${token.value}`;
    }

    public static getJSLine(code): Array<string> {
        const tokens = Parser.parseLine(code);
        const opCode = JSPublisher.getOpCode(tokens);

        const r = [];

        switch (opCode) {
            case AppConfig.Runtime.Opcodes.Circle.CenterRadius:
                r.push(`${JSPublisher.getObjectVariable(tokens[1])} = new ${MODULE}.Circle("${tokens[1].value}", ${JSPublisher.getXYFromPointToken(tokens[3])}, ${JSPublisher.getNumberFromToken(tokens[4])});`);
                r.push(`${JSPublisher.getObjectVariable(tokens[1])}.style = ${tokens[2].value};`);
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
        return args.map(a => JSPublisher.getCodeForField(a)).join(", ");
    }

    public static getFieldsCode(fields: Array<DataField>): Array<string> {
        return fields.map(f => `const ${JSPublisher.getCodeForField(f)};`);
    }


    public static getDrawingFunctionCode(
        code: string,
        aspect: AspectRatio,
        args: Array<DataField>,
        fields: Array<DataField>,
        publishedNames: Array<string>): Array<string> {

        const res = [`function ${DRAWING_FUNCTION_NAME}(${JSPublisher.getArgsCode(args)}) {`];
        res.push(...JSPublisher.getFieldsCode(fields));
        res.push(`const ${OBJECT_MAP} = {};`)
        res.push(`__objects.canvas = __canvas;`);

        res.push(...JSPublisher.getRawJSCode(code));

        res.push(`return [${publishedNames.map(n => `${OBJECT_MAP}.${n}`).join(", ")}];`);
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
            .replace("<DRAWING_FUNCTION>", this.getDrawingFunctionCode(code, aspect, args, fields, publishedNames).join("\n"))

        return r;
    }
}