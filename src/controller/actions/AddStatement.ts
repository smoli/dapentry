import Component from "../../Component";
import {Parser} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";

export class AddStatement extends BaseAction {
    private readonly _statement: string;
    private _insertionIndex: number;

    constructor(component: Component, statement: string, insertionIndex: number = -1) {
        super(component);
        this._statement = statement;
        this._insertionIndex = insertionIndex;
    }

    perform() {
        if (this._insertionIndex !== -1) {
            this.appModel.insertStatement(this._statement, this._insertionIndex);
        } else {
            this.appModel.addStatement(this._statement);

        }
    }
}