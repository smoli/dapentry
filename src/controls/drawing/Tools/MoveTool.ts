import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {Tool} from "./Tool";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject, POI, POIMap} from "../Objects/GrObject";
import {state} from "../../../runtime/tools/StateMachine";


enum States {
    Wait = "MoveTool.Wait",
    Done = "MoveTool.Done",
    Handle = "MoveTool.Handle"
}

enum Events {
    HandleDown = "MoveTool.HandleDown"
}


export class MoveTool extends Tool {

    protected _selection: Array<GrObject> = [];
    protected _activeObject:GrObject;
    protected _activePOI:POI;

    private _ox: number;
    private _oy: number;

    constructor(renderer: ObjectRenderer) {
        super(renderer, States.Wait, States.Done);

        this._state.add(state(States.Wait), Events.HandleDown, state(States.Handle));
        this._state.add(state(States.Handle), InteractionEvents.MouseUp, state(States.Done));
    }

    finish() {
        super.finish();
        if (!this._object) {
            return;
        }
        this._renderer.removeAllHandles(this._object);
        this._activePOI = null;
        this._activeObject = null;
    }

    initialize() {
        if (!this._object) {
            return;
        }
        this._activePOI = null;
        this._activeObject = null;

        const poi:POIMap = this._object.pointsOfInterest;

        Object.keys(poi)
            .forEach(poiId => {
                this._renderer.renderHandle(this._object, poi[poiId], this._onHandleEvent.bind(this), poiId);
            })

        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, poiId): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown) {
            this._ox = this._object.x;
            this._oy = this._object.y;
            this._state.next(Events.HandleDown);
            this._activeObject = object;
            this._activePOI = poiId;
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

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    this._activeObject.movePOI(this._activePOI, { x: eventData.dx, y: eventData.dy })
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
            return `MOVE ${this._object.name} "${POI[this._activePOI]}" (${dx} ${dy})`
        } else {
            return null;
        }
    }
}