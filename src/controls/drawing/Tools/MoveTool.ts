import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {Tool} from "./Tool";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject, POI, POIMap} from "../Objects/GrObject";
import {state} from "../../../runtime/tools/StateMachine";
import {Point2D} from "../Objects/GeoMath";


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
    protected _movingObject: GrObject;
    protected _movingPOI: POI;
    protected _snappingObject: GrObject;
    protected _snappingPOI: string;
    protected _snapPoint: Point2D;

    private _ox: number;
    private _oy: number;

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
        this._movingPOI = this._movingObject = this._snappingObject = this._snappingPOI = this._snapPoint = null;
    }

    initialize() {
        if (!this._object) {
            return;
        }
        this._movingPOI = this._movingObject = this._snappingObject = this._snappingPOI = this._snapPoint = null;

        const poi: POIMap = this._object.pointsOfInterest;

        Object.keys(poi)
            .forEach(poiId => {
                this._renderer.renderHandle(this._object, poiId, poi[poiId], this._onHandleEvent.bind(this), Number(poiId));
            })

        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, poiId): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown) {
            this._state.next(Events.HandleDown);
            this._movingObject = object;
            this._movingPOI = poiId;

            const poi = object.pointsOfInterest[poiId];
            this._ox = poi.x;
            this._oy = poi.y;

            this._renderer.enablePOI(true, (object: GrObject, poiId: string, hit: boolean) => {
                if (hit) {
                    this._snappingObject = object;
                    this._snappingPOI = poiId;
                    this._snapPoint = this._snappingObject.pointsOfInterest[this._snappingPOI]
                } else {
                    this._snapPoint = this._snappingPOI = this._snappingObject = null;
                }
            }, [this._object]);
        }
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

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {
        this._state.next(interactionEvent);

        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }

        if (this._snapPoint) {
            eventData.dx = this._snapPoint.x - this._object.pointsOfInterest[this._movingPOI].x;
            eventData.dy = this._snapPoint.y - this._object.pointsOfInterest[this._movingPOI].y;
        }

        switch (this._state.state.id as States) {
            case States.Wait:
                this._movingPOI = this._movingObject = this._snappingObject = this._snappingPOI = this._snapPoint = null;

                break;

            case States.Done:
                this._movingObject.movePOI(this._movingPOI, new Point2D(eventData.dx, eventData.dy))
                this._renderer.render(this._object, true)
                this._renderer.enablePOI(false);
                this._snapPoint = null;
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    this._movingObject.movePOI(this._movingPOI, new Point2D(eventData.dx, eventData.dy))
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
        const poi = this._object.pointsOfInterest[this._movingPOI];
        const dx = poi.x - this._ox;
        const dy = poi.y - this._oy;

        if (dx !== 0 && dy !== 0) {
            if (this._snappingObject) {
                return `MOVE ${this._object.name} "${POI[this._movingPOI]}" ${this._snappingObject.name} "${POI[this._snappingPOI]}"`
            } else {
                return `MOVE ${this._object.name} "${POI[this._movingPOI]}" (${dx} ${dy})`
            }

        } else {
            return null;
        }
    }
}