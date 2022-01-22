import Component from "../../Component";
import {Parser, TokenTypes} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";
import {CodeManager} from "../../runtime/CodeManager";
import {data} from "jquery";

export class WrapInLoop extends BaseAction {

    constructor(component: Component) {
        super(component);
    }

    _execute() {
        const sel = this.appModel.getSelectedCodeLines();
        const from = Math.min(...sel.map(s => s.index));
        const to = Math.max(...sel.map(s => s.index));
        this.appModel.insertStatement("DO 2", from);
        this.appModel.insertStatement("ENDDO", to + 2);  // + 2 because indexes change when inserting "DO"
    }

}