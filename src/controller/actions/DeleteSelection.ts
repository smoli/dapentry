import Component from "../../Component";
import {Parser} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";
import {GrObject} from "../../Geo/GrObject";

export class DeleteSelection extends BaseAction {

    constructor(component: Component) {
        super(component);

    }

    _execute() {
        this.appModel.deleteSelection();
    }
}