import {InteractionEventData, InteractionEvents} from "../controls/drawing/InteractionEvents";
import {ObjectRenderer} from "../controls/drawing/Objects/ObjectRenderer";
import {GrObject} from "../Geo/GrObject";
import {state} from "../runtime/tools/StateMachine";
import {SnapInfo, Tool} from "./Tool";


enum States {
    Wait = "SelectTool.Wait",
    Done = "SelectTool.Done",

}

export class SelectTool extends Tool {

    protected _selection: Array<GrObject> = [];

    constructor(renderer: ObjectRenderer) {
        super(renderer);
        this.setWaitDoneStates(States.Wait, States.Done);

        this._state.add(state(States.Wait), 0, state(States.Wait));
        this._state.add(state(States.Done), 0, state(States.Done));
    }


    get isDone(): boolean {
        return false;
    }

    initialize() {
        if (!this._object) {
            return;
        }

        this._renderer.renderBoundingRepresentation(this._object);
    }

    abort() {
        if (this._object) {
            // this._renderer.removeAllHandles(this._object);
            this._renderer.removeBoundingRepresentation(this._object);
        }
        super.abort();
    }

    set selection(value: Array<GrObject>) {
        if (this._object) {
            this._renderer.removeAllHandles(this._object);
        }

        this.finish()
        this.reset();

        this._selection = value;
        this.initialize();
    }

    protected get _object(): GrObject {
        return this._selection.length && this._selection[0];
    }

    update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {

        return this._update(interactionEvent, this.dontSnap(eventData));
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {
        let eventData = snapInfo.event;
        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }
        return false;
    }

    public get result(): any {
            return null;
    }
}