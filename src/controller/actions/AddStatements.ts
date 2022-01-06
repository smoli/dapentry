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
        for (const s of this._statements) {
            this.component.getCodeManager().addStatement(s);
        }
        this.appModel.addStatements(this._statements);
        return null;
    }
}