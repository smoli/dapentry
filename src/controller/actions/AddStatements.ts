import Component from "../../Component";
import {BaseAction} from "./BaseAction";

export class AddStatements extends BaseAction {
    private readonly _statements: string[];

    constructor(component: Component, statements: string[]) {
        super(component);
        this._statements = statements;
    }

    _execute() {
        let index = this.appModel.getLastSelectedCodeLineIndex();

        if (index !== -1) {
            this.appModel.insertStatements(this._statements, index + 1);
            this.appModel.setSelectedCodeLines([index + this._statements.length])
        } else {
            this.appModel.addStatements(this._statements);
            index = Math.max(...this.appModel.getSegmentedCode().map(s => s.index));
            this.appModel.setSelectedCodeLines([index])
        }


    }
}