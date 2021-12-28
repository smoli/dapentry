import { InteractionEvents, InteractionEventData } from "../InteractionEvents";
import {Tool} from "./Tool";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject} from "../Objects/GrObject";


enum States {
    Wait = "TransformationTool.Wait",
    Done = "TransformationTool.Done"
}

export class TransformationTool extends Tool {

    protected _selection:Array<GrObject>;

    constructor(renderer:ObjectRenderer) {
        super(renderer, States.Wait, States.Done);
    }


    initialize() {

    }

    set selection(value: Array<GrObject>) {
        this._selection = value;
        if (value.length != 1) {
            throw new Error("Tool only works on 1 object atm.")
        }
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {
        throw new Error("Method not implemented.");
    }
    public get result(): any {
        throw new Error("Method not implemented.");
    }
}