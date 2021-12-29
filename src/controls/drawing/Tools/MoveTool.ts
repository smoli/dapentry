import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {Tool} from "./Tool";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject} from "../Objects/GrObject";
import {state} from "../../../runtime/tools/StateMachine";


enum States {
    Wait = "MoveTool.Wait",
    Done = "MoveTool.Done",
    CenterHandle = "MoveTool.CenterHandle"
}

enum Events {
    CenterDown = "MoveTool.CenterDown",
    CenterUp = "MoveTool.CenterUp"
}

enum Handle {
    Center,
    Left,
    Right,
    Top,
    Bottom
}

export class MoveTool extends Tool {

    protected _selection: Array<GrObject> = [];
    private _ox: number;
    private _oy: number;

    constructor(renderer: ObjectRenderer) {
        super(renderer, States.Wait, States.Done);

        this._state.add(state(States.Wait), Events.CenterDown, state(States.CenterHandle));
        this._state.add(state(States.CenterHandle), InteractionEvents.MouseUp, state(States.Done));
    }

    finish() {
        super.finish();
        if (!this._object) {
            return;
        }
        this._renderer.removeAllHandles(this._object);
    }

    initialize() {
        if (!this._object) {
            return;
        }
        this._renderer.renderHandle(this._object, this._object.center, this._onHandleEvent.bind(this), Handle.Center);
        this._renderer.renderHandle(this._object, this._object.left, this._onHandleEvent.bind(this), Handle.Left);
        this._renderer.renderHandle(this._object, this._object.right, this._onHandleEvent.bind(this), Handle.Right);
        this._renderer.renderHandle(this._object, this._object.top, this._onHandleEvent.bind(this), Handle.Top);
        this._renderer.renderHandle(this._object, this._object.bottom, this._onHandleEvent.bind(this), Handle.Bottom);
        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, data: any): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown) {
            this._ox = this._object.x;
            this._oy = this._object.y;
            this._state.next(Events.CenterDown);
        }
    }

    set selection(value: Array<GrObject>) {
        this.finish();
        this.reset();
        this._selection = value;
        this.initialize();
    }

    protected get _object(): GrObject {
        return this._selection.length && this._selection[0];
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {
        if (!this._object) {
            return false;
        }

        this._state.next(interactionEvent);


        switch (this._state.state.id as States) {
            case States.Wait:
                break;

            case States.Done:
                this._object.x += eventData.dx;
                this._object.y += eventData.dy;
                this._renderer.render(this._object, true);
                return true;

            case States.CenterHandle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    this._object.x += eventData.dx;
                    this._object.y += eventData.dy;
                    this._renderer.render(this._object, true);
                }
                break;
        }


        return false;
    }

    public get result(): any {
        return null;
    }

    get code(): string {
        const dx = this._object.x - this._ox;
        const dy = this._object.y - this._oy;

        if (dx !== 0 && dy !== 0) {
            return `MOVE ${this._object.name} (${dx} ${dy})`
        } else {
            return null;
        }
    }
}