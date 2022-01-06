import Component from "../../Component";
import {Parser} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";

export class AddStatement extends BaseAction {
    private readonly _statement: string;

    constructor(component: Component, statement: string) {
        super(component);
        this._statement = statement;
    }

    perform() {
        this.component.getCodeManager().addStatement(this._statement);
        this.appModel.addStatement(this._statement);
    }
}