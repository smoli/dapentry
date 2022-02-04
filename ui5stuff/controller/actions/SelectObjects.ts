import Component from "../../Component";
import {Parser} from "../../../src/runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";
import {GrObject} from "../../../src/geometry/GrObject";

export class SelectObjects extends BaseAction {
    private readonly _objects: Array<GrObject>;

    constructor(component: Component, objects: Array<GrObject>) {
        super(component);
        this._objects = objects;
    }

    _execute() {
        this.appState.setSelectedObjects(this._objects);
    }
}