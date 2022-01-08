import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {Tool} from "./Tool";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject, POI, POIMap} from "../Objects/GrObject";
import {state} from "../../../runtime/tools/StateMachine";
import {Point2D} from "../Objects/GeoMath";


enum States {
    Wait = "RotateTool.Wait",
    Done = "RotateTool.Done",
    Handle = "RotateTool.Handle"
}

enum Events {
    HandleDown = "RotateTool.HandleDown"
}


export class RotateTool extends Tool {

    protected _selection: Array<GrObject> = [];
    private _startVector: Point2D;
    private _finalAngle: number;

    constructor(renderer: ObjectRenderer) {
        super(renderer, States.Wait, States.Done);

        this._state.add(state(States.Wait), Events.HandleDown, state(States.Handle));
        this._state.add(state(States.Handle), InteractionEvents.MouseUp, state(States.Done));
        this._state.start(state(States.Wait));
    }

    abort() {
        if (this._object) {
            this._renderer.removeAllHandles(this._object);
        }
        super.abort();
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
        const poi: POIMap = this._object.pointsOfInterest;

        Object.keys(poi)
            .forEach(poiId => {
                if (poiId !== POI[POI.center]) {
                    this._renderer.renderHandle(this._object, poiId, poi[poiId], this._onHandleEvent.bind(this), poiId);
                }
            })

        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, poiId): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown) {
            const poi = this._object.pointsOfInterest[poiId];
            
            this._startVector = new Point2D(poi.x - this._object.x, poi.y - this._object.x);
            
            this._state.next(Events.HandleDown);
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
        this._state.next(interactionEvent);

        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }

        switch (this._state.state.id as States) {
            case States.Wait:
                break;

            case States.Done:
                const vector = { x: eventData.x - this._object.x, y: eventData.y - this._object.y }

                this._finalAngle = Math.atan2(vector.y, vector.x) - Math.atan2(this._startVector.y, this._startVector.x)
                this._object.rotation = this._finalAngle = (this._finalAngle * 180) / Math.PI;
                this._renderer.render(this._object, true);
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    const vector = { x: eventData.x - this._object.x, y: eventData.y - this._object.y }

                    const a = Math.atan2(vector.y, vector.x) - Math.atan2(this._startVector.y, this._startVector.x)
                    this._object.rotation = (a * 180) / Math.PI;

                    this._renderer.render(this._object, true);

                    const poi: POIMap = this._object.pointsOfInterest;

                    Object.keys(poi)
                        .forEach(poiId => {
                            this._renderer.updateHandle(this._object, poiId, poi[poiId]);
                        })
                }
                break;
        }


        return false;
    }

    public get result(): any {
        return `ROTATE ${this._object.uniqueName} ${this._finalAngle}`
    }
}