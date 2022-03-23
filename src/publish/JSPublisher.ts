import {Parser, Token, TokenTypes} from "../runtime/interpreter/Parser";
import {ASSERT, UNREACHABLE} from "../core/Assertions";
import {AppConfig} from "../core/AppConfig";
import {AspectRatio} from "../geometry/AspectRatio";
import {DataField, DataFieldType} from "../state/modules/Data";


const OBJECT_MAP = "__objects";
const CANVAS = "__canvas";
const STYLE = "$styles";
const MODULE = "dapentry";

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

    public static getCanvasCreation(aspect: AspectRatio, height: number): string {

        let ar = "create_1_1";

        switch (aspect) {
            case AspectRatio.ar1_1:
                ar = "create_1_1";
                break;
            case AspectRatio.ar3_2:
                ar = "create_3_2";
                break;
            case AspectRatio.ar4_3:
                ar = "create_4_3";
                break;
            case AspectRatio.ar16_10:
                ar = "create_16_10";
                break;
            case AspectRatio.ar16_9:
                ar = "create_16_9";
                break;

        }

        return `${OBJECT_MAP}.${CANVAS} = dapentry.Canvas.${ar}(${height});`;
    }

    protected static getStyleCode(): Array<string> {
        const r = [];

        r.push(`const ${STYLE} = {`);
        r.push(`\tdefault: {`)
        r.push(`\t\t"fillColor": "#FF7F50",`);
        r.push(`\t\t"strokeColor": "#FF7F50",`);
        r.push(`\t\t"fillOpacity": 0.2,`);
        r.push(`\t\t"strokeWidth": 2,`);
        r.push(`\t},`);

        r.push(`\ttextDefault: {`)
        r.push(`\t\t"fillColor": "#FF7F50",`);
        r.push(`\t\t"strokeColor": "#FF7F50",`);
        r.push(`\t\t"fillOpacity": 1,`);
        r.push(`\t\t"strokeWidth": 0,`);
        r.push(`\t\t"textAlignment": 0,`);
        r.push(`\t\t"verticalAlignment": 0,`);
        r.push(`\t\t"fontFamily": "Sans-serif",`);
        r.push(`\t\t"fontSize": 50,`);
        r.push(`\t}`);

        r.push(`};`);

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
        functionName: string,
        aspect: AspectRatio,
        width: number, height: number,
        args: Array<DataField>,
        fields: Array<DataField>,
        publishedNames: Array<string>): Array<string> {

        const res = [`function ${functionName}(${JSPublisher.getArgsCode(args)}) {`];
        res.push(...JSPublisher.getFieldsCode(fields));
        res.push(`const ${OBJECT_MAP} = {};`)
        res.push(JSPublisher.getCanvasCreation(aspect, height));
        res.push(...JSPublisher.getStyleCode());

        res.push(...JSPublisher.getRawJSCode(code));

        res.push(`return [${publishedNames.map(n => `${OBJECT_MAP}.${n}`).join(", ")}];`);
        res.push("}");
        return res;
    }

    public static getDrawingModule(
        code: string,
        functionName: string,
        aspect: AspectRatio,
        width: number, height: number,
        args: Array<DataField>,
        fields: Array<DataField>,
        publishedNames: Array<string>): Array<string> {

        const r = [];

        r.push(`import * as dapentry from "./dist/dapentryLib.mjs";`);
        r.push("\n");
        r.push("// created with dapentry, https://www.dapentry.com");
        r.push(`// this software uses d3, https://d3js.org: Copyright 2010-2022 Mike Bostock, License: https://github.com/d3/d3/blob/main/LICENSE`);
        r.push("\n");

        r.push(...this.getDrawingFunctionCode(code, functionName, aspect, width, height, args, fields, publishedNames))

        return r;
    }
}