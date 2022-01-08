import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
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

    private _ox: number;
    private _oy: number;
    private _lastSnapInfo: SnapInfo;

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
    }

    initialize() {
        if (!this._object) {
            return;
        }
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

            this.enableSnapping([this._object]);
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

        this._lastSnapInfo = this.tryToSnap(eventData);
        eventData = this._lastSnapInfo.event;

        let dx;
        let dy;
        if (this._object && this._movingPOI) {
            dx = eventData.x - this._object.pointsOfInterest[this._movingPOI].x;
            dy = eventData.y - this._object.pointsOfInterest[this._movingPOI].y;
        } else {
            return;
        }

        switch (this._state.state.id as States) {
            case States.Wait:
                this._movingPOI = this._movingObject = null;

                break;

            case States.Done:
                this._movingObject.movePOI(this._movingPOI, new Point2D(dx, dy))
                this._renderer.render(this._object, true)
                this._renderer.enablePOI(false);
                this.disableSnapping();
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    this._movingObject.movePOI(this._movingPOI, new Point2D(dx, dy))
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

        if (dx !== 0 || dy !== 0) {
            let name1 = this._object.name;

            if (this._lastSnapInfo && this._lastSnapInfo.object) {
                let name2 = this._lastSnapInfo.object.name;

                return `MOVE ${name1} "${POI[this._movingPOI]}" ${name2} "${POI[this._lastSnapInfo.poiId]}"`
            } else {
                return `MOVE ${name1} "${POI[this._movingPOI]}" (${dx} ${dy})`
            }

        } else {
            return null;
        }
    }
}