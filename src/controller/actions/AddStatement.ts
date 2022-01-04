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
        const index = this.component.getCodeManager().code.length - 1;
        const tokens = Parser.parseLine(this._statement);
        this.appModel.push({index, tokens}).to("segmentedCode")
        return null;
    }
}