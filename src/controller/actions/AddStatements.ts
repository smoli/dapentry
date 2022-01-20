import Component from "../../Component";
import {Parser} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";

export class AddStatements extends BaseAction {
    private readonly _statements: string[];
    private readonly _insertionIndex: number;

    constructor(component: Component, statements: string[], insertionIndex: number = -1) {
        super(component);
        this._statements = statements;
        this._insertionIndex = insertionIndex;
    }

    _execute() {
        if (this._insertionIndex !== -1) {
            this.appModel.insertStatements(this._statements, this._insertionIndex);
        } else {
            this.appModel.addStatements(this._statements);
        }
    }
}