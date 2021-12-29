import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {Tool} from "./Tool";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject} from "../Objects/GrObject";
import {state} from "../../runtime/tools/StateMachine";


enum States {
    Wait = "TransformationTool.Wait",
    Done = "TransformationTool.Done",
    CenterHandle = "TransformationTool.CenterHandle"
}

enum Events {
    CenterDown,
    CenterUp
}

export class TransformationTool extends Tool {

    protected _selection: Array<GrObject>;

    constructor(renderer: ObjectRenderer) {
        super(renderer, States.Wait, States.Done);

        this._state.add(state(States.Wait), Events.CenterDown, state(States.CenterHandle));
        this._state.add(state(States.CenterHandle), Events.CenterUp, state(States.Wait));
    }

    finish() {
        super.finish();
        this._renderer.removeAllHandles(this._object);
    }

    initialize() {
        const bb = this._object.boundingBox;
        this._renderer.renderHandle(this._object, 0, 0, this._onHandleEvent.bind(this), "Center");
        // this._renderer.renderHandle(this._object, -bb.w / 2, 0, this._onHandleEvent.bind(this), "Left");
        // this._renderer.renderHandle(this._object, bb.w / 2, 0, this._onHandleEvent.bind(this), "Right");
        // this._renderer.renderHandle(this._object, 0, -bb.h / 2, this._onHandleEvent.bind(this), "Top");
        // this._renderer.renderHandle(this._object, 0, bb.h / 2, this._onHandleEvent.bind(this), "Bottom");
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, data: any): void {

        if (data === "Center") {
            if (eventData.interactionEvent === InteractionEvents.MouseDown) {
                this._state.next(Events.CenterDown);
            } else if (eventData.interactionEvent === InteractionEvents.MouseUp) {
                this._state.next(Events.CenterUp);
            }
        }
    }

    set selection(value: Array<GrObject>) {
        let wasActive = false;
        if (this._selection && this._selection.length) {
            this.finish();
            wasActive = true;
        }

        this._selection = value;
        if (value.length != 1) {
            throw new Error("Tool only works on 1 object atm.")
        }

        if (wasActive) {
            this.initialize();
        }

    }

    protected get _object(): GrObject {
        return this._selection[0];
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {

        if (this._state.state.id === States.CenterHandle) {
            if (interactionEvent === InteractionEvents.MouseMove) {
                this._object.x += eventData.dx;
                this._object.y += eventData.dy;
                this._renderer.render(this._object, true);
            }
        }


        return true;
    }

    public get result(): any {
        return null;
    }
}