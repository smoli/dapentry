import {JSONModelAccess} from "../JSONModelAccess";
import {CodeManager} from "../runtime/CodeManager";
import {Parser} from "../runtime/interpreter/Parser";

export class AppModel extends JSONModelAccess {

    private readonly _codeManager: CodeManager;

    constructor(model, codeManager:CodeManager) {
        super(model);
        this._codeManager = codeManager;
    }

    get codeManager(): CodeManager {
        return this._codeManager;
    }

    protected updateSegmentedCode() {
        this.set("segmentedCode")
            .to(
                this._codeManager.annotatedCode
                    .map(c => {
                        return {
                            index: c.originalLine,
                            tokens: Parser.parseLine(c.code)
                        }
                    })
            );
    }

    protected updateCodeString() {
        this.set("codeString").to(this._codeManager.code.join("\n"));
    }

    addStatement(code: string) {
        this.codeManager.addStatement(code);
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    addStatements(code: Array<string>) {
        code.forEach(c => this.codeManager.addStatement(c));
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    replaceCode(code: Array<string>) {
        this._codeManager.clear();
        code.forEach(c => this.codeManager.addStatement(c));
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    replaceStatement(indexToReplace:number, newStatements:(string|Array<string>)) {
        let first;
        if (Array.isArray(newStatements)) {
            first = newStatements[0]
        } else {
            first = newStatements;
        }

        this._codeManager.updateStatement(indexToReplace, first);
        if (Array.isArray(newStatements)) {

            for (let i = 1; i < newStatements.length; i++) {
                this._codeManager.insertStatement(newStatements[i], indexToReplace + i)
            }
        }
        this.updateSegmentedCode();
        this.updateCodeString();
    }
}