import {JSONModelAccess} from "../JSONModelAccess";
import {Parser, TokenTypes} from "../runtime/interpreter/Parser";
import {CodeManager} from "../runtime/CodeManager";

export class AppModel extends JSONModelAccess {

    private _codeManager: CodeManager;

    constructor(model, codeManager:CodeManager) {
        super(model);
        this._codeManager = codeManager;
    }

    get codeManager(): CodeManager {
        return this._codeManager;
    }

    addStatement(code: string) {
        this.codeManager.addCodeString(code);
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