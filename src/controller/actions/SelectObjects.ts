import Component from "../../Component";
import {Parser} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";
import {GrObject} from "../../Geo/GrObject";

export class SelectObjects extends BaseAction {
    private readonly _objects: Array<GrObject>;

    constructor(component: Component, objects: Array<GrObject>) {
        super(component);
        this._objects = objects;
    }

    _execute() {
        this.appModel.setSelectedObjects(this._objects);
    }
}