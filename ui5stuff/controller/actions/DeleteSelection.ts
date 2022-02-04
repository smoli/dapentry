import Component from "../../Component";
import {Parser} from "../../../src/runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";
import {GrObject} from "../../../src/geometry/GrObject";

export class DeleteSelection extends BaseAction {

    constructor(component: Component) {
        super(component);

    }

    _execute() {
        this.appState.deleteSelection();
    }
}