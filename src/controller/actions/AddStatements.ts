import Component from "../../Component";
import {BaseAction} from "./BaseAction";

export class AddStatements extends BaseAction {
    private readonly _statements: string[];

    constructor(component: Component, statements: string[]) {
        super(component);
        this._statements = statements;
    }

    _execute() {
        let index = this.appState.getLastSelectedCodeLineIndex();

        if (index !== -1) {
            this.appState.insertStatements(this._statements, index + 1);
            this.appState.setSelectedCodeLines([index + this._statements.length])
        } else {
            this.appState.addStatements(this._statements);
            index = Math.max(...this.appState.getSegmentedCode().map(s => s.index));
            this.appState.setSelectedCodeLines([index])
        }


    }
}