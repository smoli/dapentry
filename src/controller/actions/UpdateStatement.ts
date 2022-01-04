import Component from "../../Component";
import {Parser} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";

export class UpdateStatement extends BaseAction {
    private readonly _statement: string;
    private readonly _index: number;

    constructor(component: Component, index: number, statement: string) {
        super(component);
        this._statement = statement;
        this._index = index;
    }

    perform() {
        this.component.getCodeManager().updateStatement(this._index, this._statement);
        const tokens = Parser.parseLine(this._statement);
        this.appModel.set("segmentedCode", this._index).to({index: this._index, tokens});
        return null;
    }

}