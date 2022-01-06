import {JSONModelAccess} from "../JSONModelAccess";
import {Parser, TokenTypes} from "../runtime/interpreter/Parser";

export class AppModel extends JSONModelAccess {

    constructor(model) {
        super(model);
    }

    addStatement(code: string) {
        const index = this.get("segmentedCode").length;
        const tokens = Parser.parseLine(code);
        this.push({
            index,
            tokens: tokens.filter(t => t.type !== TokenTypes.ANNOTATION),
            annotations: tokens.filter(t => t.type !== TokenTypes.ANNOTATION).map(t => t.value)

        }).to("segmentedCode")

        const codeString = this.get("codeString");
        this.set("codeString").to(codeString + "\n" + code);
    }

    addStatements(code: Array<string>) {
        code.forEach(c => this.addStatement(c));
    }
}