import Component from "../../Component";
import {Parser} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";

export class AddStatements extends BaseAction {
    private readonly _statements: string[];

    constructor(component: Component, statements: string[]) {
        super(component);
        this._statements = statements;
    }

    perform() {
        let index = this.component.getCodeManager().code.length;
        for (const s of this._statements) {
            this.component.getCodeManager().addStatement(s);
            const tokens = Parser.parseLine(s);
            this.appModel.push({index, tokens}).to("segmentedCode")
            index++;
        }


        const codeString = this.appModel.get("codeString");
        this.appModel.set("codeString").to(codeString + "\n" + this._statements.join("\n"));

        return null;
    }
}